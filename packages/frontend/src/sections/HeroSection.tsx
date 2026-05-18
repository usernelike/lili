import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Database, TrendingUp, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMobile } from '../hooks/useMobile'

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isMobile = useMobile()

  useEffect(() => {
    if (isMobile) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
      })
      gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
      })
      gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.7,
      })
      gsap.from('.hero-stats', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.9,
        stagger: 0.1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <div
      ref={sectionRef}
      className="h-section"
      style={{
        width: isMobile ? '100%' : '100vw',
        minHeight: isMobile ? 'auto' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: isMobile ? '80px 16px 60px' : '0 60px',
        background: 'var(--gradient-hero)',
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div style={{ textAlign: 'center', maxWidth: 900, zIndex: 2 }}>
        <div
          className="hero-title"
          style={{
            fontSize: 'clamp(32px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>一站式</span>
          <br />
          <span className="gradient-text">数据智能平台</span>
        </div>

        <p
          className="hero-subtitle"
          style={{
            fontSize: 'clamp(14px, 2vw, 20px)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 600,
            margin: '0 auto 40px',
          }}
        >
          聚合天眼查、同花顺、新浪财经等权威数据源，
          {isMobile ? <br /> : ' '}
          为企业提供查询、分析、决策一体化的数据服务
        </p>

        <div
          className="hero-cta"
          style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 60, flexWrap: 'wrap' }}
        >
          <button
            onClick={() => navigate('/financial')}
            style={{
              padding: isMobile ? '12px 24px' : '14px 32px',
              borderRadius: 12,
              border: 'none',
              background: 'var(--gradient-accent)',
              color: '#fff',
              fontSize: isMobile ? 14 : 16,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'inherit',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            探索数据 <ArrowRight size={isMobile ? 16 : 18} />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('data-sources')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              padding: isMobile ? '12px 24px' : '14px 32px',
              borderRadius: 12,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: isMobile ? 14 : 16,
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
            了解更多
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? 32 : 60,
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: Database, value: '4+', label: '权威数据源' },
            { icon: TrendingUp, value: '5000+', label: 'A股实时行情' },
            { icon: Building2, value: '2.8亿', label: '企业数据' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="hero-stats"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Icon size={isMobile ? 20 : 24} style={{ color: 'var(--accent-cyan)', opacity: 0.8 }} />
                <div
                  style={{
                    fontSize: isMobile ? 22 : 28,
                    fontWeight: 700,
                    background: 'var(--gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: isMobile ? 12 : 14, color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scroll hint */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-muted)',
            fontSize: 12,
          }}
        >
          <span>向下滚动探索</span>
          <div
            style={{
              width: 1,
              height: 40,
              background: 'linear-gradient(to bottom, var(--accent-cyan), transparent)',
            }}
          />
        </div>
      )}
    </div>
  )
}
