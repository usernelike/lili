type FigureState = 'normal' | 'peek' | 'hide'

function StickFigure({
  x,
  y,
  scale = 1,
  state,
  label,
}: {
  x: number
  y: number
  scale?: number
  state: FigureState
  label?: string
}) {
  const s = scale
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      {/* 身体 */}
      <line x1={0} y1={-10} x2={0} y2={35} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* 腿 */}
      <line x1={0} y1={35} x2={-18} y2={65} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <line x1={0} y1={35} x2={18} y2={65} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* 头 */}
      <circle cx={0} cy={-35} r={22} fill="none" stroke="currentColor" strokeWidth={2} />

      {state === 'normal' && (
        <>
          {/* 正常睁眼 */}
          <circle cx={-9} cy={-38} r={3} fill="currentColor" />
          <circle cx={9} cy={-38} r={3} fill="currentColor" />
          <path d="M -10 -22 Q 0 -15 10 -22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          {/* 手臂自然下垂 */}
          <line x1={0} y1={0} x2={-22} y2={20} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <line x1={0} y1={0} x2={22} y2={20} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </>
      )}

      {state === 'peek' && (
        <>
          {/* 偷看：右眼睁大，左眼被手遮挡 */}
          <circle cx={9} cy={-38} r={5} fill="none" stroke="currentColor" strokeWidth={2} />
          <circle cx={9} cy={-38} r={2} fill="currentColor" />
          {/* 手遮左眼 */}
          <path d="M -25 -10 L -5 -38 L -18 -25 Z" fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
          {/* 歪嘴笑 */}
          <path d="M -5 -20 Q 5 -16 12 -22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          {/* 手臂姿势 */}
          <line x1={0} y1={0} x2={-25} y2={-5} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <line x1={0} y1={0} x2={22} y2={20} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </>
      )}

      {state === 'hide' && (
        <>
          {/* 完全捂眼 */}
          <path d="M -28 -15 L -8 -38 L -20 -28 Z" fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
          <path d="M 28 -15 L 8 -38 L 20 -28 Z" fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
          {/* 惊讶嘴 */}
          <circle cx={0} cy={-22} r={4} fill="none" stroke="currentColor" strokeWidth={2} />
          {/* 手臂上举 */}
          <line x1={0} y1={0} x2={-25} y2={-10} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <line x1={0} y1={0} x2={25} y2={-10} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </>
      )}

      {label && (
        <text x={0} y={85} textAnchor="middle" fill="currentColor" fontSize={12} opacity={0.7}>
          {label}
        </text>
      )}
    </g>
  )
}

export default function StickFigureScene({ state }: { state: FigureState }) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        width="320"
        height="180"
        viewBox="0 0 320 180"
        style={{ color: 'var(--text-secondary)' }}
      >
        {/* 背景发光圆 */}
        <circle cx="160" cy="90" r="70" fill="rgba(0,212,255,0.03)" stroke="rgba(0,212,255,0.08)" strokeWidth={1} />
        
        {/* 左边：好奇宝宝，总是偷看 */}
        <StickFigure x={70} y={100} scale={0.85} state="peek" label="好奇" />
        
        {/* 中间：主人物，根据状态变化 */}
        <StickFigure x={160} y={95} scale={1.1} state={state} />
        
        {/* 右边：害羞宝宝，总是捂眼 */}
        <StickFigure x={250} y={100} scale={0.85} state="hide" label="害羞" />
      </svg>
    </div>
  )
}
