import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader2, ChevronDown, ChevronUp, Brain } from 'lucide-react'
import { apiFetch } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { useMobile } from '../hooks/useMobile'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  id: string
  thinking?: string
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

export default function FloatingAIChat() {
  const navigate = useNavigate()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '你好！我是 lili Hub 的 AI 助手，可以帮你快速了解平台功能、定位页面。请问有什么可以帮你的？',
      id: 'welcome',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  // Track whether user has manually scrolled up (auto-scroll is paused)
  const userScrolledUpRef = useRef(false)

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

  // Smart scroll: auto-scroll when streaming, pause on user scroll-up, resume at bottom
  useEffect(() => {
    if (!messagesContainerRef.current) return
    const container = messagesContainerRef.current
    const { scrollTop, scrollHeight, clientHeight } = container
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 30

    if (isAtBottom || !userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Listen for user scroll events to detect manual scroll-up
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
        userScrolledUpRef.current = distanceFromBottom > 50
        ticking = false
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])



  // Send message
  const sendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return

    const userMsg: ChatMessage = {
      role: 'user',
      content: inputValue.trim(),
      id: Date.now().toString(),
    }
    const assistantId = (Date.now() + 1).toString()

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsStreaming(true)

    // Add placeholder for assistant
    setMessages((prev) => [...prev, { role: 'assistant', content: '', id: assistantId, thinking: '' }])

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
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: '请求失败 (' + res.status + '): ' + errorText } : m))
        )
        setIsStreaming(false)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (!reader) {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: '连接失败，请重试' } : m))
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
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: '请求失败: ' + (err as Error).message } : m
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
      {/* Floating Button - H5 全屏打开时隐藏，避免遮挡输入区发送按钮 */}
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
                    {/* Thinking / Reasoning block - collapsible */}
                    {msg.role === 'assistant' && msg.thinking && (
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
                          {isStreaming && !msg.content ? '正在思考...' : '思考过程'}
                          {isThinkingExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        {isThinkingExpanded && (
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              lineHeight: 1.7,
                              color: 'var(--text-secondary, #999)',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              maxHeight: 200,
                              overflowY: 'auto',
                            }}
                          >
                            {msg.thinking}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Main content bubble — hide when empty during streaming (show only thinking) */}
                    {(msg.role === 'user' || msg.content) && (
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
                        {parseContent(msg.content, navigate)}
                      </div>
                    )}
                    {/* Show loading spinner only when no thinking and no content yet */}
                    {msg.role === 'assistant' && msg.content === '' && !msg.thinking && isStreaming && (
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
                if (e.key === 'Enter' && !e.shiftKey) {
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
