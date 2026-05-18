import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { Tag } from 'antd'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Gauge,
  Target,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react'
import { useStockDetail, useTechnicalIndicators } from '../hooks/useStockData'
import { useMobile } from '../hooks/useMobile'

// 蜡烛图 K 线组件
function CandlestickChart({ data, width: propWidth, height = 200 }: { data: Array<{ date: string; open: number; close: number; high: number; low: number }>; width?: number; height?: number }) {
  const isMobile = useMobile()
  const width = propWidth || (isMobile ? 340 : 600)
  if (data.length === 0) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        暂无历史K线数据
      </div>
    )
  }

  const allPrices = data.flatMap((item) => [item.high, item.low])
  const min = Math.min(...allPrices) * 0.998
  const max = Math.max(...allPrices) * 1.002
  const range = max - min || 1
  const padding = { top: 20, bottom: 30, left: 50, right: 20 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const barWidth = Math.max(2, Math.min(10, (chartW / data.length) * 0.7))

  const scaleY = (price: number) => padding.top + chartH - ((price - min) / range) * chartH
  const scaleX = (i: number) => padding.left + (i / (data.length - 1)) * chartW

  const firstPrice = data[0].close
  const lastPrice = data[data.length - 1].close
  const maColor = lastPrice >= firstPrice ? '#10b981' : '#ef4444'

  // MA line points
  const ma5Points = data.map((_item, i) => {
    if (i < 4) return null
    const ma = data.slice(i - 4, i + 1).reduce((s, x) => s + x.close, 0) / 5
    return `${scaleX(i)},${scaleY(ma)}`
  }).filter(Boolean).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line key={`h${i}`} x1={padding.left} y1={padding.top + (i / 3) * chartH} x2={width - padding.right} y2={padding.top + (i / 3) * chartH} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      {/* Horizontal grid labels */}
      {[0, 1, 2, 3].map((i) => {
        const price = max - (i / 3) * range
        return <text key={`hl${i}`} x={padding.left - 5} y={padding.top + (i / 3) * chartH + 4} fill="var(--text-muted)" fontSize={9} textAnchor="end">{price.toFixed(2)}</text>
      })}
      {/* Candlesticks */}
      {data.map((d, i) => {
        const x = scaleX(i)
        const up = d.close >= d.open
        const color = up ? '#10b981' : '#ef4444'
        const bodyTop = scaleY(Math.max(d.open, d.close))
        const bodyBottom = scaleY(Math.min(d.open, d.close))
        const bodyH = Math.max(1, bodyBottom - bodyTop)
        const wickTop = scaleY(d.high)
        const wickBottom = scaleY(d.low)
        return (
          <g key={i}>
            {/* Wick */}
            <line x1={x} y1={wickTop} x2={x} y2={wickBottom} stroke={color} strokeWidth={1} />
            {/* Body */}
            <rect x={x - barWidth / 2} y={bodyTop} width={barWidth} height={bodyH} fill={up ? color : color} stroke={color} strokeWidth={1} opacity={up ? 0.8 : 0.6} />
          </g>
        )
      })}
      {/* MA5 line */}
      {ma5Points && <polyline points={ma5Points} fill="none" stroke={maColor} strokeWidth={1.5} strokeDasharray="4,2" opacity={0.7} />}
      {/* Date labels */}
      <text x={padding.left} y={height - 10} fill="var(--text-muted)" fontSize={9}>{data[0].date}</text>
      <text x={width - padding.right - 60} y={height - 10} fill="var(--text-muted)" fontSize={9}>{data[data.length - 1].date}</text>
      {/* Legend */}
      <text x={padding.left} y={14} fill="var(--text-muted)" fontSize={10}>MA5 <tspan fill={maColor}>───</tspan></text>
    </svg>
  )
}

// 技术指标面板
function TechnicalPanel({ code }: { code: string }) {
  const isMobile = useMobile()
  const { indicators, loading, error } = useTechnicalIndicators(code)

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        <Activity size={20} style={{ marginBottom: 8, animation: 'spin 1s linear infinite' }} />
        <div style={{ fontSize: 13 }}>计算技术指标中...</div>
      </div>
    )
  }

  if (error || !indicators) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        {error || '暂无技术指标数据'}
      </div>
    )
  }

  const sections = [
    {
      title: '移动平均线 MA',
      icon: BarChart3,
      items: [
        { label: 'MA5', value: indicators.ma.ma5.toFixed(2) },
        { label: 'MA10', value: indicators.ma.ma10.toFixed(2) },
        { label: 'MA20', value: indicators.ma.ma20.toFixed(2) },
        { label: 'MA60', value: indicators.ma.ma60.toFixed(2) },
      ],
    },
    {
      title: 'MACD',
      icon: Activity,
      items: [
        { label: 'DIF', value: indicators.macd.dif.toFixed(3) },
        { label: 'DEA', value: indicators.macd.dea.toFixed(3) },
        { label: 'MACD', value: indicators.macd.macd.toFixed(3) },
        { label: '信号', value: indicators.macd.dif > indicators.macd.dea ? '金叉' : '死叉', color: indicators.macd.dif > indicators.macd.dea ? 'var(--accent-green)' : 'var(--accent-red)' },
      ],
    },
    {
      title: 'KDJ',
      icon: Gauge,
      items: [
        { label: 'K', value: indicators.kdj.k.toFixed(2) },
        { label: 'D', value: indicators.kdj.d.toFixed(2) },
        { label: 'J', value: indicators.kdj.j.toFixed(2) },
        { label: '信号', value: indicators.kdj.j > 80 ? '超买' : indicators.kdj.j < 20 ? '超卖' : '震荡', color: indicators.kdj.j > 80 ? 'var(--accent-red)' : indicators.kdj.j < 20 ? 'var(--accent-green)' : 'var(--text-secondary)' },
      ],
    },
    {
      title: 'RSI',
      icon: TrendingUp,
      items: [
        { label: 'RSI6', value: indicators.rsi.rsi6.toFixed(2) },
        { label: 'RSI12', value: indicators.rsi.rsi12.toFixed(2) },
        { label: 'RSI24', value: indicators.rsi.rsi24.toFixed(2) },
        { label: '信号', value: indicators.rsi.rsi6 > 70 ? '超买' : indicators.rsi.rsi6 < 30 ? '超卖' : '正常', color: indicators.rsi.rsi6 > 70 ? 'var(--accent-red)' : indicators.rsi.rsi6 < 30 ? 'var(--accent-green)' : 'var(--text-secondary)' },
      ],
    },
    {
      title: '布林带 BOLL',
      icon: Target,
      items: [
        { label: '上轨', value: indicators.boll.upper.toFixed(2) },
        { label: '中轨', value: indicators.boll.middle.toFixed(2) },
        { label: '下轨', value: indicators.boll.lower.toFixed(2) },
        { label: '带宽', value: ((indicators.boll.upper - indicators.boll.lower) / indicators.boll.middle * 100).toFixed(2) + '%' },
      ],
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
      {sections.map((sec) => {
        const Icon = sec.icon
        return (
          <div key={sec.title} style={{ padding: isMobile ? 12 : 16, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Icon size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{sec.title}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
              {sec.items.map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: (item as any).color || 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 分析建议组件
function AnalysisCard({ detail }: { detail: NonNullable<ReturnType<typeof useStockDetail>['detail']> }) {
  const signals = useMemo(() => {
    const s: Array<{ label: string; value: string; trend: 'up' | 'down' | 'neutral'; desc: string }> = []

    // 价格vs均价
    if (detail.price > detail.avgPrice * 1.02) {
      s.push({ label: '价格偏离', value: '偏高', trend: 'up', desc: `当前价高于均价 ${((detail.price / detail.avgPrice - 1) * 100).toFixed(2)}%` })
    } else if (detail.price < detail.avgPrice * 0.98) {
      s.push({ label: '价格偏离', value: '偏低', trend: 'down', desc: `当前价低于均价 ${((1 - detail.price / detail.avgPrice) * 100).toFixed(2)}%` })
    } else {
      s.push({ label: '价格偏离', value: '正常', trend: 'neutral', desc: '当前价围绕均价波动' })
    }

    // 近期趋势
    if (detail.change5d > 5) {
      s.push({ label: '5日趋势', value: '强势', trend: 'up', desc: `5日涨幅 ${detail.change5d.toFixed(2)}%` })
    } else if (detail.change5d < -5) {
      s.push({ label: '5日趋势', value: '弱势', trend: 'down', desc: `5日跌幅 ${detail.change5d.toFixed(2)}%` })
    } else {
      s.push({ label: '5日趋势', value: '震荡', trend: 'neutral', desc: `5日涨跌 ${detail.change5d.toFixed(2)}%` })
    }

    // 量能
    if (detail.volumeRatio > 2) {
      s.push({ label: '成交量', value: '放量', trend: 'up', desc: `量比 ${detail.volumeRatio.toFixed(2)}，资金活跃` })
    } else if (detail.volumeRatio < 0.5) {
      s.push({ label: '成交量', value: '缩量', trend: 'down', desc: `量比 ${detail.volumeRatio.toFixed(2)}，交易清淡` })
    } else {
      s.push({ label: '成交量', value: '正常', trend: 'neutral', desc: `量比 ${detail.volumeRatio.toFixed(2)}` })
    }

    // 估值
    if (detail.peRatio > 0 && detail.peRatio < 15) {
      s.push({ label: '估值水平', value: '偏低', trend: 'up', desc: `市盈率 ${detail.peRatio.toFixed(2)}，估值合理` })
    } else if (detail.peRatio > 50) {
      s.push({ label: '估值水平', value: '偏高', trend: 'down', desc: `市盈率 ${detail.peRatio.toFixed(2)}，注意风险` })
    } else {
      s.push({ label: '估值水平', value: '适中', trend: 'neutral', desc: `市盈率 ${detail.peRatio.toFixed(2)}` })
    }

    return s
  }, [detail])

  // 综合评分
  const score = useMemo(() => {
    let s = 50
    if (detail.changePercent > 0) s += 10
    if (detail.change5d > 0) s += 10
    if (detail.volumeRatio > 1) s += 10
    if (detail.peRatio > 0 && detail.peRatio < 30) s += 10
    if (detail.price > detail.avgPrice) s += 10
    return Math.min(100, Math.max(0, s))
  }, [detail])

  const scoreColor = score >= 70 ? 'var(--accent-green)' : score >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)'
  const scoreLabel = score >= 70 ? '偏多' : score >= 40 ? '中性' : '偏空'
  const isMobile = useMobile()

  return (
    <div>
      {/* 综合评分 */}
      <div
        style={{
          padding: isMobile ? 16 : 24,
          borderRadius: 14,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 16 : 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>综合评分</div>
          <div style={{ fontSize: isMobile ? 32 : 42, fontWeight: 800, color: scoreColor }}>{score}</div>
          <div style={{ fontSize: 14, color: scoreColor, fontWeight: 600 }}>{scoreLabel}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.05)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${score}%`,
                borderRadius: 4,
                background: scoreColor,
                transition: 'width 0.5s',
              }}
            />
          </div>
          <div style={{ marginTop: 12, fontSize: isMobile ? 12 : 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: 'var(--accent-orange)' }} />
            AI 生成分析，不构成投资建议。投资有风险，入市需谨慎。
          </div>
        </div>
      </div>

      {/* 信号卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
        {signals.map((sig) => (
          <div
            key={sig.label}
            style={{
              padding: isMobile ? 12 : 16,
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sig.label}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: sig.trend === 'up' ? 'var(--accent-green)' : sig.trend === 'down' ? 'var(--accent-red)' : 'var(--text-secondary)',
                }}
              >
                {sig.trend === 'up' && <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                {sig.trend === 'down' && <ArrowDownRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                {sig.trend === 'neutral' && <Minus size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                {sig.value}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sig.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StockDetail() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const isMobile = useMobile()
  const { detail, loading, error } = useStockDetail(code || '')

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
        <Activity size={32} style={{ marginBottom: 16, animation: 'spin 1s linear infinite' }} />
        <p>加载股票数据中...</p>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--accent-red)', marginBottom: 16 }}>{error || '股票数据获取失败'}</p>
        <button
          onClick={() => navigate('/financial')}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: 'none',
            background: 'var(--gradient-accent)',
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          返回行情页
        </button>
      </div>
    )
  }

  const isUp = detail.change >= 0
  const color = isUp ? 'var(--accent-green)' : 'var(--accent-red)'

  return (
    <div style={{ padding: isMobile ? '80px 16px 40px' : '100px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <button
        onClick={() => navigate('/financial')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
          padding: '8px 16px',
          borderRadius: 10,
          border: '1px solid var(--border-subtle)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <ArrowLeft size={16} /> 返回行情
      </button>

      {/* 基本信息 */}
      <div
        style={{
          padding: isMobile ? 20 : 28,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>{detail.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {detail.code} · {detail.market} · {detail.updateTime ? detail.updateTime.slice(0, 4) + '-' + detail.updateTime.slice(4, 6) + '-' + detail.updateTime.slice(6, 8) : ''}
            </div>
          </div>
          <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color }}>¥{detail.price.toFixed(2)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
              <span style={{ fontSize: 16, color, fontWeight: 600 }}>
                {isUp ? '+' : ''}{detail.change.toFixed(2)}
              </span>
              <Tag
                style={{
                  background: isUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  color,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isUp ? '+' : ''}{detail.changePercent.toFixed(2)}%
              </Tag>
            </div>
          </div>
        </div>

        {/* 价格统计 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
            gap: isMobile ? 10 : 16,
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {[
            { label: '今开', value: detail.open.toFixed(2) },
            { label: '昨收', value: detail.prevClose.toFixed(2) },
            { label: '最高', value: detail.high.toFixed(2) },
            { label: '最低', value: detail.low.toFixed(2) },
            { label: '成交量', value: detail.volume > 0 ? (detail.volume / 100).toFixed(0) + '手' : '-' },
            { label: '成交额', value: detail.amount > 0 ? (detail.amount / 10000).toFixed(0) + '万' : '-' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* K线走势 */}
      <div
        style={{
          padding: isMobile ? 16 : 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700 }}>K线走势</h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{detail.kline.length > 0 ? `近${detail.kline.length}个交易日` : ''}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <CandlestickChart data={detail.kline} />
        </div>
      </div>

      {/* 技术指标 */}
      <div
        style={{
          padding: isMobile ? 16 : 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Activity size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700 }}>技术指标</h2>
        </div>
        <TechnicalPanel code={detail.code} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
        {/* 买卖盘 */}
        <div
          style={{
            padding: isMobile ? 16 : 24,
            borderRadius: 16,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Target size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700 }}>买卖盘</h3>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {/* 买盘 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--accent-green)', marginBottom: 8, fontWeight: 600 }}>买入</div>
              {detail.bidPrice.slice(0, 5).map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)' }}>买{i + 1}</span>
                  <span style={{ color: 'var(--accent-green)' }}>{p > 0 ? p.toFixed(2) : '-'}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{detail.bidVolume[i] > 0 ? detail.bidVolume[i] : '-'}</span>
                </div>
              ))}
            </div>
            {/* 卖盘 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--accent-red)', marginBottom: 8, fontWeight: 600 }}>卖出</div>
              {detail.askPrice.slice(0, 5).map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)' }}>卖{i + 1}</span>
                  <span style={{ color: 'var(--accent-red)' }}>{p > 0 ? p.toFixed(2) : '-'}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{detail.askVolume[i] > 0 ? detail.askVolume[i] : '-'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 基本面 */}
        <div
          style={{
            padding: isMobile ? 16 : 24,
            borderRadius: 16,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Gauge size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700 }}>基本面</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
            {[
              { label: '市盈率(PE)', value: detail.peRatio > 0 ? detail.peRatio.toFixed(2) : '-' },
              { label: '市净率(PB)', value: detail.pbRatio > 0 ? detail.pbRatio.toFixed(2) : '-' },
              { label: '换手率', value: detail.turnoverRate > 0 ? detail.turnoverRate.toFixed(2) + '%' : '-' },
              { label: '振幅', value: detail.amplitude > 0 ? detail.amplitude.toFixed(2) + '%' : '-' },
              { label: '量比', value: detail.volumeRatio > 0 ? detail.volumeRatio.toFixed(2) : '-' },
              { label: '委比', value: detail.commissionRatio !== 0 ? detail.commissionRatio.toFixed(2) + '%' : '-' },
              { label: '总市值', value: detail.totalMarketCap > 0 ? detail.totalMarketCap.toFixed(0) + '亿' : '-' },
              { label: '流通市值', value: detail.floatMarketCap > 0 ? detail.floatMarketCap.toFixed(0) + '亿' : '-' },
              { label: '52周最高', value: detail.week52High > 0 ? detail.week52High.toFixed(2) : '-' },
              { label: '52周最低', value: detail.week52Low > 0 ? detail.week52Low.toFixed(2) : '-' },
              { label: '总股本', value: detail.totalShares > 0 ? (detail.totalShares / 100000000).toFixed(2) + '亿' : '-' },
              { label: '流通股本', value: detail.floatShares > 0 ? (detail.floatShares / 100000000).toFixed(2) + '亿' : '-' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 近期涨跌 */}
      <div
        style={{
          padding: isMobile ? 16 : 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, marginBottom: 16 }}>近期涨跌</h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
          {[
            { label: '今日', value: detail.changePercent, period: '' },
            { label: '5日', value: detail.change5d, period: 'change5d' },
            { label: '10日', value: detail.change10d, period: 'change10d' },
            { label: '20日', value: detail.change20d, period: 'change20d' },
          ].map((item) => {
            const up = item.value >= 0
            return (
              <div
                key={item.label}
                style={{
                  padding: isMobile ? 12 : 16,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: up ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {up ? '+' : ''}{item.value.toFixed(2)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI 分析 */}
      <div
        style={{
          padding: isMobile ? 16 : 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Activity size={18} style={{ color: 'var(--accent-purple)' }} />
          <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700 }}>AI 分析</h3>
        </div>
        <AnalysisCard detail={detail} />
      </div>
    </div>
  )
}
