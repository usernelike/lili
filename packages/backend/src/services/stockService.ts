import axios from 'axios'
import iconv from 'iconv-lite'

export interface StockQuote {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  amount: number
  high: number
  low: number
  open: number
  prevClose: number
  market: string
  updateTime: string
}

export interface StockDetail extends StockQuote {
  // 买卖盘
  bidPrice: number[]
  bidVolume: number[]
  askPrice: number[]
  askVolume: number[]
  // 基本面
  turnoverRate: number
  peRatio: number
  pbRatio: number
  totalMarketCap: number
  floatMarketCap: number
  totalShares: number
  floatShares: number
  // 价格统计
  amplitude: number
  volumeRatio: number
  commissionRatio: number
  avgPrice: number
  week52High: number
  week52Low: number
  // 近期涨跌
  change5d: number
  change10d: number
  change20d: number
  // K线数据（日K）
  kline: KLineData[]
}

export interface KLineData {
  date: string
  open: number
  close: number
  high: number
  low: number
  volume: number
  amount: number
}

export interface CommodityQuote {
  code: string
  name: string
  price: number
  changePercent: number
  open: number
  prevClose: number
  high: number
  low: number
  updateTime: string
}

const TENCENT_API = 'https://qt.gtimg.cn/q='

const STOCK_LIST: Array<{ code: string; name: string; market: string }> = [
  { code: 'sh600519', name: '贵州茅台', market: '上海' },
  { code: 'sz000001', name: '平安银行', market: '深圳' },
  { code: 'sz000002', name: '万科A', market: '深圳' },
  { code: 'sz300033', name: '同花顺', market: '深圳' },
  { code: 'sz000858', name: '五粮液', market: '深圳' },
  { code: 'sz002594', name: '比亚迪', market: '深圳' },
  { code: 'sh600036', name: '招商银行', market: '上海' },
  { code: 'sh601318', name: '中国平安', market: '上海' },
  { code: 'sh600276', name: '恒瑞医药', market: '上海' },
  { code: 'sz000725', name: '京东方A', market: '深圳' },
  { code: 'sh600900', name: '长江电力', market: '上海' },
  { code: 'sz002415', name: '海康威视', market: '深圳' },
]

const COMMODITY_LIST: Array<{ code: string; name: string }> = [
  { code: 'hf_GC', name: 'COMEX黄金' },
  { code: 'hf_CL', name: 'NYMEX原油' },
  { code: 'hf_HG', name: 'COMEX铜' },
  { code: 'hf_SI', name: 'COMEX白银' },
  { code: 'hf_NG', name: 'NYMEX天然气' },
]

const INDEX_CODES = [
  { code: 'sh000001', name: '上证指数' },
  { code: 'sz399001', name: '深证成指' },
  { code: 'sz399006', name: '创业板指' },
  { code: 'sh000688', name: '科创50' },
]

const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 5000

async function fetchTencentGBK(url: string): Promise<string> {
  const response = await axios.get(url, {
    timeout: 10000,
    responseType: 'arraybuffer',
    headers: { Referer: 'https://stock.finance.qq.com' },
  })
  return iconv.decode(Buffer.from(response.data), 'gbk')
}

export function parseTencentResponse(raw: string): StockQuote[] {
  const results: StockQuote[] = []
  const lines = raw.trim().split(';').filter(Boolean)

  for (const line of lines) {
    const match = line.match(/v_[^=]+="(.+)"/)
    if (!match) continue

    const parts = match[1].split('~')
    if (parts.length < 45) continue

    const name = parts[1]
    const code = parts[2]
    const price = parseFloat(parts[3]) || 0
    const prevClose = parseFloat(parts[4]) || 0
    const open = parseFloat(parts[5]) || 0
    const volume = parseInt(parts[6]) || 0
    const high = parseFloat(parts[33]) || 0
    const low = parseFloat(parts[34]) || 0
    const amount = parseFloat(parts[37]) || 0
    const updateTime = parts[45] || ''

    const change = price - prevClose
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0

    const stockInfo = STOCK_LIST.find((s) => s.code === `sh${code}` || s.code === `sz${code}`)

    results.push({
      code,
      name: name || stockInfo?.name || code,
      price,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume,
      amount,
      high,
      low,
      open,
      prevClose,
      market: stockInfo?.market || (code.startsWith('6') ? '上海' : '深圳'),
      updateTime,
    })
  }

  return results
}

// 解析单只股票详情（扩展字段）
export function parseStockDetail(raw: string): StockDetail | null {
  const lines = raw.trim().split(';').filter(Boolean)
  if (lines.length === 0) return null

  const match = lines[0].match(/v_[^=]+="(.+)"/)
  if (!match) return null

  const p = match[1].split('~')
  if (p.length < 50) return null

  const code = p[2]
  const price = parseFloat(p[3]) || 0
  const prevClose = parseFloat(p[4]) || 0
  const open = parseFloat(p[5]) || 0
  const volume = parseInt(p[6]) || 0
  const high = parseFloat(p[33]) || 0
  const low = parseFloat(p[34]) || 0
  const amount = parseFloat(p[37]) || 0

  // 买卖盘 10档
  const bidPrice: number[] = []
  const bidVolume: number[] = []
  const askPrice: number[] = []
  const askVolume: number[] = []
  for (let i = 0; i < 5; i++) {
    bidPrice.push(parseFloat(p[9 + i * 2]) || 0)
    bidVolume.push(parseInt(p[10 + i * 2]) || 0)
    askPrice.push(parseFloat(p[19 + i * 2]) || 0)
    askVolume.push(parseInt(p[20 + i * 2]) || 0)
  }

  const change = price - prevClose
  const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0
  const stockInfo = STOCK_LIST.find((s) => s.code === `sh${code}` || s.code === `sz${code}`)

  return {
    code,
    name: p[1] || stockInfo?.name || code,
    price,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    volume,
    amount,
    high,
    low,
    open,
    prevClose,
    market: stockInfo?.market || (code.startsWith('6') ? '上海' : '深圳'),
    updateTime: p[30] || '',
    bidPrice,
    bidVolume,
    askPrice,
    askVolume,
    turnoverRate: parseFloat(p[38]) || 0,
    peRatio: parseFloat(p[39]) || 0,
    pbRatio: parseFloat(p[46]) || 0,
    totalMarketCap: parseFloat(p[44]) || 0,
    floatMarketCap: parseFloat(p[45]) || 0,
    totalShares: parseFloat(p[67]) || 0,
    floatShares: parseFloat(p[68]) || 0,
    amplitude: parseFloat(p[43]) || 0,
    volumeRatio: parseFloat(p[49]) || 0,
    commissionRatio: parseFloat(p[50]) || 0,
    avgPrice: parseFloat(p[51]) || 0,
    week52High: parseFloat(p[47]) || 0,
    week52Low: parseFloat(p[48]) || 0,
    change5d: parseFloat(p[62]) || 0,
    change10d: parseFloat(p[63]) || 0,
    change20d: parseFloat(p[64]) || 0,
    kline: [],
  }
}

export function parseCommodityResponse(raw: string): CommodityQuote[] {
  const results: CommodityQuote[] = []
  const lines = raw.trim().split(';').filter(Boolean)

  for (const line of lines) {
    const match = line.match(/v_([^=]+)="(.+)"/)
    if (!match) continue

    const code = match[1]
    const parts = match[2].split(',')
    if (parts.length < 8) continue

    const price = parseFloat(parts[0]) || 0
    const changePercent = parseFloat(parts[1]) || 0
    const open = parseFloat(parts[2]) || 0
    const prevClose = parseFloat(parts[3]) || 0
    const high = parseFloat(parts[4]) || 0
    const low = parseFloat(parts[5]) || 0
    const updateTime = parts[6] || ''

    const info = COMMODITY_LIST.find((c) => c.code === code)

    results.push({
      code,
      name: info?.name || code,
      price: Math.round(price * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      open: Math.round(open * 100) / 100,
      prevClose: Math.round(prevClose * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      updateTime,
    })
  }

  return results
}

// 解析腾讯K线数据
export function parseKLineResponse(raw: string, stockCode: string): KLineData[] {
  try {
    const data = JSON.parse(raw)
    const lines = data?.data?.[stockCode]?.day || []
    return lines.map((line: string[]) => ({
      date: line[0],
      open: parseFloat(line[1]) || 0,
      close: parseFloat(line[2]) || 0,
      high: parseFloat(line[3]) || 0,
      low: parseFloat(line[4]) || 0,
      volume: parseInt(line[5]) || 0,
      amount: parseFloat(line[6]) || 0,
    }))
  } catch {
    return []
  }
}

export async function getRealTimeQuotes(codes?: string[]): Promise<StockQuote[]> {
  const targetCodes = codes && codes.length > 0 ? codes : STOCK_LIST.map((s) => s.code)
  const cacheKey = targetCodes.join(',')

  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as StockQuote[]
  }

  const url = `${TENCENT_API}${targetCodes.join(',')}`
  const raw = await fetchTencentGBK(url)
  const data = parseTencentResponse(raw)
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

export async function getMarketIndices(): Promise<StockQuote[]> {
  const cacheKey = 'indices'
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as StockQuote[]
  }

  const url = `${TENCENT_API}${INDEX_CODES.map((i) => i.code).join(',')}`
  const raw = await fetchTencentGBK(url)
  const data = parseTencentResponse(raw)
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

export async function getCommodities(): Promise<CommodityQuote[]> {
  const cacheKey = 'commodities'
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as CommodityQuote[]
  }

  const url = `${TENCENT_API}${COMMODITY_LIST.map((c) => c.code).join(',')}`
  const raw = await fetchTencentGBK(url)
  const data = parseCommodityResponse(raw)
  cache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

// 获取单只股票详情（含扩展字段+K线）
export async function getStockDetail(code: string): Promise<StockDetail | null> {
  const prefix = code.startsWith('6') ? 'sh' : 'sz'
  const fullCode = `${prefix}${code}`

  // 获取实时详情
  const url = `${TENCENT_API}${fullCode}`
  const raw = await fetchTencentGBK(url)
  const detail = parseStockDetail(raw)
  if (!detail) return null

  // 尝试获取K线数据（最近60天）
  try {
    const today = new Date()
    const start = new Date(today.getTime() - 120 * 24 * 60 * 60 * 1000)
    const startStr = start.toISOString().slice(0, 10).replace(/-/g, '')
    const endStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const klineUrl = `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${fullCode},day,${startStr},${endStr},120,qfq`
    const klineRaw = await axios.get(klineUrl, { timeout: 8000 })
    const klineData = parseKLineResponse(JSON.stringify(klineRaw.data), fullCode)
    detail.kline = klineData
  } catch {
    detail.kline = []
  }

  return detail
}
