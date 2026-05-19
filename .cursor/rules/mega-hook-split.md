# Mega Hook Split Rules

## Problem
React hooks >300 lines are unmaintainable. A "mega hook" bundles state, API calls, UI logic, and effects together.

## Solution: Extract by Concern

### Pattern: One Hook = One Concern
```
useStockDetail.ts (800 lines) → split into:
  ├── useStockData.ts         — API fetch + data state
  ├── useStockChartData.ts    — chart data processing + computed values
  ├── useWatchlist.ts         — watchlist add/remove/check logic
  └── useStockDetail.ts       — orchestrator (combines above, <50 lines)
```

### Orchestrator Pattern
```typescript
// useStockDetail.ts — just combines extracted hooks
export function useStockDetail(code: string) {
  const stock = useStockData(code)
  const chart = useStockChartData(stock.data)
  const watchlist = useWatchlist(code)
  return { ...stock, ...chart, ...watchlist }
}
```

### Extraction Rules
1. **API logic** → separate hook (fetch function, loading/error state, retry)
2. **Computed/derived data** → separate hook (receives raw data, returns processed)
3. **Cross-cutting concerns** (watchlist, auth) → separate hook
4. **Orchestrator** only imports and combines — no business logic
5. Each extracted hook < 150 lines

### When NOT to Split
- Hook < 200 lines with cohesive logic
- Extraction would create hooks with <5 lines each
