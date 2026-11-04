import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { publicUserSelect } from '../lib/user.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

const clientSelect = { select: { id: true, name: true, email: true } }
const teamSelect   = { select: { user: { select: { id: true, name: true, email: true, role: true } } } }

router.get('/', protect, async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN'
      ? {}
      : { OR: [{ clientId: req.user.id }, { team: { some: { userId: req.user.id } } }] }

    const projects = await prisma.project.findMany({
      where,
      include: { client: clientSelect, team: teamSelect },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        client: clientSelect,
        team: teamSelect,
        milestones: { orderBy: { createdAt: 'asc' } },
        files: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true, avatar: true } } },
        },
      },
    })
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const isOwner = project.clientId === req.user.id
    const isTeam  = project.team.some(m => m.user.id === req.user.id)
    if (!isOwner && !isTeam && req.user.role !== 'ADMIN')
      return res.status(403).json({ message: 'Access denied' })

    res.json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { teamIds = [], milestones = [], ...data } = req.body
    const project = await prisma.project.create({
      data: {
        ...data,
        team: { create: teamIds.map(userId => ({ userId })) },
        milestones: { create: milestones },
      },
      include: { client: clientSelect, team: teamSelect, milestones: true },
    })
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.patch('/:id/progress', protect, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { team: { select: { userId: true } } },
    })
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const isTeam = project.team.some(m => m.userId === req.user.id)
    if (!isTeam && req.user.role !== 'ADMIN')
      return res.status(403).json({ message: 'Only team members can update progress' })

    const { progress, status } = req.body
    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(progress !== undefined && { progress: Math.max(0, Math.min(100, Number(progress))) }),
        ...(status !== undefined && { status }),
      },
    })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { content, files = [] } = req.body
    if (!content?.trim()) return res.status(400).json({ message: 'Message content is required' })

    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { team: { select: { userId: true } } },
    })
    if (!project) return res.status(404).json({ message: 'Project not found' })

    const isOwner = project.clientId === req.user.id
    const isTeam  = project.team.some(m => m.userId === req.user.id)
    if (!isOwner && !isTeam && req.user.role !== 'ADMIN')
      return res.status(403).json({ message: 'Access denied' })

    const message = await prisma.message.create({
      data: { projectId: req.params.id, senderId: req.user.id, content, files },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    })
    res.status(201).json(message)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
