import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Database, TrendingUp, Search, BarChart3, Globe, Shield } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const dataSources = [
  {
    name: '天眼查',
    icon: Search,
    color: '#3b82f6',
    description: '企业工商信息、股东结构、关联关系图谱',
    features: [
      '企业基本信息查询',
      '股东及出资信息',
      '主要人员与高管',
      '变更记录追踪',
      '司法风险与失信',
      '知识产权与专利',
    ],
    status: '接入中',
  },
  {
    name: '同花顺',
    icon: TrendingUp,
    color: '#f59e0b',
    description: 'A股/港股/美股实时行情、Level-2数据',
    features: [
      '实时股票行情',
      '历史K线数据',
      '财务指标分析',
      '资金流向追踪',
      '技术指标计算',
      '板块与行业分析',
    ],
    status: '接入中',
  },
  {
    name: '新浪财经',
    icon: Globe,
    color: '#ef4444',
    description: '实时行情、新闻资讯、市场数据',
    features: [
      '沪深A股实时报价',
      '大盘指数监控',
      '财经新闻推送',
      '个股F10资料',
      '港股美股行情',
      '基金与债券数据',
    ],
    status: '已接入',
  },
  {
    name: '腾讯证券',
    icon: BarChart3,
    color: '#10b981',
    description: '毫秒级行情更新、多市场覆盖',
    features: [
      'A股实时快照',
      '港股通数据',
      '科创板/创业板',
      '北交所行情',
      'ETF与可转债',
      '期权期货数据',
    ],
    status: '已接入',
  },
]

export default function DataSourcesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ds-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'left 80%',
          containerAnimation: gsap.getById && (gsap.getById('horizontal') as gsap.core.Animation),
        },
      })
      gsap.from('.ds-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'left 70%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      id="data-sources"
      className="h-section"
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
        position: 'relative',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 60, zIndex: 2 }}>
        <div
          className="ds-title"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 20,
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid var(--border-glow)',
            color: 'var(--accent-cyan)',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          <Database size={14} />
          数据源生态
        </div>
        <h2
          className="ds-title"
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          多源数据<span className="gradient-text">一站式聚合</span>
        </h2>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
          已对接及即将接入国内外权威数据平台，覆盖企业征信与金融行情全链路
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          maxWidth: 1200,
          width: '100%',
          zIndex: 2,
        }}
      >
        {dataSources.map((source) => {
          const Icon = source.icon
          return (
            <div
              key={source.name}
              className="ds-card glass-card"
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'default',
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 28px rgba(${source.color === '#3b82f6' ? '59,130,246' : source.color === '#f59e0b' ? '245,158,11' : source.color === '#ef4444' ? '239,68,68' : '16,185,129'}, 0.12)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${source.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} style={{ color: source.color }} />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: source.status === '已接入' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    color: source.status === '已接入' ? '#10b981' : '#f59e0b',
                    fontWeight: 500,
                  }}
                >
                  {source.status}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{source.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {source.description}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {source.features.map((feature) => (
                  <span
                    key={feature}
                    style={{
                      fontSize: 11,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)',
          zIndex: 2,
        }}
      >
        <Shield size={18} style={{ color: 'var(--accent-green)' }} />
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          所有数据均来自官方授权渠道，合规合法，支持商业用途
        </span>
      </div>
    </div>
  )
}
