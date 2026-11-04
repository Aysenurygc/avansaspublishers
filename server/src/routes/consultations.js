import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, genre, budget, message } = req.body
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' })

    const consultation = await prisma.consultation.create({
      data: { name, email, phone, service, genre, budget, message },
    })
    res.status(201).json({ message: 'Consultation booked!', consultation })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/', protect, adminOnly, async (_req, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    })
    res.json(consultations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, scheduledAt, assignedToId } = req.body
    const consultation = await prisma.consultation.update({
      where: { id: req.params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(assignedToId !== undefined && { assignedToId }),
      },
    })
    res.json(consultation)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
