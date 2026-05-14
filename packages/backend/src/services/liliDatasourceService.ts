import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { randomUUID } from 'crypto'

const API_URL = 'https://api.kimi.com/coding/v1/tools'
const CREDENTIAL_FILE = path.join(process.env.HOME || process.env.USERPROFILE || '', '.kimi', 'credentials', 'kimi-code.json')

export type QueryType = 'realtime_price' | 'realtime_tech' | 'open_summary' | 'close_summary'

export interface LiliStockQueryParams {
  ticker: string
  type?: QueryType
  time?: string
  file_path?: string
}

// realtime_price CSV columns: ts_code, time, open, close, high, low, vol, amount, pct_change, pct_change_1m
export interface RealtimePriceRow {
  ts_code: string
  time: string
  open: number
  close: number
  high: number
  low: number
  vol: number
  amount: number
  pct_change: number
  pct_change_1m: number
}

// realtime_tech CSV columns: KDJ, OBV, BOLL, MA, EXPMA, MACD, LB, ROC, BBI, CCI, RSI, ATR, thscode, time
export interface RealtimeTechRow {
  KDJ?: string
  OBV?: string
  BOLL?: string
  MA?: string
  EXPMA?: string
  MACD?: string
  LB?: string
  ROC?: string
  BBI?: string
  CCI?: string
  RSI?: string
  ATR?: string
  thscode: string
  time: string
}

// open_summary CSV columns: close, thscode, time
export interface OpenSummaryRow {
  close: number
  thscode: string
  time: string
}

// close_summary CSV columns: pre_close, open, high, low, close, vwap, chg, pct_chg, volume, amt, turn, thscode, time
export interface CloseSummaryRow {
  pre_close: number
  open: number | null
  high: number | null
  low: number | null
  close: number
  vwap: number | null
  chg: number | null
  pct_chg: number | null
  volume: number | null
  amt: number | null
  turn: number | null
  thscode: string
  time: string
}

export interface LiliQueryResult<T = unknown> {
  success: boolean
  text: string
  data: T[]
  error?: string
}

interface LiliApiResponse {
  is_success: boolean
  result?: {
    user?: Array<{ type: string; text: string }>
    assistant?: Array<{ type: string; text: string }>
  }
  files?: Array<{
    name: string
    content: string
    encoding: string
  }>
  error?: {
    user?: Array<{ text: string }>
    assistant?: Array<{ text: string }>
  }
}

function loadAccessToken(): string {
  if (!fs.existsSync(CREDENTIAL_FILE)) {
    throw new Error(`找不到 lili 凭证文件：${CREDENTIAL_FILE}，请先在命令行运行 \`kimi login\` 完成 OAuth 登录。`)
  }
  try {
    const data = JSON.parse(fs.readFileSync(CREDENTIAL_FILE, 'utf-8'))
    const token = data.access_token
    if (!token) {
      throw new Error('凭证文件里没有 access_token，请重新执行 `kimi login`。')
    }
    return token
  } catch (e) {
    if (e instanceof Error && e.message.includes('凭证文件')) throw e
    throw new Error(`凭证文件解析失败：${e}`)
  }
}

function normalizeTicker(ticker: string): string {
  const trimmed = ticker.trim()
  // 已经有后缀，直接返回（统一大写）
  if (/\.(SH|SZ|BJ|HK)$/i.test(trimmed)) {
    return trimmed.toUpperCase()
  }
  // 纯数字 6 位，按 A 股规则补后缀
  if (/^\d{6}$/.test(trimmed)) {
    const first = trimmed[0]
    if (first === '6') {
      return `${trimmed}.SH`
    }
    if (first === '0' || first === '2' || first === '3') {
      return `${trimmed}.SZ`
    }
    if (first === '4' || first === '8') {
      return `${trimmed}.BJ`
    }
  }
  // 无法识别，原样返回，让底层 API 决定
  return trimmed
}

function parseCSV<T extends Record<string, string | number | null>>(csvContent: string): T[] {
  const lines = csvContent.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim())
  const rows: T[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const row: Record<string, string | number | null> = {}
    for (let j = 0; j < headers.length; j++) {
      const raw = values[j]?.trim() ?? ''
      if (raw === '' || raw === 'NA' || raw === 'null') {
        row[headers[j]] = null
      } else {
        const num = Number(raw)
        row[headers[j]] = Number.isNaN(num) ? raw : num
      }
    }
    rows.push(row as T)
  }

  return rows
}

export async function queryLiliStock(params: LiliStockQueryParams): Promise<LiliQueryResult> {
  const ticker = params.ticker.trim()
  if (!ticker) {
    throw new Error('缺少必填参数 ticker')
  }

  const tickers = ticker.split(',').filter((t) => t.trim()).map(normalizeTicker)
  if (tickers.length > 3) {
    throw new Error('ticker 最多只能传 3 个，用逗号分隔')
  }

  const queryType = (params.type || 'realtime_price') as QueryType
  const validTypes: QueryType[] = ['realtime_price', 'realtime_tech', 'open_summary', 'close_summary']
  if (!validTypes.includes(queryType)) {
    throw new Error(`type 只能是 ${validTypes.join('/')} 中的一个，收到：${queryType}`)
  }

  const normalizedTicker = tickers.join(',')
  const token = loadAccessToken()
  const safeTicker = normalizedTicker.replace(/,/g, '_').replace(/\./g, '_')
  const filePath = params.file_path || `/tmp/stock_${safeTicker}_${queryType}.csv`
  const payload = {
    method: 'get_stock_realtime_price',
    params: {
      ticker: normalizedTicker,
      type: queryType,
      file_path: filePath,
      ...(params.time ? { time: params.time } : {}),
    },
  }

  try {
    const response = await axios.post<LiliApiResponse>(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Msh-Tool-Call-Id': randomUUID(),
        'X-Msh-Platform': 'kimi_cli',
        'X-Msh-Version': 'kimi-datasource',
        'X-Msh-Device-Name': 'kimi-datasource',
        'X-Msh-Device-Model': 'kimi-datasource',
        'X-Msh-Os-Version': process.platform,
        'X-Msh-Device-Id': 'kimi-datasource',
        'User-Agent': 'kimi-datasource/2.0',
      },
      timeout: 30000,
    })

    const data = response.data

    if (!data.is_success) {
      const errMsg = data.error?.user?.[0]?.text || data.error?.assistant?.[0]?.text || '接口返回失败'
      return { success: false, text: errMsg, data: [], error: errMsg }
    }

    const text = data.result?.user
      ?.filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n\n') || ''

    // Parse CSV from files array
    let parsedData: unknown[] = []
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        if (file.name.endsWith('.csv') && file.content) {
          const rows = parseCSV(file.content)
          parsedData = parsedData.concat(rows)
        }
      }
    }

    return { success: true, text, data: parsedData }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.error?.user?.[0]?.text || error.message
      return { success: false, text: msg, data: [], error: msg }
    }
    throw error
  }
}

// Convenience wrappers for each query type
export async function queryRealtimePrice(ticker: string, time?: string): Promise<LiliQueryResult<RealtimePriceRow>> {
  return queryLiliStock({ ticker, type: 'realtime_price', time }) as Promise<LiliQueryResult<RealtimePriceRow>>
}

export async function queryRealtimeTech(ticker: string, time?: string): Promise<LiliQueryResult<RealtimeTechRow>> {
  return queryLiliStock({ ticker, type: 'realtime_tech', time }) as Promise<LiliQueryResult<RealtimeTechRow>>
}

export async function queryOpenSummary(ticker: string, time?: string): Promise<LiliQueryResult<OpenSummaryRow>> {
  return queryLiliStock({ ticker, type: 'open_summary', time }) as Promise<LiliQueryResult<OpenSummaryRow>>
}

export async function queryCloseSummary(ticker: string, time?: string): Promise<LiliQueryResult<CloseSummaryRow>> {
  return queryLiliStock({ ticker, type: 'close_summary', time }) as Promise<LiliQueryResult<CloseSummaryRow>>
}
