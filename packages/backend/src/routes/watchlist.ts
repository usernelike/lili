import { Router } from 'express'
import db from '../db'
import { createSuccessResponse, createErrorResponse } from '@platform/shared'

const router: ReturnType<typeof Router> = Router()

router.get('/', (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM watchlist_items ORDER BY created_at DESC').all()
    res.json(createSuccessResponse(rows))
  } catch (error) {
    console.error('GET /watchlist error:', error)
    res.status(500).json(createErrorResponse('获取自选股失败'))
  }
})

router.post('/', (req, res) => {
  try {
    const { code, name, market, note, category, hold_cost, hold_quantity } = req.body
    if (!code || !name) {
      res.status(400).json(createErrorResponse('缺少 code 或 name', 400))
      return
    }
    const stmt = db.prepare(
      `INSERT INTO watchlist_items (code, name, market, note, category, hold_cost, hold_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(code) DO UPDATE SET
         name = excluded.name,
         market = excluded.market,
         note = excluded.note,
         category = excluded.category,
         hold_cost = excluded.hold_cost,
         hold_quantity = excluded.hold_quantity`
    )
    const result = stmt.run(code, name, market || '', note || null, category || null, hold_cost ?? null, hold_quantity ?? null)
    res.json(createSuccessResponse({ id: result.lastInsertRowid || code }))
  } catch (error) {
    console.error('POST /watchlist error:', error)
    res.status(500).json(createErrorResponse('添加自选股失败'))
  }
})

router.patch('/:code', (req, res) => {
  try {
    const { code } = req.params
    const { note, category } = req.body
    const stmt = db.prepare(
      'UPDATE watchlist_items SET note = ?, category = ? WHERE code = ? RETURNING *'
    )
    const result = stmt.get(note || null, category || null, code)
    if (!result) {
      res.status(404).json(createErrorResponse('自选股不存在', 404))
      return
    }
    res.json(createSuccessResponse(result))
  } catch (error) {
    console.error('PATCH /watchlist error:', error)
    res.status(500).json(createErrorResponse('更新自选股失败'))
  }
})

router.delete('/:code', (req, res) => {
  try {
    const { code } = req.params
    const stmt = db.prepare('DELETE FROM watchlist_items WHERE code = ?')
    const result = stmt.run(code)
    if (result.changes === 0) {
      res.status(404).json(createErrorResponse('自选股不存在', 404))
      return
    }
    res.json(createSuccessResponse({ removed: true }))
  } catch (error) {
    console.error('DELETE /watchlist error:', error)
    res.status(500).json(createErrorResponse('删除自选股失败'))
  }
})

export default router
