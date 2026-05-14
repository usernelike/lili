import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input } from 'antd'
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Zap,
  BarChart3,
  Sunrise,
  Sunset,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Terminal,
  Copy,
  Check,
  Eye,
  Inbox,
} from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import { useStockData, useMarketIndices, useCommodities } from '../hooks/useStockData'
import type { StockData } from '../hooks/useStockData'

const features = [
  {
    icon: TrendingUp,
    title: '实时行情',
    desc: '最新价 + 分钟 K 线',
    a: true,
    hk: true,
  },
  {
    icon: BarChart3,
    title: '技术指标',
    desc: 'MA / MACD / KDJ / RSI / BOLL / CCI',
    a: true,
    hk: false,
  },
  {
    icon: Sunrise,
    title: '开盘摘要',
    desc: '盘前参考价',
    a: true,
    hk: true,
  },
  {
    icon: Sunset,
    title: '收盘摘要',
    desc: '完整收盘数据',
    a: true,
    hk: true,
  },
]

const examples = [
  {
    title: '查单只股票实时价格',
    cmd: 'query_stock(ticker="600519.SH", type="realtime_price")',
  },
  {
    title: '查技术指标',
    cmd: 'query_stock(ticker="600519.SH", type="realtime_tech")',
  },
  {
    title: '查港股收盘',
    cmd: 'query_stock(ticker="0700.HK", type="close_summary")',
  },
  {
    title: '批量查询（最多 3 只）',
    cmd: 'query_stock(ticker="600519.SH,000858.SZ,0700.HK", type="realtime_price")',
  },
]

const marketSupport = [
  { market: 'A 股 上交所', suffix: '.SH', realtime: true, tech: true, open: true, close: true },
  { market: 'A 股 深交所', suffix: '.SZ', realtime: true, tech: true, open: true, close: true },
  { market: 'A 股 北交所', suffix: '.BJ', realtime: true, tech: true, open: true, close: true },
  { market: '港股', suffix: '.HK', realtime: true, tech: false, open: true, close: true },
  { market: '美股 / ETF / 指数', suffix: '—', realtime: false, tech: false, open: false, close: false },
]

export default function FinancialData() {
  const navigate = useNavigate()
  const { stocks, loading, lastUpdate, refetch } = useStockData()
  const { indices } = useMarketIndices()
  const { commodities, loading: commodityLoading } = useCommodities()
  const [searchValue, setSearchValue] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const filtered = stocks.filter(
    (s) => s.name.includes(searchValue) || s.code.includes(searchValue)
  )

  const columns: ColumnsType<StockData> = [
    {
      title: '代码',
      dataIndex: 'code',
      width: 100,
      render: (code, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{code}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.market}</div>
        </div>
      ),
    },
    { title: '名称', dataIndex: 'name', render: (n) => <span style={{ fontWeight: 500 }}>{n}</span> },
    {
      title: '最新价',
      dataIndex: 'price',
      align: 'right',
      render: (p, r) => (
        <span style={{ fontWeight: 700, fontSize: 16, color: r.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          ¥{p.toFixed(2)}
        </span>
      ),
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      align: 'right',
      render: (c) => <span style={{ color: c >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{c >= 0 ? '+' : ''}{c.toFixed(2)}</span>,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      align: 'right',
      render: (c) => (
        <Tag style={{ background: c >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: c >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', border: 'none', fontWeight: 600 }}>
          {c >= 0 ? <TrendingUp size={12} style={{ marginRight: 4 }} /> : <TrendingDown size={12} style={{ marginRight: 4 }} />}
          {c >= 0 ? '+' : ''}{c.toFixed(2)}%
        </Tag>
      ),
    },
    { title: '成交量', dataIndex: 'volume', align: 'right', render: (v) => v > 0 ? (v / 100).toFixed(0) + '手' : '-' },
    { title: '成交额', dataIndex: 'amount', align: 'right', render: (v) => v > 0 ? (v / 10000).toFixed(0) + '万' : '-' },
    { title: '最高', dataIndex: 'high', align: 'right', render: (v) => v > 0 ? v.toFixed(2) : '-' },
    { title: '最低', dataIndex: 'low', align: 'right', render: (v) => v > 0 ? v.toFixed(2) : '-' },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/stock/${record.code}`)
          }}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            background: 'transparent',
            color: 'var(--accent-cyan)',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Eye size={12} /> 详情
        </button>
      ),
    },
  ]

  const copy = (cmd: string, i: number) => {
    navigator.clipboard.writeText(cmd)
    setCopiedIdx(i)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div style={{ padding: '100px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(0,212,255,0.1)',
            border: '1px solid var(--border-glow)',
            color: 'var(--accent-cyan)',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          <Zap size={14} />
          lili 插件: lili-datasource v2.0.1
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          lili 股票助手
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          支持 A 股 / 港股实时行情、技术指标、开盘/收盘摘要查询
        </p>
      </div>

      {/* Risk Warning */}
      <div
        style={{
          padding: '12px 20px',
          borderRadius: 10,
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          color: 'var(--accent-orange)',
        }}
      >
        <AlertCircle size={16} />
        <span><strong>风险提示：</strong>数据仅供参考，不构成任何投资建议。投资有风险，入市需谨慎。</span>
      </div>

      {/* Features */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>插件能力</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {features.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.title}
              style={{
                padding: 20,
                borderRadius: 14,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-glow)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
            >
              <Icon size={22} style={{ color: 'var(--accent-cyan)', marginBottom: 10 }} />
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>{f.desc}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Tag style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', border: 'none', fontSize: 11 }}>A股 {f.a ? '✅' : '❌'}</Tag>
                <Tag style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', fontSize: 11 }}>港股 {f.hk ? '✅' : '❌'}</Tag>
              </div>
            </div>
          )
        })}
      </div>

      {/* Market Support */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>市场支持</h2>
      <div
        style={{
          marginBottom: 32,
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>市场</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>后缀</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>行情</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>指标</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>开盘</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>收盘</th>
            </tr>
          </thead>
          <tbody>
            {marketSupport.map((m, i) => (
              <tr key={m.market} style={{ borderTop: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 500 }}>{m.market}</td>
                <td style={{ padding: '10px 16px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{m.suffix}</td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}>{m.realtime ? <CheckCircle2 size={14} style={{ color: 'var(--accent-green)' }} /> : <XCircle size={14} style={{ color: 'var(--accent-red)' }} />}</td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}>{m.tech ? <CheckCircle2 size={14} style={{ color: 'var(--accent-green)' }} /> : <XCircle size={14} style={{ color: 'var(--accent-red)' }} />}</td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}>{m.open ? <CheckCircle2 size={14} style={{ color: 'var(--accent-green)' }} /> : <XCircle size={14} style={{ color: 'var(--accent-red)' }} />}</td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}>{m.close ? <CheckCircle2 size={14} style={{ color: 'var(--accent-green)' }} /> : <XCircle size={14} style={{ color: 'var(--accent-red)' }} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Commodities */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>大宗商品</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 32,
        }}
      >
        {commodityLoading || commodities.length === 0 ? (
          [0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: 16,
                borderRadius: 12,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                opacity: 0.5,
              }}
            >
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>加载中...</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>--</div>
            </div>
          ))
        ) : (
          commodities.slice(0, 4).map((c) => {
            const up = c.changePercent >= 0
            return (
              <div
                key={c.code}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-glow)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
              >
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{c.name}</div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: up ? 'var(--accent-green)' : 'var(--accent-red)',
                    marginBottom: 4,
                  }}
                >
                  {c.price > 0 ? c.price.toFixed(2) : '--'}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: up ? 'var(--accent-green)' : 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {up ? '+' : ''}{c.changePercent.toFixed(2)}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                  高 {c.high > 0 ? c.high.toFixed(2) : '--'} / 低 {c.low > 0 ? c.low.toFixed(2) : '--'}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Real-time Quotes */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>实时行情（腾讯证券接口）</h2>

      {/* Indices */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {indices.length > 0 ? indices.map((idx) => {
          const up = idx.change >= 0
          return (
            <div
              key={idx.code}
              style={{
                padding: 16,
                borderRadius: 12,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{idx.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: up ? 'var(--accent-green)' : 'var(--accent-red)' }}>{idx.price.toFixed(2)}</div>
              <div style={{ fontSize: 12, color: up ? 'var(--accent-green)' : 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: 4 }}>
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {up ? '+' : ''}{idx.change.toFixed(2)} ({up ? '+' : ''}{idx.changePercent.toFixed(2)}%)
              </div>
            </div>
          )
        }) : [0, 1, 2, 3].map((i) => (
          <div key={i} style={{ padding: 16, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', opacity: 0.5 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>加载中...</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>--</div>
          </div>
        ))}
      </div>

      {/* Stock Table */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <Input
            placeholder="搜索股票"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ paddingLeft: 40, background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          />
        </div>
        <button
          onClick={refetch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 10,
            border: '1px solid var(--border-subtle)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <RefreshCw size={14} />
          {lastUpdate ? `更新于 ${lastUpdate.toLocaleTimeString()}` : '刷新'}
        </button>
      </div>

      {filtered.length === 0 && !loading ? (
        <div
          style={{
            padding: '60px 0',
            textAlign: 'center',
            borderRadius: 12,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Inbox size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {searchValue ? `未找到匹配 "${searchValue}" 的股票` : '暂无股票数据'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {searchValue ? '请尝试其他关键词' : '数据加载中或接口暂不可用'}
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="code"
          pagination={false}
          scroll={{ x: 1000 }}
          loading={loading}
          style={{ marginBottom: 40 }}
          onRow={(record) => ({
            onClick: () => navigate(`/stock/${record.code}`),
            style: { cursor: 'pointer' },
          })}
        />
      )}

      {/* Usage Examples */}
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>使用示例</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
        在 lili Code CLI 对话中直接输入以下命令或自然语言提问：
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {examples.map((ex, i) => (
          <div
            key={ex.title}
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{ex.title}</div>
              <button
                onClick={() => copy(ex.cmd, i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {copiedIdx === i ? <Check size={12} style={{ color: 'var(--accent-green)' }} /> : <Copy size={12} />}
                {copiedIdx === i ? '已复制' : '复制'}
              </button>
            </div>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
                fontSize: 13,
                color: 'var(--accent-cyan)',
                overflowX: 'auto',
              }}
            >
              <Terminal size={14} style={{ marginRight: 8, verticalAlign: 'middle', opacity: 0.6 }} />
              {ex.cmd}
            </div>
          </div>
        ))}
      </div>

      {/* How to use */}
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>如何使用</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { step: '1', title: '在 lili Code CLI 中对话', desc: '直接输入股票相关问题，如"茅台现在多少钱"，插件自动识别并调用 query_stock 工具' },
            { step: '2', title: '核对股票代码', desc: 'AI 会自动搜索核对代码（如 600519.SH），无需记忆。也可直接提供带后缀的代码' },
            { step: '3', title: '查看结果', desc: '数据以中文摘要呈现，完整 CSV 保存在 /tmp/ 目录。支持一次查最多 3 只股票' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--gradient-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.step}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important notes */}
      <div
        style={{
          marginTop: 24,
          padding: '16px 20px',
          borderRadius: 12,
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.15)',
          fontSize: 13,
          color: 'var(--accent-orange)',
          lineHeight: 1.8,
        }}
      >
        <strong>重要须知：</strong>美股、ETF、指数、基金目前不支持。港股不支持技术指标查询。
        港股盘后查当天数据必须用 close_summary。任何涉及买卖判断的输出均标注"AI 生成，不构成投资建议"。
      </div>
    </div>
  )
}
