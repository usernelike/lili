import { apiFetch } from '../utils/api'
import { useState, useCallback, useEffect } from 'react'

export type LiliQueryType = 'realtime_price' | 'realtime_tech' | 'open_summary' | 'close_summary'

export interface LiliQueryRequest {
  ticker: string
  type?: LiliQueryType
  time?: string
}

export interface LiliQueryRow {
  [key: string]: string | number | null
}

export interface LiliQueryResult {
  success: boolean
  text: string
  data: LiliQueryRow[]
  error?: string
}

export interface LiliWatchlistItem {
  code: string
  name: string
  market?: string
  holdCost?: number
  holdQuantity?: number
  note?: string
  category?: string
}

export function useLiliQuery() {
  const [result, setResult] = useState<LiliQueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const query = useCallback(async (params: LiliQueryRequest) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch('/api/financial/lili/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      const json = await res.json()
      if (json.success) {
        setResult(json.data)
        return json.data as LiliQueryResult
      } else {
        setError(json.message || '查询失败')
        return null
      }
    } catch {
      setError('网络请求失败')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { result, loading, error, query }
}

// 从后端 API 读写 Lili 自选股
export function useLiliWatchlist() {
  const [items, setItems] = useState<LiliWatchlistItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/watchlist')
      const json = await res.json()
      if (json.success && json.data) {
        const mapped = json.data.map((row: Record<string, unknown>) => ({
          code: String(row.code),
          name: String(row.name),
          market: row.market ? String(row.market) : undefined,
          holdCost: row.hold_cost ? Number(row.hold_cost) : undefined,
          holdQuantity: row.hold_quantity ? Number(row.hold_quantity) : undefined,
          note: row.note ? String(row.note) : undefined,
          category: row.category ? String(row.category) : undefined,
        }))
        setItems(mapped)
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

  const addItem = useCallback(async (item: LiliWatchlistItem) => {
    try {
      const res = await apiFetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: item.code,
          name: item.name,
          market: item.market || '',
          note: item.note,
          category: item.category,
          hold_cost: item.holdCost,
          hold_quantity: item.holdQuantity,
        }),
      })
      const json = await res.json()
      if (json.success) {
        await fetchItems()
        return true
      }
    } catch {
      // ignore
    }
    return false
  }, [fetchItems])

  const removeItem = useCallback(async (code: string) => {
    try {
      const res = await apiFetch(`/api/watchlist/${encodeURIComponent(code)}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        await fetchItems()
        return true
      }
    } catch {
      // ignore
    }
    return false
  }, [fetchItems])

  const updateItem = useCallback(async (code: string, updates: Partial<LiliWatchlistItem>) => {
    try {
      const res = await apiFetch(`/api/watchlist/${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: updates.note,
          category: updates.category,
        }),
      })
      const json = await res.json()
      if (json.success) {
        await fetchItems()
        return true
      }
    } catch {
      // ignore
    }
    return false
  }, [fetchItems])

  return { items, loading, addItem, removeItem, updateItem }
}
