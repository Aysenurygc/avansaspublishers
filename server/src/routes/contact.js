import { Router } from 'express'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ message: 'Required fields missing' })
    // TODO: integrate Nodemailer to send email to hello@avansaspublishers.com
    console.log('Contact form submission:', { name, email, subject, message })
    res.json({ message: 'Message received. We\'ll respond within 24 hours.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
