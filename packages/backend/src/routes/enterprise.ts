import { Router } from 'express'
import { createSuccessResponse, createErrorResponse } from '@platform/shared'

const router: ReturnType<typeof Router> = Router()

router.get('/search', (req, res) => {
  const { keyword } = req.query as { keyword?: string }

  res.json(createSuccessResponse({
    list: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    _notice: keyword
      ? `搜索关键词"${keyword}"暂未接入真实数据源。请在 .env 中配置 TIANYANCHA_TOKEN 后启用天眼查API。`
      : '企业查询功能需要天眼查API Token。请在 .env 中配置 TIANYANCHA_TOKEN。',
    _availablePlatforms: [
      { name: '天眼查', url: 'https://www.tianyancha.com' },
      { name: '爱企查', url: 'https://aiqicha.baidu.com' },
      { name: '企查查', url: 'https://www.qcc.com' },
    ],
  }))
})

router.get('/:id', (req, res) => {
  res.status(404).json(createErrorResponse(
    '企业详情查询需要配置天眼查API Token。请在 .env 中设置 TIANYANCHA_TOKEN。',
    404
  ))
})

export default router
