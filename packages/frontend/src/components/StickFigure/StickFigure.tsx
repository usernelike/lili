import { useState, useEffect, useRef, useMemo } from 'react'

interface MousePos {
  x: number
  y: number
}

function useMouseInSvg(svgRef: React.RefObject<SVGSVGElement | null>) {
  const [pos, setPos] = useState<MousePos>({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [svgRef])

  return pos
}

function eyeOffset(
  eyeCx: number,
  eyeCy: number,
  mouse: MousePos,
  maxR: number
) {
  const dx = mouse.x - eyeCx
  const dy = mouse.y - eyeCy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const scale = dist === 0 ? 0 : Math.min(dist / 12, maxR) / dist
  return { x: dx * scale, y: dy * scale }
}

/* ========== 抽象小人组件 ========== */

/** 中间主角 - 青色，大眼睛 */
function HeroChar({
  cx,
  cy,
  mouse,
  isPassword,
}: {
  cx: number
  cy: number
  mouse: MousePos
  isPassword: boolean
}) {
  const offL = useMemo(
    () => eyeOffset(cx - 14, cy - 10, mouse, 4),
    [cx, cy, mouse]
  )
  const offR = useMemo(
    () => eyeOffset(cx + 14, cy - 10, mouse, 4),
    [cx, cy, mouse]
  )

  return (
    <g>
      {/* 身体阴影 */}
      <ellipse cx={cx} cy={cy + 55} rx={38} ry={10} fill="rgba(0,0,0,0.15)" />
      {/* 身体 */}
      <circle cx={cx} cy={cy} r={45} fill="url(#heroGrad)" />
      {/* 腮红 */}
      <circle cx={cx - 28} cy={cy + 8} r={7} fill="rgba(255,120,160,0.35)" />
      <circle cx={cx + 28} cy={cy + 8} r={7} fill="rgba(255,120,160,0.35)" />

      {isPassword ? (
        <>
          {/* 捂眼状态 */}
          <ellipse cx={cx - 16} cy={cy - 12} rx={10} ry={14} fill="#fff" />
          <ellipse cx={cx + 16} cy={cy - 12} rx={10} ry={14} fill="#fff" />
          {/* 手 */}
          <circle cx={cx - 14} cy={cy - 12} r={11} fill="#7dd3fc" opacity={0.9} />
          <circle cx={cx + 14} cy={cy - 12} r={11} fill="#7dd3fc" opacity={0.9} />
          {/* 惊讶嘴 */}
          <ellipse cx={cx} cy={cy + 18} rx={6} ry={8} fill="#374151" />
        </>
      ) : (
        <>
          {/* 左眼眶 */}
          <circle cx={cx - 16} cy={cy - 10} r={13} fill="#fff" />
          <circle
            cx={cx - 16 + offL.x}
            cy={cy - 10 + offL.y}
            r={5.5}
            fill="#1f2937"
          />
          <circle
            cx={cx - 18 + offL.x}
            cy={cy - 12 + offL.y}
            r={2}
            fill="#fff"
            opacity={0.6}
          />
          {/* 右眼眶 */}
          <circle cx={cx + 16} cy={cy - 10} r={13} fill="#fff" />
          <circle
            cx={cx + 16 + offR.x}
            cy={cy - 10 + offR.y}
            r={5.5}
            fill="#1f2937"
          />
          <circle
            cx={cx + 14 + offR.x}
            cy={cy - 12 + offR.y}
            r={2}
            fill="#fff"
            opacity={0.6}
          />
          {/* 微笑 */}
          <path
            d={`M ${cx - 10} ${cy + 18} Q ${cx} ${cy + 26} ${cx + 10} ${cy + 18}`}
            fill="none"
            stroke="#1f2937"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  )
}

/** 左边偷看者 - 紫色，歪头 */
function PeekChar({
  cx,
  cy,
  mouse,
  isPassword,
}: {
  cx: number
  cy: number
  mouse: MousePos
  isPassword: boolean
}) {
  const offR = useMemo(
    () => eyeOffset(cx + 10, cy - 8, mouse, 5),
    [cx, cy, mouse]
  )

  return (
    <g transform={`rotate(-12, ${cx}, ${cy})`}>
      {/* 身体阴影 */}
      <ellipse cx={cx} cy={cy + 50} rx={32} ry={8} fill="rgba(0,0,0,0.15)" />
      {/* 身体 */}
      <circle cx={cx} cy={cy} r={38} fill="url(#peekGrad)" />
      {/* 腮红 */}
      <circle cx={cx - 22} cy={cy + 6} r={6} fill="rgba(255,120,160,0.35)" />
      <circle cx={cx + 22} cy={cy + 6} r={6} fill="rgba(255,120,160,0.35)" />

      {/* 左眼（被手遮住） */}
      <ellipse cx={cx - 12} cy={cy - 8} rx={9} ry={11} fill="#fff" />
      <path
        d={`M ${cx - 22} ${cy + 4} Q ${cx - 12} ${cy - 18} ${cx - 2} ${cy + 2}`}
        fill="none"
        stroke="#a78bfa"
        strokeWidth={5}
        strokeLinecap="round"
      />

      {/* 右眼（睁大） */}
      <circle cx={cx + 12} cy={cy - 8} r={12} fill="#fff" />
      <circle
        cx={cx + 12 + offR.x}
        cy={cy - 8 + offR.y}
        r={6}
        fill="#1f2937"
      />
      <circle
        cx={cx + 10 + offR.x}
        cy={cy - 10 + offR.y}
        r={2.5}
        fill="#fff"
        opacity={0.6}
      />

      {/* 嘴巴 */}
      <path
        d={`M ${cx - 6} ${cy + 16} Q ${cx + 4} ${cy + 22} ${cx + 10} ${cy + 14}`}
        fill="none"
        stroke="#1f2937"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* 偷看星星 */}
      {isPassword && (
        <>
          <circle cx={cx + 28} cy={cy - 22} r={3} fill="#fbbf24" />
          <circle cx={cx + 34} cy={cy - 18} r={1.5} fill="#fbbf24" />
        </>
      )}
    </g>
  )
}

/** 右边害羞者 - 粉红，完全捂眼 */
function ShyChar({
  cx,
  cy,
  mouse,
  isPassword,
}: {
  cx: number
  cy: number
  mouse: MousePos
  isPassword: boolean
}) {
  const offL = useMemo(
    () => eyeOffset(cx - 12, cy - 8, mouse, 4),
    [cx, cy, mouse]
  )
  const offR = useMemo(
    () => eyeOffset(cx + 12, cy - 8, mouse, 4),
    [cx, cy, mouse]
  )

  return (
    <g>
      {/* 身体阴影 */}
      <ellipse cx={cx} cy={cy + 50} rx={32} ry={8} fill="rgba(0,0,0,0.15)" />
      {/* 身体 */}
      <circle cx={cx} cy={cy} r={38} fill="url(#shyGrad)" />
      {/* 腮红（更深） */}
      <circle cx={cx - 22} cy={cy + 6} r={7} fill="rgba(220,80,120,0.4)" />
      <circle cx={cx + 22} cy={cy + 6} r={7} fill="rgba(220,80,120,0.4)" />

      {isPassword ? (
        <>
          {/* 眼睛位置留白 */}
          <ellipse cx={cx - 12} cy={cy - 8} rx={9} ry={11} fill="#fff" opacity={0.3} />
          <ellipse cx={cx + 12} cy={cy - 8} rx={9} ry={11} fill="#fff" opacity={0.3} />
          {/* 双手捂眼 */}
          <circle cx={cx - 14} cy={cy - 8} r={12} fill="#fda4af" opacity={0.95} />
          <circle cx={cx + 14} cy={cy - 8} r={12} fill="#fda4af" opacity={0.95} />
          {/* 害羞嘴 */}
          <ellipse cx={cx} cy={cy + 16} rx={5} ry={6} fill="#1f2937" />
        </>
      ) : (
        <>
          {/* 左眼眶 */}
          <circle cx={cx - 12} cy={cy - 8} r={11} fill="#fff" />
          <circle
            cx={cx - 12 + offL.x}
            cy={cy - 8 + offL.y}
            r={4.5}
            fill="#1f2937"
          />
          <circle
            cx={cx - 14 + offL.x}
            cy={cy - 10 + offL.y}
            r={1.8}
            fill="#fff"
            opacity={0.6}
          />
          {/* 右眼眶 */}
          <circle cx={cx + 12} cy={cy - 8} r={11} fill="#fff" />
          <circle
            cx={cx + 12 + offR.x}
            cy={cy - 8 + offR.y}
            r={4.5}
            fill="#1f2937"
          />
          <circle
            cx={cx + 10 + offR.x}
            cy={cy - 10 + offR.y}
            r={1.8}
            fill="#fff"
            opacity={0.6}
          />
          {/* 微笑 */}
          <path
            d={`M ${cx - 8} ${cy + 14} Q ${cx} ${cy + 20} ${cx + 8} ${cy + 14}`}
            fill="none"
            stroke="#1f2937"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  )
}

/* ========== 场景组件 ========== */

export default function StickFigureScene({
  isPasswordFocused,
}: {
  isPasswordFocused: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const mouse = useMouseInSvg(svgRef)

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <svg
        ref={svgRef}
        width="400"
        height="220"
        viewBox="0 0 400 220"
        style={{ userSelect: 'none' }}
      >
        <defs>
          <radialGradient id="heroGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </radialGradient>
          <radialGradient id="peekGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </radialGradient>
          <radialGradient id="shyGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#f43f5e" />
          </radialGradient>
        </defs>

        {/* 装饰背景圆 */}
        <circle cx="200" cy="110" r="90" fill="rgba(0,212,255,0.03)" />
        <circle cx="200" cy="110" r="70" fill="none" stroke="rgba(0,212,255,0.06)" strokeWidth={1} />

        {/* 左边：偷看者（紫色） */}
        <PeekChar cx={90} cy={105} mouse={mouse} isPassword={isPasswordFocused} />

        {/* 中间：主角（青色）- 密码时捂眼 */}
        <HeroChar cx={200} cy={100} mouse={mouse} isPassword={isPasswordFocused} />

        {/* 右边：害羞者（粉红）- 密码时捂眼 */}
        <ShyChar cx={310} cy={105} mouse={mouse} isPassword={isPasswordFocused} />
      </svg>
    </div>
  )
}
