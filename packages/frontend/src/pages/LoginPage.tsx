import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import StickFigureScene from '../components/StickFigure/StickFigure'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [figureState, setFigureState] = useState<'normal' | 'peek' | 'hide'>('normal')

  const handleFocus = (type: string) => {
    setFigureState(type === 'password' ? 'hide' : 'normal')
  }

  const handleBlur = () => {
    setFigureState('normal')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) return setError('请输入用户名')
    if (!password) return setError('请输入密码')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const json = await res.json()
      if (json.success && json.data?.token) {
        localStorage.setItem('token', json.data.token)
        navigate('/')
      } else {
        setError(json.message || '登录失败')
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
          <StickFigureScene state={figureState} />
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
            欢迎回来，登录你的账号
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
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>账号登录</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
            还没有账号？{' '}
            <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
              立即注册
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
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
