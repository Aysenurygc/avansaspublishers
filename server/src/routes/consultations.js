import { Router } from 'express'
import Consultation from '../models/Consultation.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const consultation = await Consultation.create(req.body)
    res.status(201).json({ message: 'Consultation booked!', consultation })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const consultations = await Consultation.find().sort('-createdAt')
    res.json(consultations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const c = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(c)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
