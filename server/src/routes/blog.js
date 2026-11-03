import { Router } from 'express'
import BlogPost from '../models/BlogPost.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).select('-content').sort('-publishedAt')
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true }).populate('author', 'name avatar')
    if (!post) return res.status(404).json({ message: 'Post not found' })
    post.views += 1
    await post.save()
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const post = await BlogPost.create({ ...req.body, author: req.user._id })
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
