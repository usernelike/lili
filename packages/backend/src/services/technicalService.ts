import axios from 'axios'
import type { KLineData } from './stockService'

export interface TechnicalIndicators {
  ma: { ma5: number; ma10: number; ma20: number; ma60: number }
  macd: { dif: number; dea: number; macd: number }
  kdj: { k: number; d: number; j: number }
  rsi: { rsi6: number; rsi12: number; rsi24: number }
  boll: { upper: number; middle: number; lower: number }
}

export interface MinuteData {
  time: string
  price: number
  volume: number
  amount: number
}

// ========== 技术指标计算 ==========

/** 简单移动平均 SMA */
function sma(prices: number[], n: number): number[] {
  const result: number[] = []
  for (let i = 0; i < prices.length; i++) {
    if (i < n - 1) {
      result.push(0)
    } else {
      let sum = 0
      for (let j = 0; j < n; j++) sum += prices[i - j]
      result.push(sum / n)
    }
  }
  return result
}

/** 指数移动平均 EMA */
function ema(prices: number[], n: number): number[] {
  const result: number[] = []
  const k = 2 / (n + 1)
  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      result.push(prices[0])
    } else {
      result.push(prices[i] * k + result[i - 1] * (1 - k))
    }
  }
  return result
}

/** 计算MACD */
function calcMACD(prices: number[]): { dif: number[]; dea: number[]; macd: number[] } {
  const ema12 = ema(prices, 12)
  const ema26 = ema(prices, 26)
  const dif: number[] = []
  for (let i = 0; i < prices.length; i++) {
    dif.push(ema12[i] - ema26[i])
  }
  const dea = ema(dif, 9)
  const macd: number[] = []
  for (let i = 0; i < prices.length; i++) {
    macd.push((dif[i] - dea[i]) * 2)
  }
  return { dif, dea, macd }
}

/** 计算KDJ */
function calcKDJ(closes: number[], highs: number[], lows: number[], n = 9, m1 = 3, m2 = 3): { k: number[]; d: number[]; j: number[] } {
  const k: number[] = []
  const d: number[] = []
  const j: number[] = []

  for (let i = 0; i < closes.length; i++) {
    if (i < n - 1) {
      k.push(50)
      d.push(50)
      j.push(50)
      continue
    }
    let lowN = lows[i]
    let highN = highs[i]
    for (let j2 = 1; j2 < n; j2++) {
      lowN = Math.min(lowN, lows[i - j2])
      highN = Math.max(highN, highs[i - j2])
    }
    const rsv = highN === lowN ? 50 : ((closes[i] - lowN) / (highN - lowN)) * 100
    const kVal = (2 / 3) * (k[i - 1] || 50) + (1 / 3) * rsv
    const dVal = (2 / 3) * (d[i - 1] || 50) + (1 / 3) * kVal
    const jVal = 3 * kVal - 2 * dVal
    k.push(kVal)
    d.push(dVal)
    j.push(jVal)
  }
  return { k, d, j }
}

/** 计算RSI */
function calcRSI(prices: number[], periods = [6, 12, 24]): Record<string, number[]> {
  const result: Record<string, number[]> = {}
  const changes: number[] = []
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1])
  }

  for (const period of periods) {
    const rsi: number[] = []
    for (let i = 0; i < prices.length; i++) {
      if (i < period) {
        rsi.push(0)
        continue
      }
      let gain = 0
      let loss = 0
      for (let j = 0; j < period; j++) {
        const change = changes[i - j - 1] || 0
        if (change > 0) gain += change
        else loss += Math.abs(change)
      }
      const avgGain = gain / period
      const avgLoss = loss / period
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
      const rsiVal = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs)
      rsi.push(rsiVal)
    }
    result[`rsi${period}`] = rsi
  }
  return result
}

/** 计算BOLL */
function calcBOLL(prices: number[], n = 20, k = 2): { upper: number[]; middle: number[]; lower: number[] } {
  const ma20 = sma(prices, n)
  const upper: number[] = []
  const middle: number[] = []
  const lower: number[] = []

  for (let i = 0; i < prices.length; i++) {
    if (i < n - 1) {
      upper.push(0)
      middle.push(0)
      lower.push(0)
      continue
    }
    let sumSq = 0
    for (let j = 0; j < n; j++) {
      sumSq += Math.pow(prices[i - j] - ma20[i], 2)
    }
    const std = Math.sqrt(sumSq / n)
    upper.push(ma20[i] + k * std)
    middle.push(ma20[i])
    lower.push(ma20[i] - k * std)
  }
  return { upper, middle, lower }
}

/** 计算所有技术指标 */
export function calculateIndicators(kline: KLineData[]): TechnicalIndicators | null {
  if (kline.length < 60) return null

  const closes = kline.map((d) => d.close)
  const highs = kline.map((d) => d.high)
  const lows = kline.map((d) => d.low)

  const ma5Arr = sma(closes, 5)
  const ma10Arr = sma(closes, 10)
  const ma20Arr = sma(closes, 20)
  const ma60Arr = sma(closes, 60)
  const last = closes.length - 1

  const { dif, dea, macd } = calcMACD(closes)
  const { k, d, j } = calcKDJ(closes, highs, lows)
  const rsi = calcRSI(closes)
  const { upper, middle, lower } = calcBOLL(closes)

  return {
    ma: {
      ma5: round(ma5Arr[last]),
      ma10: round(ma10Arr[last]),
      ma20: round(ma20Arr[last]),
      ma60: round(ma60Arr[last]),
    },
    macd: {
      dif: round(dif[last]),
      dea: round(dea[last]),
      macd: round(macd[last]),
    },
    kdj: {
      k: round(k[last]),
      d: round(d[last]),
      j: round(j[last]),
    },
    rsi: {
      rsi6: round(rsi.rsi6[last]),
      rsi12: round(rsi.rsi12[last]),
      rsi24: round(rsi.rsi24[last]),
    },
    boll: {
      upper: round(upper[last]),
      middle: round(middle[last]),
      lower: round(lower[last]),
    },
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

// ========== 分钟K线 ==========

/** 获取股票分钟K线 */
export async function getMinuteData(code: string): Promise<MinuteData[]> {
  const prefix = code.startsWith('6') ? 'sh' : 'sz'
  const fullCode = `${prefix}${code}`
  const url = `https://web.ifzq.gtimg.cn/appstock/app/minute/query?code=${fullCode}`

  try {
    const res = await axios.get(url, { timeout: 8000 })
    const rawList: string[] = res.data?.data?.[fullCode]?.data?.data || []
    return rawList.map((item) => {
      const parts = item.split(' ')
      return {
        time: parts[0] || '',
        price: parseFloat(parts[1]) || 0,
        volume: parseInt(parts[2]) || 0,
        amount: parseFloat(parts[3]) || 0,
      }
    })
  } catch {
    return []
  }
}
