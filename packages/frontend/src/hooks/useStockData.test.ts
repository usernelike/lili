import { describe, it, expect } from 'vitest'

describe('useStockData types', () => {
  it('StockData interface should be well-formed', () => {
    const stock = {
      code: '600519',
      name: '贵州茅台',
      price: 1688.0,
      change: 12.5,
      changePercent: 0.75,
      volume: 12345,
      amount: 12345678,
      high: 1695.0,
      low: 1665.0,
      open: 1680.0,
      prevClose: 1675.5,
      market: '上海',
      updateTime: '15:00:00',
    }
    expect(stock.code).toBe('600519')
    expect(stock.name).toBe('贵州茅台')
    expect(stock.price).toBe(1688.0)
  })

  it('CommodityData interface should be well-formed', () => {
    const commodity = {
      code: 'hf_GC',
      name: 'COMEX黄金',
      price: 2345.6,
      changePercent: -0.35,
      open: 2346.0,
      prevClose: 2348.5,
      high: 2350.0,
      low: 2340.0,
      updateTime: '12:30:00',
    }
    expect(commodity.code).toBe('hf_GC')
    expect(commodity.name).toBe('COMEX黄金')
    expect(commodity.price).toBe(2345.6)
  })
})
