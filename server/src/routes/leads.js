import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'
import prisma from '../lib/prisma.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { intake } from '../lib/leads/intake.js'
import { describe, describeSource, answerList, hotReason, plainMessage } from '../lib/leads/describe.js'
import { formatPhone } from '../lib/leads/phone.js'
import { FORM_TYPES } from '../lib/leads/scoring.js'

const router = Router()

const STATUSES = ['NEW', 'CONTACTED', 'BOOKED', 'WON', 'LOST', 'JUNK']

/* ------------------------------------------------------------------ intake */

const submitLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 12,
  message: { message: 'Too many submissions from this address. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Kept so the four shipped tools keep working unchanged. New forms post to
 * /api/inbound; both run the same `intake`, so there is only one set of rules.
 */
router.post('/', submitLimit, express.urlencoded({ extended: false, limit: '256kb' }), async (req, res) => {
  try {
    const out = await intake(req.body ?? {}, {
      userAgent: req.headers['user-agent'],
      baseUrl: process.env.CLIENT_URL || null,
    })
    if (!out.ok) return res.status(out.status).json({ message: out.message })
    res.status(201).json({ message: 'Saved.', id: out.id })
  } catch (err) {
    console.error('lead intake failed:', err)
    res.status(500).json({ message: 'Something went wrong on our side.' })
  }
})

/* --------------------------------------------------------------- lead HQ
 *
 * Everything below is admin-only. These rows are other people's names,
 * numbers and unpublished books.
 *
 * The literal paths are declared before /:id, or "today" would be read as an
 * id and the first screen of HQ would 404.
 */

router.use(protect, adminOnly)

/** A lead as HQ shows it: the stored row plus the lines a caller reads. */
function present(lead) {
  return {
    ...lead,
    phoneDisplay: formatPhone(lead.phone),
    summary: describe(lead),
    sourceLine: describeSource(lead),
    hotReason: hotReason(lead),
    said: plainMessage(lead),
    waitingMinutes:
      lead.status === 'NEW'
        ? Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / 60000)
        : null,
  }
}

/**
 * The first screen: hot leads nobody has called yet, oldest first, because the
 * one that has been waiting longest is the one about to go cold.
 */
router.get('/today', async (_req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { status: 'NEW', hot: true },
      orderBy: { createdAt: 'asc' },
      take: 100,
    })
    const waiting = await prisma.lead.count({ where: { status: 'NEW' } })
    const dueFollowUps = await prisma.lead.findMany({
      where: { followUpAt: { lte: new Date() }, status: { notIn: ['WON', 'LOST', 'JUNK'] } },
      orderBy: { followUpAt: 'asc' },
      take: 50,
    })
    res.json({
      hot: leads.map(present),
      dueFollowUps: dueFollowUps.map(present),
      waiting,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/counts', async (_req, res) => {
  try {
    const [byStatus, byFormType] = await Promise.all([
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['formType'], _count: { _all: true } }),
    ])
    res.json({
      byStatus: byStatus.map(g => ({ status: g.status, count: g._count._all })),
      byFormType: byFormType
        .map(g => ({
          formType: g.formType,
          label: FORM_TYPES[g.formType]?.label ?? g.formType,
          count: g._count._all,
        }))
        .sort((a, b) => b.count - a.count),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/** Which tools and which channels actually produce calls, not just visits. */
router.get('/insights', async (_req, res) => {
  try {
    const [byTool, byChannel, byCampaign, won] = await Promise.all([
      prisma.lead.groupBy({
        by: ['formType'],
        _count: { _all: true },
        _avg: { score: true },
        where: { status: { not: 'JUNK' } },
      }),
      prisma.lead.groupBy({
        by: ['utmSource'],
        _count: { _all: true },
        where: { status: { not: 'JUNK' } },
      }),
      prisma.lead.groupBy({
        by: ['utmCampaign'],
        _count: { _all: true },
        where: { status: { not: 'JUNK' }, utmCampaign: { not: null } },
      }),
      prisma.lead.groupBy({ by: ['formType'], _count: { _all: true }, where: { status: 'WON' } }),
    ])

    const wonBy = Object.fromEntries(won.map(w => [w.formType, w._count._all]))

    res.json({
      byTool: byTool
        .map(g => ({
          formType: g.formType,
          label: FORM_TYPES[g.formType]?.label ?? g.formType,
          leads: g._count._all,
          avgScore: g._avg.score == null ? null : Math.round(g._avg.score),
          won: wonBy[g.formType] ?? 0,
        }))
        .sort((a, b) => b.leads - a.leads),
      byChannel: byChannel
        .map(g => ({ channel: g.utmSource ?? 'direct', leads: g._count._all }))
        .sort((a, b) => b.leads - a.leads),
      byCampaign: byCampaign
        .map(g => ({ campaign: g.utmCampaign, leads: g._count._all }))
        .sort((a, b) => b.leads - a.leads),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/** The inbox. */
router.get('/', async (req, res) => {
  try {
    const { status, formType, hot, q } = req.query
    const take = Math.min(Number(req.query.take) || 100, 500)
    const skip = Math.max(Number(req.query.skip) || 0, 0)

    const where = {}
    if (status && STATUSES.includes(String(status))) where.status = String(status)
    if (formType) where.formType = String(formType)
    if (hot === 'true') where.hot = true
    if (q) {
      const term = String(q).trim().slice(0, 120)
      where.OR = [
        { name:    { contains: term, mode: 'insensitive' } },
        { email:   { contains: term, mode: 'insensitive' } },
        { phone:   { contains: term } },
        { message: { contains: term, mode: 'insensitive' } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: [{ hot: 'desc' }, { createdAt: 'desc' }],
        take,
        skip,
      }),
      prisma.lead.count({ where }),
    ])
    res.json({ leads: leads.map(present), total, take, skip })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: { events: { orderBy: { createdAt: 'desc' } } },
    })
    if (!lead) return res.status(404).json({ message: 'No such lead.' })
    const { events, ...rest } = lead
    res.json({ ...present(rest), answers: answerList(lead), events })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

/** Record what happened on the call. */
router.patch('/:id', async (req, res) => {
  try {
    const { status, outcome, followUpAt, assignedTo } = req.body ?? {}
    const data = {}

    if (status !== undefined) {
      if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Unknown status.' })
      data.status = status
      // Moving off NEW is what stops the speed-to-lead clock, so the moment
      // is recorded rather than inferred later from the event log.
      if (status !== 'NEW') data.contactedAt = new Date()
    }
    if (outcome !== undefined) data.outcome = outcome ? String(outcome).slice(0, 2000) : null
    if (assignedTo !== undefined) data.assignedTo = assignedTo ? String(assignedTo).slice(0, 200) : null
    if (followUpAt !== undefined) {
      if (followUpAt === null || followUpAt === '') data.followUpAt = null
      else {
        const d = new Date(followUpAt)
        if (Number.isNaN(d.getTime())) return res.status(400).json({ message: 'That is not a date.' })
        data.followUpAt = d
      }
    }

    if (!Object.keys(data).length) return res.status(400).json({ message: 'Nothing to change.' })

    const lead = await prisma.lead.update({ where: { id: req.params.id }, data })
    await prisma.leadEvent.create({
      data: {
        leadId: lead.id,
        kind: 'status',
        actor: req.user?.id ?? 'unknown',
        detail: Object.entries(data)
          .map(([k, v]) => `${k}=${v instanceof Date ? v.toISOString() : v}`)
          .join(', '),
      },
    })
    res.json(present(lead))
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'No such lead.' })
    res.status(500).json({ message: err.message })
  }
})

router.post('/:id/notes', async (req, res) => {
  try {
    const detail = String(req.body?.note ?? '').trim().slice(0, 4000)
    if (!detail) return res.status(400).json({ message: 'An empty note is not a note.' })
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id }, select: { id: true } })
    if (!lead) return res.status(404).json({ message: 'No such lead.' })
    const event = await prisma.leadEvent.create({
      data: { leadId: lead.id, kind: 'note', actor: req.user?.id ?? 'unknown', detail },
    })
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
