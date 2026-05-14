import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
      }}
    >
      <div
        style={{
          fontSize: 'clamp(80px, 15vw, 150px)',
          fontWeight: 800,
          lineHeight: 1,
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}
      >
        404
      </div>
      <h2
        style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 600,
          marginBottom: 12,
          color: 'var(--text-primary)',
        }}
      >
        页面不存在
      </h2>
      <p
        style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          marginBottom: 32,
          maxWidth: 400,
        }}
      >
        您访问的页面可能已被移除或暂时不可用
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-cyan)'
            e.currentTarget.style.color = 'var(--accent-cyan)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <ArrowLeft size={16} /> 返回上一页
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 12,
            border: 'none',
            background: 'var(--gradient-accent)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,212,255,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Home size={16} /> 回到首页
        </button>
      </div>
    </div>
  )
}
