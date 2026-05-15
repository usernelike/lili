import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { apiFetch } from '../utils/api'
import { useNavigate } from 'react-router-dom'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  id: string
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)

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

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])



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
    setMessages((prev) => [...prev, { role: 'assistant', content: '', id: assistantId }])

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await apiFetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history }),
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
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              contentDelta += delta
            }
          } catch {
            // ignore parse error
          }
        }

        if (contentDelta) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + contentDelta } : m
            )
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
    }
  }

  if (!hasToken) return null

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 80,
          zIndex: 9999,
          width: 56,
          height: 56,
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
          <X size={24} color="#fff" />
        ) : (
          <MessageSquare size={24} color="#fff" />
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          style={{
            position: 'fixed',
            right: 24,
            bottom: 142,
            zIndex: 9998,
            width: 380,
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
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
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxHeight: 400,
            }}
          >
            {messages.map((msg) => (
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
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: msg.role === 'user' ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    lineHeight: 1.6,
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.role === 'assistant' && msg.content === '' && isStreaming ? (
                    <Loader2 size={14} color="var(--accent-cyan)" className="spin" />
                  ) : (
                    parseContent(msg.content, navigate)
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
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
