import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import prisma from '../lib/prisma.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

/** Public endpoint on a marketing page, so it gets a tighter limit than the API default. */
const submitLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 12,
  message: { message: 'Too many submissions from this address. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

/** The tools allowed to write a lead. An unknown source is rejected rather than stored. */
const SOURCES = new Set([
  'book-readiness-scorecard',
  'is-it-a-book',
  'opening-pages-appraisal',
  'memoir-story-mapper',
  'scope-cost-estimator',
])

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

router.post('/', submitLimit, async (req, res) => {
  try {
    const { email, name, source, result, consent } = req.body

    if (!email || !EMAIL.test(String(email)))
      return res.status(400).json({ message: 'A valid email address is required.' })
    if (!SOURCES.has(source))
      return res.status(400).json({ message: 'Unknown source.' })

    const lead = await prisma.lead.create({
      data: {
        email: String(email).toLowerCase().trim(),
        name: name ? String(name).trim().slice(0, 200) : null,
        source,
        result: result ?? undefined,
        consent: consent === true,
        userAgent: req.headers['user-agent']?.slice(0, 500) ?? null,
      },
      select: { id: true, createdAt: true },
    })

    res.status(201).json({ message: 'Saved.', id: lead.id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { source } = req.query
    const leads = await prisma.lead.findMany({
      where: source ? { source: String(source) } : {},
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    res.json(leads)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/counts', protect, adminOnly, async (_req, res) => {
  try {
    const grouped = await prisma.lead.groupBy({ by: ['source'], _count: { _all: true } })
    res.json(grouped.map(g => ({ source: g.source, count: g._count._all })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
