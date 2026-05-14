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
import { useStockDetail } from '../hooks/useStockData'

// 简单的SVG K线图组件
function MiniKLine({ data, width = 600, height = 200 }: { data: Array<{ date: string; close: number }>; width?: number; height?: number }) {
  if (data.length === 0) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        暂无历史K线数据
      </div>
    )
  }

  const prices = data.map((d) => d.close)
  const min = Math.min(...prices) * 0.995
  const max = Math.max(...prices) * 1.005
  const range = max - min || 1

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 40) + 20
    const y = height - 30 - ((d.close - min) / range) * (height - 50)
    return `${x},${y}`
  }).join(' ')

  const firstPrice = data[0].close
  const lastPrice = data[data.length - 1].close
  const color = lastPrice >= firstPrice ? '#10b981' : '#ef4444'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={20} y1={height - 30 - (i / 3) * (height - 50)} x2={width - 20} y2={height - 30 - (i / 3) * (height - 50)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      {/* Price line */}
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} />
      {/* Area fill */}
      <polygon
        points={`${points.split(' ')[0]} ${points} ${points.split(' ').pop()} ${width - 20},${height - 30} 20,${height - 30}`}
        fill={`${color}15`}
      />
      {/* Labels */}
      <text x={10} y={15} fill="var(--text-muted)" fontSize={10}>{max.toFixed(2)}</text>
      <text x={10} y={height - 20} fill="var(--text-muted)" fontSize={10}>{min.toFixed(2)}</text>
      {/* Date labels */}
      <text x={20} y={height - 10} fill="var(--text-muted)" fontSize={9}>{data[0].date}</text>
      <text x={width - 80} y={height - 10} fill="var(--text-muted)" fontSize={9}>{data[data.length - 1].date}</text>
    </svg>
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

  return (
    <div>
      {/* 综合评分 */}
      <div
        style={{
          padding: 24,
          borderRadius: 14,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>综合评分</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: scoreColor }}>{score}</div>
          <div style={{ fontSize: 14, color: scoreColor, fontWeight: 600 }}>{scoreLabel}</div>
        </div>
        <div style={{ flex: 1 }}>
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
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: 'var(--accent-orange)' }} />
            AI 生成分析，不构成投资建议。投资有风险，入市需谨慎。
          </div>
        </div>
      </div>

      {/* 信号卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {signals.map((sig) => (
          <div
            key={sig.label}
            style={{
              padding: 16,
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
  const { detail, loading, error } = useStockDetail(code || '')

  if (loading) {
    return (
      <div style={{ padding: '100px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Activity size={32} style={{ marginBottom: 16, animation: 'spin 1s linear infinite' }} />
        <p>加载股票数据中...</p>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div style={{ padding: '100px 40px', textAlign: 'center' }}>
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
    <div style={{ padding: '100px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
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
          padding: 28,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{detail.name}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
              {detail.code} · {detail.market} · {detail.updateTime ? detail.updateTime.slice(0, 4) + '-' + detail.updateTime.slice(4, 6) + '-' + detail.updateTime.slice(6, 8) : ''}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color }}>¥{detail.price.toFixed(2)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
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
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 16,
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
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* K线走势 */}
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>近期走势</h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{detail.kline.length > 0 ? `近${detail.kline.length}个交易日` : ''}</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <MiniKLine data={detail.kline} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* 买卖盘 */}
        <div
          style={{
            padding: 24,
            borderRadius: 16,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Target size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>买卖盘</h3>
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
            padding: 24,
            borderRadius: 16,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Gauge size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>基本面</h3>
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
          padding: 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>近期涨跌</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
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
                  padding: 16,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: up ? 'var(--accent-green)' : 'var(--accent-red)' }}>
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
          padding: 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Activity size={18} style={{ color: 'var(--accent-purple)' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI 分析</h3>
        </div>
        <AnalysisCard detail={detail} />
      </div>
    </div>
  )
}
