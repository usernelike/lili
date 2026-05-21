import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader2, ChevronDown, ChevronUp, Brain } from 'lucide-react'
import { apiFetch } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { useMobile } from '../hooks/useMobile'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  id: string
  thinking?: string
  // Buffered content for typewriter effect (what's actually displayed)
  displayedContent?: string
  displayedThinking?: string
}

function parseContent(text: string, navigate: (path: string) => void): React.ReactNode {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const label = match[1]
    const path = match[2]
    parts.push(
      <a
        key={match.index}
        href={path}
        onClick={(e) => {
          e.preventDefault()
          navigate(path)
        }}
        style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', cursor: 'pointer' }}
      >
        {label}
      </a>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
}

// Typewriter cursor component
function TypewriterCursor({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <span
      style={{
        display: 'inline-block',
        width: 2,
        height: '1em',
        background: 'var(--accent-cyan, #00d4ff)',
        marginLeft: 1,
        verticalAlign: 'text-bottom',
        animation: 'blink 1s step-end infinite',
      }}
    />
  )
}

export default function FloatingAIChat() {
  const navigate = useNavigate()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '你好！我是 lili Hub 的 AI 助手，可以帮你快速了解平台功能、定位页面。请问有什么可以帮你的？',
      id: 'welcome',
      displayedContent: '你好！我是 lili Hub 的 AI 助手，可以帮你快速了解平台功能、定位页面。请问有什么可以帮你的？',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Scroll control refs
  const userScrolledUpRef = useRef(false)
  // Track the last scroll height to detect new content
  const lastScrollHeightRef = useRef(0)
  // Ref for streaming message ID (to know which msg is actively streaming)
  const streamingMsgIdRef = useRef<string | null>(null)
  // Typewriter animation frame ref
  const typewriterFrameRef = useRef<number | null>(null)

  // Check login
  const [hasToken, setHasToken] = useState(false)
  useEffect(() => {
    const check = () => setHasToken(!!localStorage.getItem('token'))
    check()
    window.addEventListener('storage', check)
    const interval = setInterval(check, 1000)
    return () => {
      window.removeEventListener('storage', check)
      clearInterval(interval)
    }
  }, [])

  // --- Smart Scroll Logic ---
  // Threshold: if user is within this many px of bottom, consider them "at bottom"
  const SCROLL_BOTTOM_THRESHOLD = 80

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }, [])

  // Auto-scroll when messages change (new content arriving during stream)
  useEffect(() => {
    if (!messagesContainerRef.current) return
    const container = messagesContainerRef.current
    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    lastScrollHeightRef.current = scrollHeight

    // Only auto-scroll if user is at/near bottom — never steal scroll from user
    if (distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD) {
      scrollToBottom('smooth')
    }
    // If user hasn't manually scrolled up at all (first message, new conversation),
    // also scroll to bottom
    else if (!userScrolledUpRef.current) {
      scrollToBottom('instant')
    }
  }, [messages, scrollToBottom])

  // Listen for user scroll events
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = container
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight
        // User is considered "scrolled up" if they're beyond the threshold from bottom
        userScrolledUpRef.current = distanceFromBottom > SCROLL_BOTTOM_THRESHOLD
        ticking = false
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Reset scroll state when opening chat
  useEffect(() => {
    if (isOpen) {
      userScrolledUpRef.current = false
      // Small delay to let DOM render, then scroll to bottom
      requestAnimationFrame(() => {
        scrollToBottom('instant')
      })
    }
  }, [isOpen, scrollToBottom])

  // --- Typewriter Effect ---
  // Runs on rAF tick to gradually reveal buffered content
  useEffect(() => {
    const tick = () => {
      setMessages((prev) => {
        const updated = prev.map((msg) => {
          // Only apply typewriter to the currently streaming assistant message
          if (msg.id !== streamingMsgIdRef.current || msg.role !== 'assistant') return msg

          const rawContent = msg.content || ''
          const rawThinking = msg.thinking || ''
          const currentDisplayedContent = msg.displayedContent || ''
          const currentDisplayedThinking = msg.displayedThinking || ''

          // Check if there's unrevealed content or thinking
          const contentRemaining = rawContent.length - currentDisplayedContent.length
          const thinkingRemaining = rawThinking.length - currentDisplayedThinking.length

          if (contentRemaining <= 0 && thinkingRemaining <= 0) return msg

          // Adaptive speed: more remaining chars → faster typing
          // Base speed ~30ms per char, but scales down with backlog
          const totalRemaining = contentRemaining + thinkingRemaining
          let charsToReveal: number

          if (totalRemaining > 200) {
            // Large backlog: reveal in bigger chunks (fast mode)
            charsToReveal = Math.max(Math.floor(totalRemaining / 20), 8)
          } else if (totalRemaining > 50) {
            // Medium backlog: moderate speed
            charsToReveal = Math.max(Math.floor(totalRemaining / 30), 3)
          } else {
            // Small amount: one char at a time for smooth effect
            charsToReveal = 1
          }

          let newDisplayedContent = currentDisplayedContent
          let newDisplayedThinking = currentDisplayedThinking

          // Prioritize revealing thinking first, then content
          if (thinkingRemaining > 0) {
            const revealCount = Math.min(charsToReveal, thinkingRemaining)
            newDisplayedThinking = rawThinking.slice(0, currentDisplayedThinking.length + revealCount)
          } else if (contentRemaining > 0) {
            const revealCount = Math.min(charsToReveal, contentRemaining)
            newDisplayedContent = rawContent.slice(0, currentDisplayedContent.length + revealCount)
          }

          return {
            ...msg,
            displayedContent: newDisplayedContent,
            displayedThinking: newDisplayedThinking,
          }
        })

        return updated
      })

      typewriterFrameRef.current = requestAnimationFrame(tick)
    }

    // Only run typewriter while streaming
    if (isStreaming) {
      typewriterFrameRef.current = requestAnimationFrame(tick)
    }

    return () => {
      if (typewriterFrameRef.current) {
        cancelAnimationFrame(typewriterFrameRef.current)
        typewriterFrameRef.current = null
      }
    }
  }, [isStreaming])

  // When streaming ends, instantly reveal all remaining buffered content
  useEffect(() => {
    if (!isStreaming) {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          displayedContent: msg.content,
          displayedThinking: msg.thinking,
        }))
      )
      streamingMsgIdRef.current = null
    }
  }, [isStreaming])

  // --- Send Message ---
  const sendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return

    const userMsg: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
      id: Date.now().toString(),
    }
    const assistantId = (Date.now() + 1).toString()
    streamingMsgIdRef.current = assistantId

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsStreaming(true)
    userScrolledUpRef.current = false // Reset scroll lock on new message

    // Add placeholder for assistant
    setMessages((prev) => [...prev, { role: 'assistant', content: '', id: assistantId, thinking: '', displayedContent: '', displayedThinking: '' }])

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const controller = new AbortController()
      const res = await apiFetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const errorText = await res.text()
        const errorContent = '请求失败 (' + res.status + '): ' + errorText
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: errorContent, displayedContent: errorContent } : m))
        )
        setIsStreaming(false)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (!reader) {
        const errContent = '连接失败，请重试'
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: errContent, displayedContent: errContent } : m))
        )
        setIsStreaming(false)
        return
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        let contentDelta = ''
        let thinkingDelta = ''
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta
            // Kimi API thinking/reasoning content
            const reasoningContent = delta?.reasoning_content || delta?.reasoning || delta?.thinking
            if (reasoningContent) {
              thinkingDelta += reasoningContent
            }
            // Actual response content
            if (delta?.content) {
              contentDelta += delta.content
            }
          } catch {
            // ignore parse error
          }
        }

        if (contentDelta || thinkingDelta) {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantId) return m
              const updated = {
                ...m,
                content: m.content + contentDelta,
                thinking: (m.thinking || '') + thinkingDelta,
              }
              // Auto-expand thinking when first receiving thinking content
              if (thinkingDelta && !m.thinking) {
                setExpandedThinking((prevSet) => {
                  const next = new Set(prevSet)
                  next.add(assistantId)
                  return next
                })
              }
              return updated
            })
          )
        }
      }
    } catch (err) {
      const errorContent = '请求失败: ' + (err as Error).message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: errorContent, displayedContent: errorContent } : m
        )
      )
    } finally {
      setIsStreaming(false)
      // Auto-collapse thinking block when streaming ends
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1]
        if (lastMsg?.id === assistantId && lastMsg.thinking) {
          setExpandedThinking((prevSet) => {
            const next = new Set(prevSet)
            next.delete(assistantId)
            return next
          })
        }
        return prev
      })
    }
  }

  if (!hasToken) return null

  return (
    <>
      {/* CSS keyframe for cursor blink */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Floating Button */}
      {!(isMobile && isOpen) && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed',
            right: isMobile ? 16 : 24,
            bottom: isMobile ? 24 : 80,
            zIndex: 9999,
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
            transition: 'all 0.3s',
            userSelect: 'none',
          }}
          title="AI 助手"
        >
          {isOpen ? (
            <X size={isMobile ? 20 : 24} color="#fff" />
          ) : (
            <MessageSquare size={isMobile ? 20 : 24} color="#fff" />
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          style={{
            position: 'fixed',
            right: isMobile ? 0 : 24,
            bottom: isMobile ? 0 : 142,
            zIndex: 9998,
            width: isMobile ? '100%' : 380,
            maxHeight: isMobile ? '100vh' : 'calc(100vh - 120px)',
            height: isMobile ? '100vh' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: isMobile ? 0 : 16,
            background: 'var(--bg-card)',
            border: isMobile ? 'none' : '1px solid var(--border-subtle)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: isMobile ? '12px 16px' : '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
            }}
          >
            <Bot size={20} color="#fff" />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>lili AI 助手</span>
            {isStreaming && <Loader2 size={14} color="#fff" className="spin" />}
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxHeight: isMobile ? 'none' : 400,
            }}
          >
            {messages.map((msg) => {
              const isThinkingExpanded = expandedThinking.has(msg.id)
              const isCurrentlyStreaming = msg.id === streamingMsgIdRef.current && isStreaming
              // Use displayed versions for rendering (typewriter effect)
              const renderContent = msg.displayedContent ?? msg.content
              const renderThinking = msg.displayedThinking ?? msg.thinking
              const hasContentToShow = msg.role === 'user' || renderContent

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: msg.role === 'user' ? 'var(--accent-cyan)' : 'rgba(124,58,237,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {msg.role === 'user' ? (
                      <User size={14} color="#fff" />
                    ) : (
                      <Bot size={14} color="#fff" />
                    )}
                  </div>
                  <div style={{ maxWidth: isMobile ? '75%' : '80%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Thinking block */}
                    {msg.role === 'assistant' && renderThinking && (
                      <div
                        style={{
                          padding: '8px 12px',
                          borderRadius: 10,
                          background: 'rgba(168, 85, 247, 0.08)',
                          border: '1px solid rgba(168, 85, 247, 0.15)',
                        }}
                      >
                        <button
                          onClick={() => {
                            const next = new Set(expandedThinking)
                            if (isThinkingExpanded) next.delete(msg.id)
                            else next.add(msg.id)
                            setExpandedThinking(next)
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary, #888)',
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: 0,
                            fontFamily: 'inherit',
                            width: 'fit-content',
                          }}
                        >
                          <Brain size={13} style={{ color: '#a855f7' }} />
                          {isCurrentlyStreaming && !renderContent ? '正在思考...' : '思考过程'}
                          {isThinkingExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        {(isThinkingExpanded || isCurrentlyStreaming) && (
                          <div
                            ref={isCurrentlyStreaming ? (el: HTMLDivElement | null) => {
                              if (el) {
                                // Auto-scroll thinking area to bottom during streaming
                                requestAnimationFrame(() => {
                                  el.scrollTop = el.scrollHeight
                                })
                              }
                            } : undefined}
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              lineHeight: 1.7,
                              color: 'var(--text-secondary, #999)',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              maxHeight: isCurrentlyStreaming ? Math.min(300, window.innerHeight * 0.3) : 200,
                              overflowY: 'auto',
                            }}
                          >
                            {renderThinking}
                            <TypewriterCursor active={isCurrentlyStreaming && (msg.thinking ?? '').length > (renderThinking.length)} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Main content bubble — hidden when empty during streaming */}
                    {hasContentToShow && (
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: 12,
                          background: msg.role === 'user' ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)',
                          color: 'var(--text-primary)',
                          fontSize: 13,
                          lineHeight: 1.6,
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {parseContent(renderContent, navigate)}
                        <TypewriterCursor active={isCurrentlyStreaming && (msg.content ?? '').length > (renderContent.length)} />
                      </div>
                    )}

                    {/* Show loading spinner only when no thinking and no content yet */}
                    {msg.role === 'assistant' && !renderThinking && !renderContent && isStreaming && (
                      <Loader2 size={14} color="var(--accent-cyan)" className="spin" />
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: isMobile ? '10px 12px' : '12px 16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="询问平台功能..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !shiftKey(e)) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              disabled={isStreaming}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text-primary)',
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !inputValue.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isStreaming || !inputValue.trim() ? 'not-allowed' : 'pointer',
                opacity: isStreaming || !inputValue.trim() ? 0.5 : 1,
              }}
            >
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Helper: detect Shift key (for multiline input support later)
function shiftKey(e: React.KeyboardEvent): boolean {
  return e.shiftKey
}
