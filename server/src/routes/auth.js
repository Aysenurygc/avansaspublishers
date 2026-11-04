import { Router } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'
import { hashPassword, comparePassword, publicUserSelect } from '../lib/user.js'
import { protect } from '../middleware/auth.js'

const router = Router()

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' })
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const user = await prisma.user.create({
      data: { name, email: email.toLowerCase(), password: await hashPassword(password) },
      select: publicUserSelect,
    })
    res.status(201).json({ user, token: signToken(user.id) })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user || !(await comparePassword(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' })

    const { password: _pw, resetToken: _rt, resetTokenExp: _rte, ...safeUser } = user
    res.json({ user: safeUser, token: signToken(user.id) })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/me', protect, (req, res) => res.json(req.user))

export default router
