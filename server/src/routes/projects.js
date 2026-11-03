import { Router } from 'express'
import Project from '../models/Project.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { client: req.user._id }
    const projects = await Project.find(query).populate('client', 'name email').populate('team', 'name email role').sort('-updatedAt')
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('client', 'name email').populate('team', 'name email role').populate('messages.sender', 'name avatar')
    if (!project) return res.status(404).json({ message: 'Project not found' })
    const isOwner = project.client._id.toString() === req.user._id.toString()
    const isTeam  = project.team.some(m => m._id.toString() === req.user._id.toString())
    if (!isOwner && !isTeam && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.patch('/:id/progress', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { progress: req.body.progress, status: req.body.status }, { new: true })
    res.json(project)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/:id/messages', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    project.messages.push({ sender: req.user._id, content: req.body.content })
    await project.save()
    res.json(project)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
