import { useEffect, useRef, useState, useCallback } from 'react'

// ─── 520 浪漫入场动画 ───
// 仅在 5月20日 当天显示，包含：
// 1. Canvas 粒子汇聚成心形 → 爆发散开
// 2. "5.20" 数字渐显 + 脉冲光晕
// 3. 浪漫文字依次浮现
// 4. 点击/3秒后自动消失，进入主界面

interface HeartParticle {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
  phase: 'gathering' | 'formed' | 'exploding' | 'fading'
}

const HEART_COLORS = [
  '#ff6b9d', // 樱花粉
  '#ff4d6d', // 玫瑰红
  '#c9184a', // 深红
  '#ff85a1', // 浅粉
  '#ffb3c6', // 淡粉
  '#ff758f', // 珊瑚红
]

export default function LoveEntrance({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'loading' | 'heart' | 'text' | 'done'>('loading')
  const [showText, setShowText] = useState(false)
  const [showSubtext, setShowSubtext] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<HeartParticle[]>([])
  const startTimeRef = useRef<number>(0)

  // 心形参数方程上的点
  const getHeartPoint = (t: number, scale: number, cx: number, cy: number) => {
    // 心形参数方程: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    return { x: cx + x * scale, y: cy + y * scale }
  }

  const initParticles = useCallback((width: number, height: number) => {
    const cx = width / 2
    const cy = height / 2 - 20
    const scale = Math.min(width, height) / 50
    const particles: HeartParticle[] = []
    const count = 180

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2
      const heart = getHeartPoint(t, scale, cx, cy)
      // 随机偏移让心形更饱满
      const jitter = (Math.random() - 0.5) * scale * 4

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: heart.x + jitter,
        targetY: heart.y + jitter,
        vx: 0,
        vy: 0,
        radius: Math.random() * 2.5 + 1.5,
        opacity: 0,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        phase: 'gathering',
      })
    }

    // 内部填充粒子
    for (let i = 0; i < 60; i++) {
      const t = Math.random() * Math.PI * 2
      const r = Math.random() * 0.6 // 在心形内部
      const heart = getHeartPoint(t, scale * r, cx, cy)
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: heart.x,
        targetY: heart.y,
        vx: 0,
        vy: 0,
        radius: Math.random() * 2 + 1,
        opacity: 0,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        phase: 'gathering',
      })
    }

    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    initParticles(width, height)
    startTimeRef.current = performance.now()

    // 时间线：
    // 0-2000ms:   粒子汇聚成心形
    // 2000-2800ms: 心形稳定发光（脉冲）
    // 2800-3500ms: 心形爆发散开
    // 3500-4500ms: 文字显示阶段
    // 4500ms+:    可点击跳过或自动淡出

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current
      const particles = particlesRef.current

      ctx.clearRect(0, 0, width, height)

      // 绘制背景光晕
      if (elapsed > 1500 && elapsed < 4000) {
        const glowIntensity = Math.min(1, (elapsed - 1500) / 800)
        const pulse = 0.7 + 0.3 * Math.sin(elapsed * 0.004)
        const gradient = ctx.createRadialGradient(
          width / 2, height / 2 - 20, 0,
          width / 2, height / 2 - 20, Math.min(width, height) * 0.4
        )
        gradient.addColorStop(0, `rgba(255, 77, 109, ${0.12 * glowIntensity * pulse})`)
        gradient.addColorStop(0.5, `rgba(255, 107, 157, ${0.05 * glowIntensity * pulse})`)
        gradient.addColorStop(1, 'rgba(255, 107, 157, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }

      // 更新和绘制粒子
      particles.forEach((p, i) => {
        const progress = Math.min(1, elapsed / 2000) // 汇聚进度 0-2s
        const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic

        if (elapsed < 2000) {
          // 阶段1：粒子向心形位置汇聚
          p.x += (p.targetX - p.x) * 0.04 * (1 + easeProgress)
          p.y += (p.targetY - p.y) * 0.04 * (1 + easeProgress)
          p.opacity = Math.min(1, easeProgress * 1.2) * (0.6 + Math.random() * 0.4)
          p.phase = 'gathering'
        } else if (elapsed < 2800) {
          // 阶段2：心形稳定 + 微微呼吸
          const breathe = Math.sin(elapsed * 0.005 + i * 0.05) * 1.5
          p.x = p.targetX + breathe
          p.y = p.targetY + breathe
          p.opacity = 0.7 + 0.3 * Math.sin(elapsed * 0.004 + i * 0.03)
          p.phase = 'formed'
        } else if (elapsed < 3500) {
          // 阶段3：爆发散开
          const explodeProgress = (elapsed - 2800) / 700
          if (p.phase !== 'exploding') {
            p.phase = 'exploding'
            const angle = Math.atan2(p.y - height / 2 + 20, p.x - width / 2)
            const speed = 3 + Math.random() * 6
            p.vx = Math.cos(angle) * speed * (0.5 + Math.random())
            p.vy = Math.sin(angle) * speed * (0.5 + Math.random()) - 2
          }
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.08 // 重力
          p.opacity = Math.max(0, 1 - explodeProgress)
          p.radius *= 0.995
          p.phase = 'exploding'
        } else {
          // 阶段4：继续下落淡出
          p.vy += 0.06
          p.x += p.vx
          p.y += p.vy
          p.opacity = Math.max(0, p.opacity - 0.015)
          p.radius *= 0.99
          p.phase = 'fading'
        }

        // 绘制粒子（带光晕）
        if (p.opacity > 0.01) {
          // 外发光
          const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
          glowGradient.addColorStop(0, hexToRgba(p.color, p.opacity * 0.3))
          glowGradient.addColorStop(1, 'transparent')

          // 光晕层
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(p.color, p.opacity * 0.2)
          ctx.fill()

          // 核心
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(p.color, p.opacity)
          ctx.fill()
        }
      })

      // 绘制连线（仅心形形成阶段）
      if (elapsed >= 1200 && elapsed < 3000) {
        const lineOpacity = elapsed < 2000
          ? (elapsed - 1200) / 800
          : Math.max(0, 1 - (elapsed - 2000) / 1000)
        ctx.strokeStyle = `rgba(255, 107, 157, ${lineOpacity * 0.08})`
        ctx.lineWidth = 0.5
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = dx * dx + dy * dy
            if (dist < 900) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      // 阶段切换
      if (elapsed >= 2200 && elapsed < 2500 && phase === 'heart') {
        setPhase('text')
        setTimeout(() => setShowText(true), 100)
        setTimeout(() => setShowSubtext(true), 600)
      }

      if (elapsed >= 5000 && phase !== 'done') {
        setPhase('done')
        handleExit()
        return
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)

    const handleExit = () => {
      setOpacity(0)
      setTimeout(() => onComplete(), 600)
    }

    // 点击跳过
    const handleClick = () => {
      if (elapsedReady()) handleExit()
    }
    const elapsedReady = () => performance.now() - startTimeRef.current > 1000

    container.addEventListener('click', handleClick)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('click', handleClick)
    }
  }, [initParticles, phase, onComplete])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
        opacity,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* 主文字 */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          pointerEvents: 'none',
          opacity: showText ? 1 : 0,
          transform: showText ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
          transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div
          style={{
            fontSize: 'clamp(48px, 12vw, 120px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ff4d6d 30%, #c9184a 60%, #ff85a1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textShadow: 'none',
            animation: showText ? 'pulse-glow 2s ease-in-out infinite' : 'none',
          }}
        >
          5.20
        </div>

        {/* 副文字 */}
        <div
          style={{
            opacity: showSubtext ? 1 : 0,
            transform: showSubtext ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: '0.2s',
            marginTop: 16,
            fontSize: 'clamp(16px, 3vw, 24px)',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            letterSpacing: 8,
            textTransform: 'uppercase',
          }}
        >
          Happy Day · 为你而来
        </div>
      </div>

      {/* 提示文字 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          zIndex: 10,
          fontSize: 13,
          color: 'var(--text-muted)',
          opacity: phase === 'text' || phase === 'done' ? 0.6 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
          letterSpacing: 2,
        }}
      >
        点击任意处进入 ✦
      </div>

      {/* 注入脉冲动画 keyframes */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 77, 109, 0.4)) drop-shadow(0 0 40px rgba(255, 107, 157, 0.2)); }
          50% { filter: drop-shadow(0 0 35px rgba(255, 77, 109, 0.6)) drop-shadow(0 0 60px rgba(255, 107, 157, 0.3)); }
        }
      `}</style>
    </div>
  )
}

// ─── 日期检测 Hook ───
export function isLoveDay(): boolean {
  const now = new Date()
  return now.getMonth() === 4 && now.getDate() === 20 // 5月 = month 4 (0-indexed)
}

// 将 #rrggbb 转为 rgba(r, g, b, a)
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
