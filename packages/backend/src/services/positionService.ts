import db from '../db'

export interface PositionItem {
  id: number
  code: string
  name: string
  market: string
  costPrice: number
  shares: number
  note: string | null
  created_at: string
  updated_at: string
}

export interface PositionSummary {
  positions: PositionItem[]
  totalCost: number
  totalValue: number
  totalProfit: number
  totalProfitPercent: number
}

export function getPositions(): PositionItem[] {
  return db.prepare('SELECT * FROM positions ORDER BY created_at DESC').all() as PositionItem[]
}

export function addPosition(
  item: Omit<PositionItem, 'id' | 'created_at' | 'updated_at'>
): PositionItem {
  // 如果已存在则合并（加权平均成本）
  const existing = db.prepare('SELECT * FROM positions WHERE code = ?').get(item.code) as PositionItem | undefined
  if (existing) {
    const newShares = existing.shares + item.shares
    const newCostPrice =
      (existing.costPrice * existing.shares + item.costPrice * item.shares) / newShares
    const result = db.prepare(
      `UPDATE positions
       SET cost_price = ?, shares = ?, note = ?, updated_at = datetime('now')
       WHERE code = ? RETURNING *`
    ).get(newCostPrice, newShares, item.note || existing.note, item.code)
    return result as PositionItem
  }

  const result = db.prepare(
    `INSERT INTO positions (code, name, market, cost_price, shares, note)
     VALUES (?, ?, ?, ?, ?, ?)
     RETURNING *`
  ).get(item.code, item.name, item.market || '', item.costPrice, item.shares, item.note || null)
  return result as PositionItem
}

export function updatePosition(
  code: string,
  updates: Partial<Pick<PositionItem, 'costPrice' | 'shares' | 'note'>>
): PositionItem | null {
  const result = db.prepare(
    `UPDATE positions
     SET cost_price = ?, shares = ?, note = ?, updated_at = datetime('now')
     WHERE code = ? RETURNING *`
  ).get(updates.costPrice ?? null, updates.shares ?? null, updates.note ?? null, code)
  return result as PositionItem | null
}

export function removePosition(code: string): boolean {
  const result = db.prepare('DELETE FROM positions WHERE code = ?').run(code)
  return result.changes > 0
}

export function calculateSummary(
  positions: PositionItem[],
  currentPrices: Record<string, number>
): PositionSummary {
  let totalCost = 0
  let totalValue = 0
  for (const pos of positions) {
    const cost = pos.costPrice * pos.shares
    const value = (currentPrices[pos.code] || pos.costPrice) * pos.shares
    totalCost += cost
    totalValue += value
  }
  const totalProfit = totalValue - totalCost
  const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0
  return {
    positions,
    totalCost: Math.round(totalCost * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    totalProfitPercent: Math.round(totalProfitPercent * 100) / 100,
  }
}
