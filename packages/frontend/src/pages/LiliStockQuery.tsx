import { apiFetch } from '../utils/api'
import { useState, useCallback, useMemo } from 'react'
import {
  Search,
  TrendingUp,
  BarChart3,
  Sun,
  Moon,
  Plus,
  Trash2,
  Eye,
  AlertTriangle,
  Database,
} from 'lucide-react'
import {
  useLiliQuery,
  useLiliWatchlist,
  type LiliQueryType,
  type LiliWatchlistItem,
} from '../hooks/useLiliDatasource'
import { useMobile } from '../hooks/useMobile'

const queryTypeOptions: { value: LiliQueryType; label: string; icon: typeof Search; desc: string }[] = [
  { value: 'realtime_price', label: '实时行情', icon: TrendingUp, desc: '当前价、分钟K线、涨跌幅' },
  { value: 'realtime_tech', label: '技术指标', icon: BarChart3, desc: 'MACD、KDJ、RSI、BOLL、MA 等（仅A股）' },
  { value: 'open_summary', label: '开盘摘要', icon: Sun, desc: '盘前参考价' },
  { value: 'close_summary', label: '收盘摘要', icon: Moon, desc: '收盘价、成交量、换手率等' },
]

function getMarketFromCode(code: string): string {
  if (code.endsWith('.SH')) return '上海'
  if (code.endsWith('.SZ')) return '深圳'
  if (code.endsWith('.BJ')) return '北京'
  if (code.endsWith('.HK')) return '港股'
  return ''
}

export default function liliStockQuery() {
  const isMobile = useMobile()
  const [tickerInput, setTickerInput] = useState('')
  const [queryType, setQueryType] = useState<LiliQueryType>('realtime_price')
  const { result, loading, error, query } = useLiliQuery()
  const { items: watchlist, addItem, removeItem } = useLiliWatchlist()

  const [watchlistName, setWatchlistName] = useState('')
  const [watchlistCode, setWatchlistCode] = useState('')
  const [watchlistCost, setWatchlistCost] = useState('')
  const [watchlistQty, setWatchlistQty] = useState('')
  const [activeTab, setActiveTab] = useState<'query' | 'watchlist'>('query')

  const handleQuery = useCallback(async () => {
    const ticker = tickerInput.trim()
    if (!ticker) return
    await query({ ticker, type: queryType })
  }, [tickerInput, queryType, query])

  const handleAddWatchlist = useCallback(() => {
    const code = watchlistCode.trim()
    const name = watchlistName.trim()
    if (!code || !name) return
    const item: LiliWatchlistItem = {
      code,
      name,
      holdCost: watchlistCost ? parseFloat(watchlistCost) : undefined,
      holdQuantity: watchlistQty ? parseFloat(watchlistQty) : undefined,
    }
    addItem(item)
    setWatchlistCode('')
    setWatchlistName('')
    setWatchlistCost('')
    setWatchlistQty('')
  }, [watchlistCode, watchlistName, watchlistCost, watchlistQty, addItem])

  const handleQuickQuery = useCallback(
    (code: string) => {
      setTickerInput(code)
      setActiveTab('query')
    },
    []
  )

  // 计算自选股盈亏（需要查询实时价格）
  const [watchlistPrices, setWatchlistPrices] = useState<Record<string, number>>({})
  const [watchlistLoading, setWatchlistLoading] = useState(false)

  const refreshWatchlistPrices = useCallback(async () => {
    if (watchlist.length === 0) return
    setWatchlistLoading(true)
    try {
      const codes = watchlist.map((w) => w.code).join(',')
      const res = await apiFetch('/api/financial/lili/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: codes, type: 'realtime_price' }),
      })
      const json = await res.json()
      if (json.success && json.data?.data) {
        const prices: Record<string, number> = {}
        for (const row of json.data.data) {
          if (row.ts_code && typeof row.close === 'number') {
            prices[row.ts_code as string] = row.close as number
          }
        }
        setWatchlistPrices(prices)
      }
    } catch (err) {
      console.error('刷新自选股价格失败:', err)
    } finally {
      setWatchlistLoading(false)
    }
  }, [watchlist])

  const watchlistSummary = useMemo(() => {
    let totalCost = 0
    let totalValue = 0
    for (const item of watchlist) {
      if (item.holdCost && item.holdQuantity) {
        const price = watchlistPrices[item.code] || item.holdCost
        totalCost += item.holdCost * item.holdQuantity
        totalValue += price * item.holdQuantity
      }
    }
    const profit = totalValue - totalCost
    const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0
    return { totalCost, totalValue, profit, profitPercent }
  }, [watchlist, watchlistPrices])

  // 结果表格渲染
  const renderResultTable = () => {
    if (!result || !result.data || result.data.length === 0) return null
    const headers = Object.keys(result.data[0])
    return (
      <div style={{ overflowX: 'auto', marginTop: 24 }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ background: 'rgba(0,212,255,0.08)' }}>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: 'var(--accent-cyan)',
                    borderBottom: '1px solid var(--border-subtle)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.data.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  transition: 'background 0.2s',
                }}
              >
                {headers.map((h) => (
                  <td
                    key={h}
                    style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row[h] === null ? '-' : String(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: isMobile ? '80px 16px 40px' : '100px 40px 60px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 24 : 40 }}>
        <div
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
            marginBottom: 16,
          }}
        >
          <Database size={14} />
          lili 数据源
        </div>
        <h1 style={{ fontSize: isMobile ? 24 : 'clamp(28px, 3vw, 40px)', fontWeight: 700, marginBottom: 12 }}>
          多源数据<span className="gradient-text">一站式查询</span>
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--text-secondary)', maxWidth: 600, whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
          接入 lili Code 官方股票数据源，支持 A 股/港股实时行情、技术指标、开盘/收盘摘要
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid var(--border-subtle)' }}>
        {[
          { key: 'query', label: '数据查询' },
          { key: 'watchlist', label: `自选股 (${watchlist.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'query' | 'watchlist')}
            style={{
              padding: isMobile ? '10px 14px' : '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: isMobile ? 14 : 15,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'query' && (
        <>
          {/* Query Panel */}
          <div
            className="glass-card"
            style={{ padding: isMobile ? 20 : 32, marginBottom: 32 }}
          >
            {/* Ticker Input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: 'var(--text-primary)' }}>
                股票代码
              </label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={tickerInput}
                  onChange={(e) => setTickerInput(e.target.value)}
                  placeholder="例如：600519.SH, 0700.HK（最多3个，逗号分隔）"
                  style={{
                    flex: 1,
                    minWidth: isMobile ? '100%' : 200,
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                />
                <button
                  onClick={handleQuery}
                  disabled={loading || !tickerInput.trim()}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'var(--gradient-accent)',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading || !tickerInput.trim() ? 'not-allowed' : 'pointer',
                    opacity: loading || !tickerInput.trim() ? 0.6 : 1,
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Search size={16} />
                  {loading ? '查询中...' : '查询'}
                </button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                支持 A 股（.SH / .SZ / .BJ）和港股（.HK），一次最多 3 只。美股、ETF、指数暂不支持。
              </p>
            </div>

            {/* Query Type */}
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text-primary)' }}>
                查询类型
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
                {queryTypeOptions.map((opt) => {
                  const Icon = opt.icon
                  const isActive = queryType === opt.value
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setQueryType(opt.value)}
                      style={{
                        padding: isMobile ? 12 : 16,
                        borderRadius: 12,
                        border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        background: isActive ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon size={isMobile ? 18 : 20} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)', marginBottom: 8 }} />
                      <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 600, color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)', marginBottom: 4 }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: isMobile ? 11 : 12, color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: isMobile ? '12px 16px' : '16px 20px',
                borderRadius: 12,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 24,
              }}
            >
              <AlertTriangle size={isMobile ? 16 : 18} />
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="glass-card" style={{ padding: isMobile ? 16 : 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700 }}>查询结果</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  共 {result.data?.length || 0} 条数据
                </span>
              </div>
              {result.text && (
                <pre
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.02)',
                    padding: 12,
                    borderRadius: 8,
                    overflow: 'auto',
                    maxHeight: 120,
                    marginBottom: 16,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {result.text}
                </pre>
              )}
              {renderResultTable()}
            </div>
          )}
        </>
      )}

      {activeTab === 'watchlist' && (
        <>
          {/* Add Watchlist */}
          <div className="glass-card" style={{ padding: isMobile ? 16 : 24, marginBottom: 32 }}>
            <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, marginBottom: 16 }}>添加自选股</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 2fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>股票名称</label>
                <input
                  type="text"
                  value={watchlistName}
                  onChange={(e) => setWatchlistName(e.target.value)}
                  placeholder="例如：贵州茅台"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>股票代码</label>
                <input
                  type="text"
                  value={watchlistCode}
                  onChange={(e) => setWatchlistCode(e.target.value)}
                  placeholder="例如：600519.SH"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>持仓成本</label>
                <input
                  type="number"
                  value={watchlistCost}
                  onChange={(e) => setWatchlistCost(e.target.value)}
                  placeholder="可选"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>持仓数量</label>
                <input
                  type="number"
                  value={watchlistQty}
                  onChange={(e) => setWatchlistQty(e.target.value)}
                  placeholder="可选"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>
              <button
                onClick={handleAddWatchlist}
                disabled={!watchlistCode.trim() || !watchlistName.trim()}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--gradient-accent)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: !watchlistCode.trim() || !watchlistName.trim() ? 'not-allowed' : 'pointer',
                  opacity: !watchlistCode.trim() || !watchlistName.trim() ? 0.6 : 1,
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Plus size={16} />
                添加
              </button>
            </div>
          </div>

          {/* Watchlist Summary */}
          {watchlist.some((w) => w.holdCost && w.holdQuantity) && (
            <div
              className="glass-card"
              style={{
                padding: isMobile ? 16 : 20,
                marginBottom: 24,
                display: 'flex',
                gap: isMobile ? 16 : 32,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>总成本</div>
                <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700 }}>¥{watchlistSummary.totalCost.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>总市值</div>
                <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700 }}>¥{watchlistSummary.totalValue.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>盈亏</div>
                <div
                  style={{
                    fontSize: isMobile ? 16 : 20,
                    fontWeight: 700,
                    color: watchlistSummary.profit >= 0 ? 'var(--accent-green)' : '#ef4444',
                  }}
                >
                  {watchlistSummary.profit >= 0 ? '+' : ''}¥{watchlistSummary.profit.toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>收益率</div>
                <div
                  style={{
                    fontSize: isMobile ? 16 : 20,
                    fontWeight: 700,
                    color: watchlistSummary.profitPercent >= 0 ? 'var(--accent-green)' : '#ef4444',
                  }}
                >
                  {watchlistSummary.profitPercent >= 0 ? '+' : ''}
                  {watchlistSummary.profitPercent.toFixed(2)}%
                </div>
              </div>
              <button
                onClick={refreshWatchlistPrices}
                disabled={watchlistLoading}
                style={{
                  marginLeft: isMobile ? 0 : 'auto',
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {watchlistLoading ? '刷新中...' : '刷新价格'}
              </button>
            </div>
          )}

          {/* Watchlist Table */}
          {watchlist.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-muted)',
              }}
            >
              <Database size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
              <p>暂无自选股，请在上方添加</p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: isMobile ? 12 : 24, overflow: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  minWidth: isMobile ? 700 : 'auto',
                  borderCollapse: 'collapse',
                  fontSize: isMobile ? 13 : 14,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>名称</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>代码</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>市场</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>持仓成本</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>持仓数量</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>最新价</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>盈亏</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 500 }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((item) => {
                    const price = watchlistPrices[item.code]
                    const hasPosition = item.holdCost != null && item.holdQuantity != null
                    const profit = hasPosition && price ? (price - item.holdCost!) * item.holdQuantity! : 0
                    const profitPercent = hasPosition && price && item.holdCost! > 0 ? ((price - item.holdCost!) / item.holdCost!) * 100 : 0
                    return (
                      <tr key={item.code} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{item.name}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{item.code}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{getMarketFromCode(item.code)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {item.holdCost ? `¥${item.holdCost.toFixed(2)}` : '-'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {item.holdQuantity ?? '-'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>
                          {price ? `¥${price.toFixed(2)}` : '-'}
                        </td>
                        <td
                          style={{
                            padding: '14px 16px',
                            textAlign: 'right',
                            fontWeight: 600,
                            color: profit >= 0 ? 'var(--accent-green)' : '#ef4444',
                          }}
                        >
                          {hasPosition && price
                            ? `${profit >= 0 ? '+' : ''}¥${profit.toFixed(2)} (${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)`
                            : '-'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button
                              onClick={() => handleQuickQuery(item.code)}
                              title="查询"
                              style={{
                                padding: 6,
                                borderRadius: 6,
                                border: 'none',
                                background: 'rgba(0,212,255,0.1)',
                                color: 'var(--accent-cyan)',
                                cursor: 'pointer',
                              }}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => removeItem(item.code)}
                              title="删除"
                              style={{
                                padding: 6,
                                borderRadius: 6,
                                border: 'none',
                                background: 'rgba(239,68,68,0.1)',
                                color: '#ef4444',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Disclaimer */}
      <div
        style={{
          marginTop: 40,
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--text-muted)',
        }}
      >
        <p>AI 生成，不构成投资建议。数据来自 lili Code 官方数据源，仅供参考。</p>
      </div>
    </div>
  )
}
