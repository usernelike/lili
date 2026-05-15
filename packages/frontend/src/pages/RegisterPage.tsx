import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import StickFigureScene from '../components/StickFigure/StickFigure'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const handleFocus = (type: string) => {
    setIsPasswordFocused(type === 'password')
  }

  const handleBlur = () => {
    setIsPasswordFocused(false)
  }

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background: 'var(--bg-primary)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'center',
          maxWidth: 960,
          width: '100%',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* 左侧：动画 */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 400, textAlign: 'center' }}>
          <StickFigureScene isPasswordFocused={isPasswordFocused} />
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginTop: 24,
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Lili Hub
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
            注册账号，开启你的数据之旅
          </p>
        </div>

        {/* 右侧：表单 */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            maxWidth: 420,
            background: 'var(--bg-card)',
            borderRadius: 20,
            border: '1px solid var(--border-subtle)',
            padding: '40px 36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>创建账号</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
            已有账号？{' '}
            <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
              立即登录
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => handleFocus('text')}
              onBlur={handleBlur}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => handleFocus('text')}
              onBlur={handleBlur}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="密码（至少6位）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="确认密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              style={inputStyle}
            />

            {error && (
              <div style={{ color: '#ff6b6b', fontSize: 13, textAlign: 'center' }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'inherit',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
