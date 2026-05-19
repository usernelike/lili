import { apiFetch } from '../utils/api'
import { useState, useEffect, useCallback, useRef } from 'react'

export interface StockData {
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

export interface KLineData {
  date: string
  open: number
  close: number
  high: number
  low: number
  volume: number
  amount: number
}

export interface StockDetail extends StockData {
  bidPrice: number[]
  bidVolume: number[]
  askPrice: number[]
  askVolume: number[]
  turnoverRate: number
  peRatio: number
  pbRatio: number
  totalMarketCap: number
  floatMarketCap: number
  totalShares: number
  floatShares: number
  amplitude: number
  volumeRatio: number
  commissionRatio: number
  avgPrice: number
  week52High: number
  week52Low: number
  change5d: number
  change10d: number
  change20d: number
  kline: KLineData[]
}

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

export interface CommodityData {
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

export interface WatchlistItem {
  code: string
  name: string
  market: string
  addedAt: string
  note?: string
  category?: string
}

export interface PositionItem {
  id: string
  code: string
  name: string
  market: string
  costPrice: number
  shares: number
  addedAt: string
  note?: string
}

export interface PositionSummary {
  positions: PositionItem[]
  totalCost: number
  totalValue: number
  totalProfit: number
  totalProfitPercent: number
}

// ========== 基础行情 ==========

export interface PaginatedStockResponse {
  list: StockData[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function useStockData(page = 1, pageSize = 20) {
  const [response, setResponse] = useState<PaginatedStockResponse | null>(null)
  const [stocks, setStocks] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStocks = useCallback(async (p = page, ps = pageSize) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch(`/api/financial/stocks?page=${p}&pageSize=${ps}`)
      const data = await res.json()
      if (data.success) {
        setResponse(data.data)
        setStocks(data.data.list)
        setLastUpdate(new Date())
      } else {
        setError(data.message || '获取数据失败')
      }
    } catch (err) {
      setError('网络请求失败')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  return { response, stocks, loading, error, lastUpdate, refetch: fetchStocks }
}

export function useStockSearch() {
  const [results, setResults] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await apiFetch(`/api/financial/stocks/search?keyword=${encodeURIComponent(keyword)}`)
      const data = await res.json()
      if (data.success) {
        setResults(data.data.list)
      }
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, search }
}

export function useMarketIndices() {
  const [indices, setIndices] = useState<StockData[]>([])
  const [loading, setLoading] = useState(false)
  const fetchingRef = useRef(false)

  const fetchIndices = useCallback(async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await apiFetch('/api/financial/indices')
      const data = await res.json()
      if (data.success) {
        setIndices(data.data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchIndices()
    const interval = setInterval(fetchIndices, 15000)
    return () => clearInterval(interval)
  }, [fetchIndices])

  return { indices, loading, refetch: fetchIndices }
}

export function useCommodities() {
  const [commodities, setCommodities] = useState<CommodityData[]>([])
  const [loading, setLoading] = useState(false)
  const fetchingRef = useRef(false)

  const fetchCommodities = useCallback(async () => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await apiFetch('/api/financial/commodities')
      const data = await res.json()
      if (data.success) {
        setCommodities(data.data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchCommodities()
    const interval = setInterval(fetchCommodities, 15000)
    return () => clearInterval(interval)
  }, [fetchCommodities])

  return { commodities, loading, refetch: fetchCommodities }
}

// ========== 股票详情 ==========

export function useStockDetail(code: string) {
  const [detail, setDetail] = useState<StockDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    if (!code) return
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch(`/api/financial/stocks/${code}/detail`)
      const data = await res.json()
      if (data.success) {
        setDetail(data.data)
      } else {
        setError(data.message || '获取详情失败')
      }
    } catch (err) {
      setError('网络请求失败')
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return { detail, loading, error, refetch: fetchDetail }
}

// ========== 技术指标 ==========

export function useTechnicalIndicators(code: string) {
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIndicators = useCallback(async () => {
    if (!code) return
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch(`/api/financial/stocks/${code}/indicators`)
      const data = await res.json()
      if (data.success) {
        setIndicators(data.data)
      } else {
        setError(data.message || null)
      }
    } catch {
      setError('网络请求失败')
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    fetchIndicators()
  }, [fetchIndicators])

  return { indicators, loading, error, refetch: fetchIndicators }
}

// ========== 分钟K线 ==========

export function useMinuteData(code: string) {
  const [data, setData] = useState<MinuteData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!code) return
    setLoading(true)
    try {
      const res = await apiFetch(`/api/financial/stocks/${code}/minute`)
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    } catch (err) {
      console.error('Failed to fetch minute data:', err)
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, refetch: fetchData }
}

// ========== 自选股 ==========

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/financial/watchlist')
      const data = await res.json()
      if (data.success) {
        setItems(data.data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = useCallback(async (item: Omit<WatchlistItem, 'addedAt'>) => {
    try {
      const res = await apiFetch('/api/financial/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      const data = await res.json()
      if (data.success) {
        setItems((prev) => [...prev, data.data])
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  const removeItem = useCallback(async (code: string) => {
    try {
      const res = await apiFetch(`/api/financial/watchlist/${code}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.code !== code))
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  return { items, loading, refetch: fetchItems, addItem, removeItem }
}

// ========== 持仓 ==========

export function usePositions() {
  const [items, setItems] = useState<PositionItem[]>([])
  const [summary, setSummary] = useState<PositionSummary | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const [posRes, sumRes] = await Promise.all([
        apiFetch('/api/financial/positions'),
        apiFetch('/api/financial/positions/summary'),
      ])
      const posData = await posRes.json()
      const sumData = await sumRes.json()
      if (posData.success) {
        setItems(posData.data)
      }
      if (sumData.success) {
        setSummary(sumData.data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addPosition = useCallback(async (item: Omit<PositionItem, 'id' | 'addedAt'>) => {
    try {
      const res = await apiFetch('/api/financial/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      const data = await res.json()
      if (data.success) {
        await fetchItems()
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to add position:', err)
      return false
    }
  }, [fetchItems])

  const removePosition = useCallback(async (id: string) => {
    try {
      const res = await apiFetch(`/api/financial/positions/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.id !== id))
        if (summary) {
          setSummary({
            ...summary,
            positions: summary.positions.filter((p) => p.id !== id),
          })
        }
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to remove position:', err)
      return false
    }
  }, [summary])

  return { items, summary, loading, refetch: fetchItems, addPosition, removePosition }
}
