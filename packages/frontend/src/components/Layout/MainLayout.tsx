import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BarChart3, Building2, Home, Database, BookOpen } from 'lucide-react'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/enterprise', label: '企业查询', icon: Building2 },
  { path: '/financial', label: '金融数据', icon: BarChart3 },
  { path: '/lili', label: 'lili数据源', icon: Database },
  // { path: '/interview', label: '面试知识库', icon: BookOpen },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '16px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          background: scrolled || !isHome
            ? 'rgba(10, 10, 15, 0.85)'
            : 'transparent',
          backdropFilter: scrolled || !isHome ? 'blur(20px)' : 'none',
          borderBottom: scrolled || !isHome
            ? '1px solid var(--border-subtle)'
            : '1px solid transparent',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart3 size={20} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            lili Hub
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive
                    ? 'rgba(0, 212, 255, 0.1)'
                    : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-cyan)'
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.08)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
