import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
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

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }))

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

// DB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/avansaspublishers')
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
  }
}

connectDB()
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app
