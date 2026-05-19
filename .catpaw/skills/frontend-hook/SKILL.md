---
name: frontend-hook
description: Templates and patterns for creating custom React hooks in the lili Hub frontend project. Use when writing new data-fetching hooks, CRUD operation hooks, polling hooks, or refactoring existing hooks in packages/frontend/src/hooks/. Covers standard hook structure, apiFetch integration, optimistic updates, polling with deduplication, and the single-responsibility split rule.
---

# Frontend Hook Development Guide

## Core Principle: One Hook Per File

The current `useStockData.ts` contains 9 hooks in 466 lines. **New hooks MUST be in separate files.**

### File Naming

```
hooks/
├── useStockData.ts       ← TODO: split into individual files
├── useMobile.ts          ✅ Good: single hook
├── useLiliDatasource.ts  ✅ Good: single hook
├── useScrollbar.ts       ✅ Good: single hook
├── useYourFeature.ts     ✅ New hooks go here
```

## Template 1: Data Fetching Hook (Read-Only)

For fetching and displaying data:

```typescript
import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../utils/api'

export interface YourDataType {
  id: string
  name: string
  // ...
}

export function useYourData(paramId?: string) {
  const [data, setData] = useState<YourDataType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!paramId) return  // guard: skip if no param
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch(`/api/your-endpoint/${paramId}`)
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      } else {
        setError(json.message || '获取数据失败')
      }
    } catch (err) {
      setError('网络请求失败')
    } finally {
      setLoading(false)
    }
  }, [paramId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
```

**Return value contract**: `{ data, loading, error, refetch }` — always include all four.

## Template 2: Polling Hook (with Deduplication)

For data that refreshes periodically (market indices, commodities):

```typescript
import { useState, useEffect, useCallback, useRef } from 'react'
import { apiFetch } from '../utils/api'

export function usePollingData(intervalMs = 15000) {
  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)
  const fetchingRef = useRef(false)  // Prevents concurrent requests

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) return  // Skip if previous request in-flight
    fetchingRef.current = true
    setLoading(true)
    try {
      const res = await apiFetch('/api/your-polling-endpoint')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    } catch {
      // Silent fail for polling — don't show errors to user
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchData()           // Initial fetch
    const interval = setInterval(fetchData, intervalMs)  // Poll
    return () => clearInterval(interval)
  }, [fetchData, intervalMs])

  return { data, loading, refetch: fetchData }
}

// Usage:
// const { indices, loading } = usePollingData(15000)
```

**Critical**: Always use `fetchingRef` to prevent request pile-up on slow networks.

## Template 3: CRUD Hook (Create/Read Update/Delete)

For user-modifiable data (watchlist, positions):

```typescript
import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../utils/api'

export interface Item {
  id: string
  name: string
  // ...
}

export function useCrudItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)

  // READ: fetch all items
  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/crud-items')
      const json = await res.json()
      if (json.success) setItems(json.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  // CREATE: add item (optimistic update optional)
  const addItem = useCallback(async (itemData: Omit<Item, 'id'>) => {
    try {
      const res = await apiFetch('/api/crud-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      })
      const json = await res.json()
      if (json.success) {
        setItems(prev => [...prev, json.data])  // Server returns new item
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  // DELETE: remove item (optimistic UI update)
  const removeItem = useCallback(async (id: string) => {
    try {
      const res = await apiFetch(`/api/crud-items/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setItems(prev => prev.filter(i => i.id !== id))  // Optimistic removal
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  return { items, loading, refetch: fetchItems, addItem, removeItem }
}
```

## Template 4: Search Hook (with Debounce)

```typescript
import { useState, useCallback, useRef, useEffect } from 'react'
import { apiFetch } from '../utils/api'

export function useSearch() {
  const [results, setResults] = useState<ResultType[]>([])
  const [loading, setLoading] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>()

  const search = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([])
      return
    }

    // Debounce: wait 300ms after user stops typing
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await apiFetch(`/api/search?keyword=${encodeURIComponent(keyword.trim())}`)
        const json = await res.json()
        if (json.success) setResults(json.data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current) }
  }, [])

  return { results, loading, search }
}
```

## Rules Checklist

Every hook in this project MUST follow these rules:

- [ ] **Use `apiFetch()`**, never raw `fetch()`
- [ ] **Export interfaces** for all data types used by the hook
- [ ] **Wrap async logic in `useCallback`** with proper dependencies
- [ ] **Call the callback inside `useEffect`** for auto-fetching
- [ ] **Set `loading` state** in try/finally blocks
- [ ] **Handle `json.success === false`** case with error message
- [ ] **One file per hook** — no multi-hook monster files
- [ ] **No `console.error` in production code** — handle or silence errors appropriately
- [ ] **For polling**: always use `fetchingRef` to prevent concurrency
- [ ] **For SSE**: always use `AbortController`, abort on unmount
- [ ] **Return consistent shape**: `{ data, loading, error?, refetch, ...actions }`

## Existing Hooks Reference

| Hook | File | Purpose | Returns |
|------|------|---------|---------|
| `useStockData` | useStockData.ts | Paginated stock list | `{ response, stocks, loading, error, lastUpdate, refetch }` |
| `useStockSearch` | useStockData.ts | Stock search | `{ results, loading, search }` |
| `useMarketIndices` | useStockData.ts | Market indices (polling) | `{ indices, loading, refetch }` |
| `useCommodities` | useStockData.ts | Commodities (polling) | `{ commodities, loading, refetch }` |
| `useStockDetail` | useStockData.ts | Single stock detail | `{ detail, loading, error, refetch }` |
| `useTechnicalIndicators` | useStockData.ts | MA/MACD/KDJ/RSI/BOLL | `{ indicators, loading, error, refetch }` |
| `useMinuteData` | useStockData.ts | Minute K-line | `{ data, loading, refetch }` |
| `useWatchlist` | useStockData.ts | Watchlist CRUD | `{ items, loading, refetch, addItem, removeItem }` |
| `usePositions` | useStockData.ts | Positions CRUD + summary | `{ items, summary, loading, refetch, addPosition, removePosition }` |
| `useMobile` | useMobile.ts | Responsive breakpoint | `boolean` (isMobile) |
| `useScrollbar` | useScrollbar.ts | Custom scrollbar init | void (side-effect) |
| `useLiliDatasource` | useLiliDatasource.ts | lili CLI query | lili-specific types |
