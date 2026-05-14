import { Router } from 'express'
import db from '../db'
import { createSuccessResponse, createErrorResponse } from '@platform/shared'

const router: ReturnType<typeof Router> = Router()

router.get('/', (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM positions ORDER BY created_at DESC').all()
    res.json(createSuccessResponse(rows))
  } catch (error) {
    console.error('GET /positions error:', error)
    res.status(500).json(createErrorResponse('获取持仓失败'))
  }
})

router.post('/', (req, res) => {
  try {
    const { code, name, market, cost_price, shares, note } = req.body
    if (!code || !name || cost_price == null || shares == null) {
      res.status(400).json(createErrorResponse('缺少必要参数', 400))
      return
    }
    const stmt = db.prepare(
      `INSERT INTO positions (code, name, market, cost_price, shares, note)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(code) DO UPDATE SET
         cost_price = excluded.cost_price,
         shares = excluded.shares,
         note = excluded.note,
         updated_at = datetime('now')`
    )
    const result = stmt.run(code, name, market || '', cost_price, shares, note || null)
    res.json(createSuccessResponse({ id: result.lastInsertRowid || code }))
  } catch (error) {
    console.error('POST /positions error:', error)
    res.status(500).json(createErrorResponse('添加持仓失败'))
  }
})

router.patch('/:code', (req, res) => {
  try {
    const { code } = req.params
    const { cost_price, shares, note } = req.body
    const stmt = db.prepare(
      `UPDATE positions
       SET cost_price = ?, shares = ?, note = ?, updated_at = datetime('now')
       WHERE code = ? RETURNING *`
    )
    const result = stmt.get(cost_price, shares, note || null, code)
    if (!result) {
      res.status(404).json(createErrorResponse('持仓不存在', 404))
      return
    }
    res.json(createSuccessResponse(result))
  } catch (error) {
    console.error('PATCH /positions error:', error)
    res.status(500).json(createErrorResponse('更新持仓失败'))
  }
})

router.delete('/:code', (req, res) => {
  try {
    const { code } = req.params
    const stmt = db.prepare('DELETE FROM positions WHERE code = ?')
    const result = stmt.run(code)
    if (result.changes === 0) {
      res.status(404).json(createErrorResponse('持仓不存在', 404))
      return
    }
    res.json(createSuccessResponse({ removed: true }))
  } catch (error) {
    console.error('DELETE /positions error:', error)
    res.status(500).json(createErrorResponse('删除持仓失败'))
  }
})

export default router
