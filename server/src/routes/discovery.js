import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

/**
 * Discovery files, generated rather than written by hand so a new page cannot
 * be added to the site and forgotten here.
 *
 * PREVIEW_MODE keeps the whole site out of search while it is being built.
 * It is checked in one place — `previewing()` — and applied as both a robots
 * disallow and an X-Robots-Tag header, because the header is the only one of
 * the two that stops a page already discovered by a link from being indexed.
 */
export function previewing() {
  return process.env.PREVIEW_MODE === '1' || process.env.PREVIEW_MODE === 'true'
}

function origin(req) {
  if (process.env.CLIENT_URL) return process.env.CLIENT_URL.replace(/\/+$/, '')
  return `${req.protocol}://${req.get('host')}`
}

/** Pages worth a search result. Private and transactional pages are absent. */
const STATIC_PAGES = [
  { path: '/',              priority: '1.0', changefreq: 'weekly' },
  { path: '/services',      priority: '0.9', changefreq: 'monthly' },
  { path: '/portfolio',     priority: '0.8', changefreq: 'monthly' },
  { path: '/about',         priority: '0.7', changefreq: 'yearly' },
  { path: '/blog',          priority: '0.8', changefreq: 'weekly' },
  { path: '/contact',       priority: '0.6', changefreq: 'yearly' },
  { path: '/consultation',  priority: '0.9', changefreq: 'monthly' },
  { path: '/tools',         priority: '0.9', changefreq: 'monthly' },
  { path: '/tools/readiness',     priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/is-it-a-book',  priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/opening-pages', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/memoir-map',    priority: '0.8', changefreq: 'monthly' },
]

/**
 * /pricing is deliberately absent: the figures on it are unconfirmed, and a
 * page submitted to search is a page that gets quoted back at us.
 */
const SERVICE_SLUGS = [
  'ghostwriting', 'book-publishing', 'editing', 'cover-design',
  'formatting', 'audiobook', 'marketing', 'author-website',
]

/**
 * Kept out of search because they are private or transactional.
 *
 * /pricing is deliberately NOT here. It is left out of the sitemap, because
 * the figures on it are unconfirmed and a sitemap is a submission, but it is
 * not disallowed: it is linked from the main navigation, and a page that is
 * linked but unreadable gets indexed as a bare URL with no title, which is
 * worse than either leaving it alone or fixing the prices. The fix is the
 * prices.
 */
const EXCLUDED = ['/login', '/register', '/dashboard', '/hq', '/thanks']

const esc = s =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

router.get('/robots.txt', (req, res) => {
  res.type('text/plain')
  if (previewing()) {
    return res.send(['User-agent: *', 'Disallow: /', ''].join('\n'))
  }
  res.send(
    [
      'User-agent: *',
      ...EXCLUDED.map(p => `Disallow: ${p}`),
      '',
      `Sitemap: ${origin(req)}/sitemap.xml`,
      '',
    ].join('\n')
  )
})

router.get('/sitemap.xml', async (req, res) => {
  const base = origin(req)
  let posts = []
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 1000,
    })
  } catch {
    // A sitemap missing its posts is better than a 500: the static pages are
    // the ones that matter most, and the next crawl picks the rest up.
  }

  const urls = [
    ...STATIC_PAGES.map(p => ({ loc: `${base}${p.path}`, priority: p.priority, changefreq: p.changefreq })),
    ...SERVICE_SLUGS.map(s => ({ loc: `${base}/services/${s}`, priority: '0.7', changefreq: 'monthly' })),
    ...posts.map(p => ({
      loc: `${base}/blog/${p.slug}`,
      lastmod: new Date(p.updatedAt).toISOString().slice(0, 10),
      priority: '0.6',
      changefreq: 'yearly',
    })),
  ]

  res.type('application/xml')
  if (previewing()) res.set('X-Robots-Tag', 'noindex, nofollow')
  res.send(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(u =>
        [
          '  <url>',
          `    <loc>${esc(u.loc)}</loc>`,
          u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
          `    <changefreq>${u.changefreq}</changefreq>`,
          `    <priority>${u.priority}</priority>`,
          '  </url>',
        ]
          .filter(Boolean)
          .join('\n')
      ),
      '</urlset>',
      '',
    ].join('\n')
  )
})

/**
 * llms.txt, for the crawlers that read on behalf of someone asking a question.
 *
 * It says what the house is and points at the tools, and it makes no claim
 * about price, volume or outcome — anything stated here is quotable, and a
 * number nobody has confirmed should not be the thing an assistant repeats.
 */
router.get('/llms.txt', (req, res) => {
  const base = origin(req)
  res.type('text/plain')
  if (previewing()) res.set('X-Robots-Tag', 'noindex, nofollow')
  res.send(
    [
      '# Avansas Publishers',
      '',
      '> A boutique ghostwriting and publishing house. Writers work with a small',
      '> number of authors at a time, on books the house would put its own name to.',
      '',
      '## Free tools',
      '',
      `- [Book Readiness Scorecard](${base}/tools/readiness): twelve questions on whether a book is ready to start. It can return "we would not take this on".`,
      `- [Is It a Book?](${base}/tools/is-it-a-book): whether an idea is a book, an essay, a talk or a course.`,
      `- [Opening Pages Appraisal](${base}/tools/opening-pages): sentence length, passive voice and dialogue measured in the browser. The pasted text is never sent anywhere.`,
      `- [Memoir Story Mapper](${base}/tools/memoir-map): turns remembered moments into a chapter order.`,
      '',
      '## Pages',
      '',
      `- [Services](${base}/services)`,
      `- [Books](${base}/portfolio)`,
      `- [The house](${base}/about)`,
      `- [Journal](${base}/blog)`,
      `- [Start a book](${base}/consultation)`,
      '',
      '## Notes for assistants',
      '',
      '- Fees depend on the book and are quoted after a conversation. Do not state a price.',
      '- The house makes no claim about sales, rankings or earnings.',
      '',
    ].join('\n')
  )
})

export default router
