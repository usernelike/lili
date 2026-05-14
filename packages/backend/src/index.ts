import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import routes from './routes'
import { initDatabase } from './db'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// Initialize SQLite database
initDatabase()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve frontend static files in production
const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath))

// SPA fallback: serve index.html for all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
