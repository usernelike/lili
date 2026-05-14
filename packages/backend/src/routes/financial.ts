import { Router } from 'express'
import { createSuccessResponse, createErrorResponse } from '@platform/shared'
import {
  getRealTimeQuotes,
  getMarketIndices,
  getCommodities,
  getStockDetail,
} from '../services/stockService'
import { calculateIndicators, getMinuteData } from '../services/technicalService'
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} from '../services/watchlistService'
import {
  getPositions,
  addPosition,
  updatePosition,
  removePosition,
  calculateSummary,
} from '../services/positionService'
import { queryLiliStock } from '../services/liliDatasourceService'

const router: ReturnType<typeof Router> = Router()

// ========== 行情数据 ==========

router.get('/stocks', async (_req, res) => {
  try {
    const stocks = await getRealTimeQuotes()
    res.json(createSuccessResponse({
      list: stocks,
      total: stocks.length,
      page: 1,
      pageSize: stocks.length,
      totalPages: 1,
    }))
  } catch (error) {
    console.error('GET /stocks error:', error)
    res.status(500).json(createErrorResponse('获取股票数据失败，请稍后重试'))
  }
})

router.get('/stocks/:code', async (req, res) => {
  try {
    const { code } = req.params
    const prefix = code.startsWith('6') ? 'sh' : 'sz'
    const stocks = await getRealTimeQuotes([`${prefix}${code}`])
    if (stocks.length === 0) {
      res.status(404).json(createErrorResponse('股票不存在', 404))
      return
    }
    res.json(createSuccessResponse(stocks[0]))
  } catch (error) {
    console.error('GET /stocks/:code error:', error)
    res.status(500).json(createErrorResponse('获取股票数据失败'))
  }
})

// 股票详情（含扩展字段+K线）
router.get('/stocks/:code/detail', async (req, res) => {
  try {
    const { code } = req.params
    const detail = await getStockDetail(code)
    if (!detail) {
      res.status(404).json(createErrorResponse('股票不存在或数据获取失败', 404))
      return
    }
    res.json(createSuccessResponse(detail))
  } catch (error) {
    console.error('GET /stocks/:code/detail error:', error)
    res.status(500).json(createErrorResponse('获取股票详情失败'))
  }
})

// 技术指标
router.get('/stocks/:code/indicators', async (req, res) => {
  try {
    const { code } = req.params
    const detail = await getStockDetail(code)
    if (!detail || !detail.kline || detail.kline.length < 60) {
      res.status(400).json(createErrorResponse('K线数据不足，无法计算技术指标', 400))
      return
    }
    const indicators = calculateIndicators(detail.kline)
    if (!indicators) {
      res.status(400).json(createErrorResponse('技术指标计算失败', 400))
      return
    }
    res.json(createSuccessResponse(indicators))
  } catch (error) {
    console.error('GET /stocks/:code/indicators error:', error)
    res.status(500).json(createErrorResponse('计算技术指标失败'))
  }
})

// 分钟K线
router.get('/stocks/:code/minute', async (req, res) => {
  try {
    const { code } = req.params
    const data = await getMinuteData(code)
    res.json(createSuccessResponse(data))
  } catch (error) {
    console.error('GET /stocks/:code/minute error:', error)
    res.status(500).json(createErrorResponse('获取分钟数据失败'))
  }
})

router.get('/indices', async (_req, res) => {
  try {
    const indices = await getMarketIndices()
    res.json(createSuccessResponse(indices))
  } catch (error) {
    console.error('GET /indices error:', error)
    res.status(500).json(createErrorResponse('获取指数数据失败'))
  }
})

router.get('/commodities', async (_req, res) => {
  try {
    const commodities = await getCommodities()
    res.json(createSuccessResponse(commodities))
  } catch (error) {
    console.error('GET /commodities error:', error)
    res.status(500).json(createErrorResponse('获取大宗商品数据失败'))
  }
})

// ========== 自选股 ==========

router.get('/watchlist', (_req, res) => {
  try {
    const items = getWatchlist()
    res.json(createSuccessResponse(items))
  } catch (error) {
    console.error('GET /watchlist error:', error)
    res.status(500).json(createErrorResponse('获取自选股失败'))
  }
})

router.post('/watchlist', (req, res) => {
  try {
    const { code, name, market, note, category } = req.body
    if (!code || !name) {
      res.status(400).json(createErrorResponse('缺少 code 或 name 参数', 400))
      return
    }
    const item = addToWatchlist({ code, name, market: market || '', note, category, hold_cost: null, hold_quantity: null })
    res.json(createSuccessResponse(item))
  } catch (error) {
    console.error('POST /watchlist error:', error)
    res.status(500).json(createErrorResponse('添加自选股失败'))
  }
})

router.patch('/watchlist/:code', (req, res) => {
  try {
    const { code } = req.params
    const { note, category } = req.body
    const item = updateWatchlistItem(code, { note, category })
    if (!item) {
      res.status(404).json(createErrorResponse('自选股不存在', 404))
      return
    }
    res.json(createSuccessResponse(item))
  } catch (error) {
    console.error('PATCH /watchlist/:code error:', error)
    res.status(500).json(createErrorResponse('更新自选股失败'))
  }
})

router.delete('/watchlist/:code', (req, res) => {
  try {
    const { code } = req.params
    const removed = removeFromWatchlist(code)
    if (!removed) {
      res.status(404).json(createErrorResponse('自选股不存在', 404))
      return
    }
    res.json(createSuccessResponse({ removed: true }))
  } catch (error) {
    console.error('DELETE /watchlist/:code error:', error)
    res.status(500).json(createErrorResponse('删除自选股失败'))
  }
})

// ========== 持仓管理 ==========

router.get('/positions', (_req, res) => {
  try {
    const items = getPositions()
    res.json(createSuccessResponse(items))
  } catch (error) {
    console.error('GET /positions error:', error)
    res.status(500).json(createErrorResponse('获取持仓失败'))
  }
})

router.post('/positions', (req, res) => {
  try {
    const { code, name, market, costPrice, shares, note } = req.body
    if (!code || !name || costPrice == null || shares == null) {
      res.status(400).json(createErrorResponse('缺少必要参数', 400))
      return
    }
    const item = addPosition({ code, name, market: market || '', costPrice, shares, note })
    res.json(createSuccessResponse(item))
  } catch (error) {
    console.error('POST /positions error:', error)
    res.status(500).json(createErrorResponse('添加持仓失败'))
  }
})

router.patch('/positions/:code', (req, res) => {
  try {
    const { code } = req.params
    const { costPrice, shares, note } = req.body
    const item = updatePosition(code, { costPrice, shares, note })
    if (!item) {
      res.status(404).json(createErrorResponse('持仓不存在', 404))
      return
    }
    res.json(createSuccessResponse(item))
  } catch (error) {
    console.error('PATCH /positions/:code error:', error)
    res.status(500).json(createErrorResponse('更新持仓失败'))
  }
})

router.delete('/positions/:code', (req, res) => {
  try {
    const { code } = req.params
    const removed = removePosition(code)
    if (!removed) {
      res.status(404).json(createErrorResponse('持仓不存在', 404))
      return
    }
    res.json(createSuccessResponse({ removed: true }))
  } catch (error) {
    console.error('DELETE /positions/:code error:', error)
    res.status(500).json(createErrorResponse('删除持仓失败'))
  }
})

// 持仓盈亏汇总
router.get('/positions/summary', async (_req, res) => {
  try {
    const positions = getPositions()
    if (positions.length === 0) {
      res.json(createSuccessResponse({
        positions: [],
        totalCost: 0,
        totalValue: 0,
        totalProfit: 0,
        totalProfitPercent: 0,
      }))
      return
    }

    const codes = positions.map((p) => {
      const prefix = p.code.startsWith('6') ? 'sh' : 'sz'
      return `${prefix}${p.code}`
    })

    const quotes = await getRealTimeQuotes(codes)
    const priceMap: Record<string, number> = {}
    for (const q of quotes) {
      priceMap[q.code] = q.price
    }

    const summary = calculateSummary(positions, priceMap)
    res.json(createSuccessResponse(summary))
  } catch (error) {
    console.error('GET /positions/summary error:', error)
    res.status(500).json(createErrorResponse('计算持仓盈亏失败'))
  }
})

// ========== lili 数据源 ==========

router.post('/lili/query', async (req, res) => {
  try {
    const { ticker, type, time } = req.body
    if (!ticker) {
      res.status(400).json(createErrorResponse('缺少 ticker 参数', 400))
      return
    }
    const result = await queryLiliStock({ ticker, type, time })
    if (!result.success) {
      res.status(400).json(createErrorResponse(result.error || '查询失败', 400))
      return
    }
    res.json(createSuccessResponse(result))
  } catch (error) {
    console.error('POST /lili/query error:', error)
    const msg = error instanceof Error ? error.message : 'lili 数据源查询失败'
    res.status(500).json(createErrorResponse(msg))
  }
})

export default router
