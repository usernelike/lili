import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Search, Building2, Users, Gavel, FileText, BadgeCheck, ExternalLink } from 'lucide-react'
import { useMobile } from '../hooks/useMobile'

const dataDimensions = [
  { icon: Building2, label: '工商信息', desc: '注册信息、经营范围、注册资本' },
  { icon: Users, label: '股东高管', desc: '股东结构、出资比例、主要人员' },
  { icon: Gavel, label: '司法风险', desc: '法律诉讼、失信被执行、开庭公告' },
  { icon: FileText, label: '经营状况', desc: '年报信息、行政许可、行政处罚' },
  { icon: BadgeCheck, label: '知识产权', desc: '专利、商标、软件著作权' },
  { icon: Search, label: '关联关系', desc: '关联企业、实际控制人图谱' },
]

const platforms = [
  { name: '天眼查', url: 'https://www.tianyancha.com/search?key=' },
  { name: '爱企查', url: 'https://aiqicha.baidu.com/s?q=' },
  { name: '企查查', url: 'https://www.qcc.com/web/search?key=' },
]

export default function EnterprisePreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const [searchValue, setSearchValue] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0])

  useEffect(() => {
    if (isMobile) return
    const ctx = gsap.context(() => {
      gsap.from('.ep-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from('.ep-search', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      })
      gsap.from('.ep-dim', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.4,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  const handleSearch = () => {
    if (searchValue.trim()) {
      window.open(selectedPlatform.url + encodeURIComponent(searchValue.trim()), '_blank')
    }
  }

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
          top: '50%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 50, zIndex: 2 }}>
        <div
          className="ep-title"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 20,
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
            color: '#3b82f6',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          <Building2 size={14} />
          企业征信
        </div>
        <h2
          className="ep-title"
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          2.8亿企业<span className="text-gradient-cyan">全景画像</span>
        </h2>
        <p style={{ fontSize: isMobile ? 15 : 18, color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto' }}>
          即将接入天眼查全量数据库，覆盖工商、司法、经营、知识产权等全维度信息
        </p>
      </div>

      {/* Search Demo */}
      <div
        className="ep-search"
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: isMobile ? 32 : 50,
          zIndex: 2,
          maxWidth: 700,
          width: '100%',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => setSelectedPlatform(p)}
              style={{
                padding: isMobile ? '10px 12px' : '12px 16px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: selectedPlatform.name === p.name ? '#3b82f6' : 'var(--border-subtle)',
                background: selectedPlatform.name === p.name ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: selectedPlatform.name === p.name ? '#3b82f6' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="输入企业名称搜索..."
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingRight: isMobile ? 80 : 100,
              borderRadius: 12,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: 15,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: isMobile ? '6px 12px' : '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Search size={14} /> {isMobile ? '' : '搜索'}
          </button>
        </div>
      </div>

      {/* Data Dimensions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
          gap: isMobile ? 10 : 16,
          maxWidth: 1100,
          width: '100%',
          zIndex: 2,
        }}
      >
        {dataDimensions.map((dim) => {
          const Icon = dim.icon
          return (
            <div
              key={dim.label}
              className="ep-dim"
              style={{
                padding: isMobile ? 14 : 24,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59,130,246,0.08)'
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              <div
                style={{
                  width: isMobile ? 36 : 44,
                  height: isMobile ? 36 : 44,
                  borderRadius: 12,
                  background: 'rgba(59,130,246,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <Icon size={isMobile ? 16 : 20} style={{ color: '#3b82f6' }} />
              </div>
              <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, marginBottom: 6 }}>{dim.label}</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{dim.desc}</div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: isMobile ? 24 : 32,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text-muted)',
          fontSize: isMobile ? 12 : 13,
          zIndex: 2,
        }}
      >
        <ExternalLink size={14} />
        <span>点击搜索将跳转至{selectedPlatform.name}查看结果，平台API接入开发中</span>
      </div>
    </div>
  )
}
