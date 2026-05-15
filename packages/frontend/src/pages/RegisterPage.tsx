import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AnimatedCharacters } from '../components/AnimatedCharacters'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const handleFocus = () => setIsTyping(true)
  const handleBlur = () => setIsTyping(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) return setError('请输入用户名')
    if (!/^1[3-9]\d{9}$/.test(phone)) return setError('手机号格式不正确')
    if (password.length < 6) return setError('密码至少6位')
    if (password !== confirmPassword) return setError('两次密码不一致')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, password, confirmPassword }),
      })
      const json = await res.json()
      if (json.success) {
        navigate('/login')
      } else {
        setError(json.message || '注册失败')
      }
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left: Animated Characters */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          padding: 48,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: 300,
            height: 300,
            background: 'rgba(124,58,237,0.25)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: 250,
            height: 250,
            background: 'rgba(59,130,246,0.2)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#fff',
              textDecoration: 'none',
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 18 }}>🧭</span>
            </div>
            Lili Hub
          </Link>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            flex: 1,
          }}
        >
          <AnimatedCharacters
            isTyping={isTyping}
            showPassword={showPassword}
            passwordLength={password.length}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 24 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            数据驱动决策
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            投资更有底气
          </span>
        </div>
      </div>

      {/* Right: Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          minWidth: 400,
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 40 }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                marginBottom: 8,
                color: 'var(--text-primary)',
              }}
            >
              创建账号
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              填写以下信息开始使用
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 8,
                  color: 'var(--text-primary)',
                }}
              >
                用户名
              </label>
              <input
                type="text"
                placeholder="输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 8,
                  color: 'var(--text-primary)',
                }}
              >
                手机号
              </label>
              <input
                type="text"
                placeholder="输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 8,
                  color: 'var(--text-primary)',
                }}
              >
                密码
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="至少6位密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 8,
                  color: 'var(--text-primary)',
                }}
              >
                确认密码
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#ef4444',
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                marginTop: 8,
              }}
            >
              {loading ? '注册中...' : '注册'}
            </button>

            <div
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: 'var(--text-secondary)',
                marginTop: 8,
              }}
            >
              已有账号？{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--accent-cyan)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                立即登录
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
