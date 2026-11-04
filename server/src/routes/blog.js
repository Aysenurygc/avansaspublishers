import { Router } from 'express'
import slugify from 'slugify'
import prisma from '../lib/prisma.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true, category: true,
        tags: true, coverImage: true, readTime: true, publishedAt: true, views: true,
        author: { select: { id: true, name: true, avatar: true } },
      },
    })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: req.params.slug, published: true },
      include: { author: { select: { id: true, name: true, avatar: true, bio: true } } },
    })
    if (!post) return res.status(404).json({ message: 'Post not found' })

    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })
    res.json({ ...post, views: post.views + 1 })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, content, slug, published, ...rest } = req.body
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' })

    const post = await prisma.blogPost.create({
      data: {
        ...rest,
        title,
        content,
        slug: slug || slugify(title, { lower: true, strict: true }),
        published: Boolean(published),
        publishedAt: published ? new Date() : null,
        authorId: req.user.id,
      },
    })
    res.status(201).json(post)
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ message: 'A post with that slug already exists' })
    res.status(400).json({ message: err.message })
  }
})

export default router
