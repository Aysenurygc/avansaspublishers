import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import prisma from './lib/prisma.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

import authRoutes       from './routes/auth.js'
import projectRoutes    from './routes/projects.js'
import serviceRoutes    from './routes/services.js'
import consultationRoutes from './routes/consultations.js'
import blogRoutes       from './routes/blog.js'
import contactRoutes    from './routes/contact.js'
import orderRoutes      from './routes/orders.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// Railway terminates TLS at its edge proxy, so req.ip must come from
// X-Forwarded-For or express-rate-limit rejects every request.
app.set('trust proxy', 1)

// Security & logging
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' })
app.use('/api/', limiter)

// Routes
app.use('/api/auth',          authRoutes)
app.use('/api/projects',      projectRoutes)
app.use('/api/services',      serviceRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/blog',          blogRoutes)
app.use('/api/contact',       contactRoutes)
app.use('/api/orders',        orderRoutes)

// Health check — reports database connectivity alongside process health
app.get('/api/health', async (_req, res) => {
  let database = 'disconnected'
  try {
    await prisma.$queryRaw`SELECT 1`
    database = 'connected'
  } catch { /* leave as disconnected */ }
  res.json({ status: 'ok', database, timestamp: new Date() })
})

// Serve React frontend in production
const clientDist = join(__dirname, '../../client/dist')
if (existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')))
}

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
})

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

prisma.$connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('PostgreSQL connection error:', err.message))

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`)
  server.close()
  await prisma.$disconnect()
  process.exit(0)
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))

export default app
