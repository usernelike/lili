import { describe, it, expect } from 'vitest'
import { parseTencentResponse, parseCommodityResponse } from './stockService'

function createMockStockResponse(
  prefix: string,
  name: string,
  code: string,
  price: number,
  prevClose: number,
  open: number,
  vol: number,
  high: number,
  low: number,
  amount: number,
  time: string
): string {
  const fields = new Array(46).fill('0')
  fields[0] = '1'
  fields[1] = name
  fields[2] = code
  fields[3] = price.toString()
  fields[4] = prevClose.toString()
  fields[5] = open.toString()
  fields[6] = vol.toString()
  fields[33] = high.toString()
  fields[34] = low.toString()
  fields[37] = amount.toString()
  fields[45] = time
  return `v_${prefix}${code}="${fields.join('~')}"`
}

const mockStockResponse = [
  createMockStockResponse('sh', '贵州茅台', '600519', 1688.0, 1675.5, 1680.0, 12345, 1695.0, 1665.0, 12345678, '15:00:00'),
  createMockStockResponse('sz', '平安银行', '000001', 12.35, 12.12, 12.15, 567890, 12.50, 12.10, 5678901, '15:00:00'),
].join(';\n') + ';'

const mockCommodityResponse = `v_hf_GC="2345.60,-0.35,2346.00,2348.50,2350.00,2340.00,12:30:00,2345.00,2346.00,0,1,1,2026-05-14,伦敦金";
v_hf_CL="78.45,1.20,77.50,77.80,79.00,77.20,12:30:00,78.40,78.50,0,2,4,2026-05-14,纽约原油";`

describe('stockService', () => {
  describe('parseTencentResponse', () => {
    it('should parse stock response correctly', () => {
      const result = parseTencentResponse(mockStockResponse)

      expect(result).toHaveLength(2)

      expect(result[0].code).toBe('600519')
      expect(result[0].name).toBe('贵州茅台')
      expect(result[0].price).toBe(1688.0)
      expect(result[0].prevClose).toBe(1675.5)
      expect(result[0].open).toBe(1680.0)
      expect(result[0].high).toBe(1695.0)
      expect(result[0].low).toBe(1665.0)
      expect(result[0].volume).toBe(12345)
      expect(result[0].amount).toBe(12345678)
      expect(result[0].change).toBeCloseTo(12.5, 2)
      expect(result[0].changePercent).toBeCloseTo(0.75, 2)

      expect(result[1].code).toBe('000001')
      expect(result[1].name).toBe('平安银行')
      expect(result[1].price).toBe(12.35)
    })

    it('should return empty array for empty response', () => {
      const result = parseTencentResponse('')
      expect(result).toHaveLength(0)
    })

    it('should return empty array for invalid response', () => {
      const result = parseTencentResponse('invalid data')
      expect(result).toHaveLength(0)
    })
  })

  describe('parseCommodityResponse', () => {
    it('should parse commodity response correctly', () => {
      const result = parseCommodityResponse(mockCommodityResponse)

      expect(result).toHaveLength(2)

      expect(result[0].code).toBe('hf_GC')
      expect(result[0].name).toBe('COMEX黄金')
      expect(result[0].price).toBe(2345.6)
      expect(result[0].changePercent).toBe(-0.35)
      expect(result[0].open).toBe(2346.0)
      expect(result[0].prevClose).toBe(2348.5)
      expect(result[0].high).toBe(2350.0)
      expect(result[0].low).toBe(2340.0)

      expect(result[1].code).toBe('hf_CL')
      expect(result[1].name).toBe('NYMEX原油')
      expect(result[1].price).toBe(78.45)
      expect(result[1].changePercent).toBe(1.2)
    })

    it('should return empty array for empty response', () => {
      const result = parseCommodityResponse('')
      expect(result).toHaveLength(0)
    })
  })
})
