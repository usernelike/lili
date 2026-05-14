import { Router } from 'express'
import db from '../db'
import { createSuccessResponse, createErrorResponse } from '@platform/shared'

const router: ReturnType<typeof Router> = Router()

router.get('/favorites', (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM interview_favorites ORDER BY created_at DESC').all()
    res.json(createSuccessResponse(rows))
  } catch (error) {
    console.error('GET /interview/favorites error:', error)
    res.status(500).json(createErrorResponse('获取收藏失败'))
  }
})

router.post('/favorites', (req, res) => {
  try {
    const { item_id, question, category, note } = req.body
    if (!item_id || !question || !category) {
      res.status(400).json(createErrorResponse('缺少必要参数', 400))
      return
    }
    const stmt = db.prepare(
      'INSERT INTO interview_favorites (item_id, question, category, note) VALUES (?, ?, ?, ?)'
    )
    const result = stmt.run(item_id, question, category, note || null)
    res.json(createSuccessResponse({ id: result.lastInsertRowid }))
  } catch (error) {
    console.error('POST /interview/favorites error:', error)
    res.status(500).json(createErrorResponse('添加收藏失败'))
  }
})

router.delete('/favorites/:id', (req, res) => {
  try {
    const { id } = req.params
    const stmt = db.prepare('DELETE FROM interview_favorites WHERE id = ?')
    const result = stmt.run(id)
    if (result.changes === 0) {
      res.status(404).json(createErrorResponse('收藏不存在', 404))
      return
    }
    res.json(createSuccessResponse({ removed: true }))
  } catch (error) {
    console.error('DELETE /interview/favorites error:', error)
    res.status(500).json(createErrorResponse('删除收藏失败'))
  }
})

export default router
