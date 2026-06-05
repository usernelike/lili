import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BarChart3, Building2, Home, Database, BookOpen, LogOut, User, Menu, X, Trophy, Sparkles } from 'lucide-react'
import FloatingAIChat from '../FloatingAIChat'
import { useMobile } from '../../hooks/useMobile'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/enterprise', label: '企业查询', icon: Building2 },
  { path: '/financial', label: '金融数据', icon: BarChart3 },
  { path: '/lili', label: 'lili数据源', icon: Database },
  { path: '/interview', label: '面试知识库', icon: BookOpen },
  { path: '/worldcup', label: '世界杯预测', icon: Trophy },
  { path: '/divination', label: 'AI占卜', icon: Sparkles },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [menuOpen, setMenuOpen] = useState(false)
  const isHome = location.pathname === '/'
  const isMobile = useMobile()

  useEffect(() => {
    const check = () => setToken(localStorage.getItem('token'))
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.dataset.scrollLocked = 'true'
    } else {
      document.body.style.overflow = ''
      delete document.body.dataset.scrollLocked
    }
    return () => {
      document.body.style.overflow = ''
      delete document.body.dataset.scrollLocked
    }
  }, [menuOpen])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setMenuOpen(false)
    navigate('/login')
  }

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
          padding: isMobile ? '12px 16px' : '16px 40px',
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
              width: isMobile ? 32 : 36,
              height: isMobile ? 32 : 36,
              borderRadius: 10,
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart3 size={isMobile ? 18 : 20} color="#fff" />
          </div>
          <span
            style={{
              fontSize: isMobile ? 18 : 20,
              fontWeight: 700,
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            lili Hub
          </span>
        </div>

        {isMobile ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: 8,
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
            {token ? (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                <LogOut size={16} />
                退出
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'rgba(0, 212, 255, 0.1)',
                  color: 'var(--accent-cyan)',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <User size={16} />
                登录
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(10, 10, 15, 0.98)',
            backdropFilter: 'blur(20px)',
            paddingTop: 80,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: '80px 20px 20px',
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setMenuOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: isActive
                    ? 'rgba(0, 212, 255, 0.1)'
                    : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <Icon size={20} />
                {item.label}
              </button>
            )
          })}
          <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
            {token ? (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'transparent',
                  color: '#ef4444',
                  fontSize: 16,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <LogOut size={20} />
                退出登录
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login')
                  setMenuOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'rgba(0, 212, 255, 0.1)',
                  color: 'var(--accent-cyan)',
                  fontSize: 16,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <User size={20} />
                登录
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* AI Assistant */}
      <FloatingAIChat />
    </div>
  )
}
