import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Server, Cloud, Shield, Zap, Code2, Globe, ArrowRight } from 'lucide-react'
import { useMobile } from '../hooks/useMobile'

const techStack = [
  { icon: Code2, label: 'React 18', desc: '现代前端框架' },
  { icon: Server, label: 'Node.js', desc: '高性能服务端' },
  { icon: Zap, label: 'Vite', desc: '极速构建工具' },
  { icon: Cloud, label: '云原生部署', desc: 'Docker + K8s' },
  { icon: Shield, label: 'TypeScript', desc: '类型安全' },
  { icon: Globe, label: 'RESTful API', desc: '标准化接口' },
]

const features = [
  { title: '高性能', desc: '毫秒级数据响应，万级并发支持' },
  { title: '可扩展', desc: '模块化架构，轻松接入新数据源' },
  { title: '高可用', desc: '多节点部署，99.9% SLA保障' },
  { title: '安全合规', desc: '数据加密传输，符合等保要求' },
]

export default function TechStackSection() {
  const navigate = useNavigate()
  const isMobile = useMobile()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMobile) return
    const ctx = gsap.context(() => {
      gsap.from('.ts-title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from('.ts-tech', {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        delay: 0.2,
      })
      gsap.from('.ts-feature', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.4,
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
          bottom: '10%',
          right: '20%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 50, zIndex: 2 }}>
        <div
          className="ts-title"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 20,
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: 'var(--accent-purple)',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          <Code2 size={14} />
          技术架构
        </div>
        <h2
          className="ts-title"
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          企业级<span className="text-gradient-purple">技术底座</span>
        </h2>
        <p style={{ fontSize: isMobile ? 15 : 18, color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto' }}>
          基于现代技术栈构建，支持私有化部署与云原生弹性伸缩
        </p>
      </div>

      {/* Tech Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
          gap: isMobile ? 10 : 16,
          maxWidth: 900,
          width: '100%',
          marginBottom: isMobile ? 24 : 40,
          zIndex: 2,
        }}
      >
        {techStack.map((tech) => {
          const Icon = tech.icon
          return (
            <div
              key={tech.label}
              className="ts-tech"
              style={{
                padding: isMobile ? 14 : 24,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(168,85,247,0.08)'
                e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Icon size={isMobile ? 22 : 28} style={{ color: 'var(--accent-purple)', marginBottom: 10 }} />
              <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, marginBottom: 4 }}>{tech.label}</div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: 'var(--text-muted)' }}>{tech.desc}</div>
            </div>
          )
        })}
      </div>

      {/* Features */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 10 : 20,
          maxWidth: 900,
          width: '100%',
          marginBottom: isMobile ? 24 : 50,
          zIndex: 2,
        }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            className="ts-feature"
            style={{
              padding: isMobile ? 14 : 20,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
              borderLeft: '3px solid var(--accent-purple)',
            }}
          >
            <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: isMobile ? 12 : 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="ts-feature"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 12 : 20,
          padding: isMobile ? '16px 20px' : '24px 40px',
          borderRadius: 16,
          background: 'var(--gradient-accent)',
          zIndex: 2,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left',
          width: isMobile ? '100%' : 'auto',
        }}
      >
        <div>
          <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, marginBottom: 4 }}>开始使用 lili Hub</div>
          <div style={{ fontSize: isMobile ? 13 : 14, opacity: 0.9 }}>部署到自有服务器，打造专属数据平台</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
            }}
          >
            <Code2 size={16} /> GitHub
          </a>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              background: '#fff',
              color: '#0a0a0f',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            立即体验 <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: isMobile ? 40 : 0,
          position: isMobile ? 'relative' : 'absolute',
          bottom: isMobile ? 0 : 24,
          left: isMobile ? 'auto' : '50%',
          transform: isMobile ? 'none' : 'translateX(-50%)',
          fontSize: 12,
          color: 'var(--text-muted)',
          zIndex: 2,
          textAlign: 'center',
          lineHeight: 1.8,
        }}
      >
        <div>© 2025 lili Hub. Built with React + Node.js + TypeScript.</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>
          本平台仅供学习研究，金融数据不构成投资建议 |
          <span
            onClick={() => navigate('/legal')}
            style={{ color: 'var(--text-muted)', marginLeft: 4, cursor: 'pointer', textDecoration: 'underline' }}
          >
            法律声明
          </span>
        </div>
      </div>
    </div>
  )
}
