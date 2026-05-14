import db from '../db'

export interface WatchlistItem {
  id: number
  code: string
  name: string
  market: string
  note: string | null
  category: string | null
  hold_cost: number | null
  hold_quantity: number | null
  created_at: string
}

export function getWatchlist(): WatchlistItem[] {
  return db.prepare('SELECT * FROM watchlist_items ORDER BY created_at DESC').all() as WatchlistItem[]
}

export function addToWatchlist(
  item: Omit<WatchlistItem, 'id' | 'created_at'>
): WatchlistItem {
  const stmt = db.prepare(
    `INSERT INTO watchlist_items (code, name, market, note, category, hold_cost, hold_quantity)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(code) DO UPDATE SET
       name = excluded.name,
       market = excluded.market,
       note = excluded.note,
       category = excluded.category,
       hold_cost = excluded.hold_cost,
       hold_quantity = excluded.hold_quantity
     RETURNING *`
  )
  return stmt.get(
    item.code, item.name, item.market || '', item.note || null,
    item.category || null, item.hold_cost ?? null, item.hold_quantity ?? null
  ) as WatchlistItem
}

export function removeFromWatchlist(code: string): boolean {
  const result = db.prepare('DELETE FROM watchlist_items WHERE code = ?').run(code)
  return result.changes > 0
}

export function updateWatchlistItem(
  code: string,
  updates: Partial<Pick<WatchlistItem, 'note' | 'category'>>
): WatchlistItem | null {
  const result = db.prepare(
    'UPDATE watchlist_items SET note = ?, category = ? WHERE code = ? RETURNING *'
  ).get(updates.note ?? null, updates.category ?? null, code)
  return result as WatchlistItem | null
}
