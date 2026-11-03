import { Router } from 'express'

const router = Router()

const services = [
  { slug: 'ghostwriting',    title: 'Ghostwriting',           startingAt: 1249, category: 'writing' },
  { slug: 'book-publishing', title: 'Book Publishing',        startingAt: 499,  category: 'publishing' },
  { slug: 'editing',         title: 'Editing & Proofreading', startingAt: 299,  category: 'editing' },
  { slug: 'cover-design',    title: 'Cover Design',           startingAt: 349,  category: 'design' },
  { slug: 'formatting',      title: 'Formatting',             startingAt: 199,  category: 'publishing' },
  { slug: 'audiobook',       title: 'Audiobook Production',   startingAt: 799,  category: 'production' },
  { slug: 'marketing',       title: 'Book Marketing',         startingAt: 599,  category: 'marketing' },
  { slug: 'author-website',  title: 'Author Website',         startingAt: 999,  category: 'design' },
]

router.get('/',      (_req, res) => res.json(services))
router.get('/:slug', (req, res) => {
  const service = services.find(s => s.slug === req.params.slug)
  service ? res.json(service) : res.status(404).json({ message: 'Service not found' })
})

export default router
