import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMobile } from '../hooks/useMobile'

interface StockPreview {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
}

const previewStocks: StockPreview[] = [
  { code: '000001', name: '平安银行', price: 12.35, change: 0.23, changePercent: 1.9 },
  { code: '000002', name: '万科A', price: 15.68, change: -0.12, changePercent: -0.76 },
  { code: '600519', name: '贵州茅台', price: 1688.0, change: 12.5, changePercent: 0.75 },
  { code: '300033', name: '同花顺', price: 285.6, change: 8.2, changePercent: 2.95 },
  { code: '000858', name: '五粮液', price: 152.3, change: -1.8, changePercent: -1.17 },
  { code: '002594', name: '比亚迪', price: 268.5, change: 5.3, changePercent: 2.01 },
]

function MiniSparkline({ positive }: { positive: boolean }) {
  const path = useMemo(() => {
    const points = Array.from({ length: 20 }, () => Math.random() * 30 + 10)
    return points.map((y, i) => `${i * 5},${40 - y}`).join(' ')
  }, [])

  return (
    <svg width={100} height={40} viewBox="0 0 100 40">
      <polyline
        points={path}
        fill="none"
        stroke={positive ? 'var(--accent-green)' : 'var(--accent-red)'}
        strokeWidth={1.5}
        opacity={0.6}
      />
    </svg>
  )
}

export default function FinancialPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isMobile = useMobile()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (isMobile) return
    const ctx = gsap.context(() => {
      gsap.from('.fp-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from('.fp-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
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
        padding: isMobile ? '60px 16px' : '0 60px',
        position: 'relative',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 50, zIndex: 2 }}>
        <div
          className="fp-title"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 20,
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: 'var(--accent-green)',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          <TrendingUp size={14} />
          实时行情
        </div>
        <h2
          className="fp-title"
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          毫秒级<span className="gradient-text">金融数据</span>
        </h2>
        <p style={{ fontSize: isMobile ? 15 : 18, color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto' }}>
          已接入新浪财经与腾讯证券，A股实时行情零延迟推送
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? 10 : 20,
          maxWidth: 1000,
          width: '100%',
          zIndex: 2,
        }}
      >
        {previewStocks.map((stock, index) => {
          const isPositive = stock.change >= 0
          const isHovered = hoveredIndex === index

          return (
            <div
              key={stock.code}
              className="fp-card"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: isMobile ? 16 : 24,
                borderRadius: 16,
                background: isHovered
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isHovered ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                transition: 'all 0.3s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
              onClick={() => navigate('/financial')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, marginBottom: 4 }}>{stock.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stock.code}</div>
                </div>
                {!isMobile && <MiniSparkline positive={isPositive} />}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>¥{stock.price.toFixed(2)}</span>
                <span
                  style={{
                    fontSize: isMobile ? 12 : 14,
                    fontWeight: 600,
                    color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {isPositive ? <TrendingUp size={isMobile ? 12 : 14} /> : <TrendingDown size={isMobile ? 12 : 14} />}
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => navigate('/financial')}
        style={{
          marginTop: isMobile ? 24 : 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 28px',
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
          e.currentTarget.style.borderColor = 'var(--accent-green)'
          e.currentTarget.style.color = 'var(--accent-green)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }}
      >
        查看全部行情 <ArrowRight size={16} />
      </button>
    </div>
  )
}
