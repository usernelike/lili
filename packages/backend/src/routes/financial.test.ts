import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import financialRoutes from './financial'

const app = express()
app.use('/api/financial', financialRoutes)

describe('Financial Routes', () => {
  it('GET /api/financial/stocks should return stock list', async () => {
    const res = await request(app).get('/api/financial/stocks')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('list')
    expect(res.body.data).toHaveProperty('total')
  })

  it('GET /api/financial/indices should return market indices', async () => {
    const res = await request(app).get('/api/financial/indices')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /api/financial/commodities should return commodities', async () => {
    const res = await request(app).get('/api/financial/commodities')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /api/financial/stocks/:code should return single stock', async () => {
    const res = await request(app).get('/api/financial/stocks/600519')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('code')
  })
})
