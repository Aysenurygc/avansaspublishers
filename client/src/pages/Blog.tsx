import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'

const posts = [
  { slug: 'how-to-write-a-bestselling-book',     title: 'The 7 Secrets Behind Every Bestselling Book',           category: 'Writing Tips', readTime: '8 min', excerpt: "What separates a book that sells 100 copies from one that sells 100,000?", color: 'from-orange-600 to-red-700' },
  { slug: 'ghostwriting-myths-debunked',          title: 'Ghostwriting Myths That Are Holding You Back',          category: 'Ghostwriting', readTime: '6 min', excerpt: "Is ghostwriting cheating? We tackle the most common misconceptions.", color: 'from-purple-600 to-pink-700' },
  { slug: 'self-publishing-vs-traditional',       title: 'Self-Publishing vs Traditional: The Real Numbers in 2026', category: 'Publishing', readTime: '10 min', excerpt: 'Updated data on royalties, timelines, and income.', color: 'from-blue-600 to-cyan-700' },
  { slug: 'book-cover-design-secrets',            title: '10 Book Cover Design Secrets That Sell',                 category: 'Design',       readTime: '7 min', excerpt: "Your cover is your #1 marketing tool. Here's what actually works.", color: 'from-amber-600 to-orange-700' },
  { slug: 'how-to-find-a-ghostwriter',            title: 'How to Find (and Hire) the Perfect Ghostwriter',        category: 'Ghostwriting', readTime: '9 min', excerpt: "A step-by-step guide to vetting, hiring, and working with a ghostwriter.", color: 'from-green-600 to-teal-700' },
  { slug: 'amazon-self-publishing-guide',         title: 'The Ultimate Amazon KDP Guide for 2026',                category: 'Publishing',   readTime: '12 min', excerpt: "Everything you need to know about self-publishing on Amazon.", color: 'from-rose-600 to-red-700' },
]

export default function Blog() {
  return (
    <div className="pt-24">
      <section className="section-padding bg-dark-800 border-b border-dark-600">
        <div className="container-max text-center">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">The Avansas Blog</p>
          <h1 className="section-title mb-4">Publishing Insights for Ambitious Authors</h1>
          <p className="section-subtitle mx-auto">Expert advice on writing, publishing, marketing, and building your author brand.</p>
        </div>
      </section>

      <section className="section-padding bg-dark-900">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group card-dark flex flex-col hover:-translate-y-1 transition-all duration-300">
                <div className={`h-44 rounded-xl bg-gradient-to-br ${post.color} mb-4`} />
                <span className="text-xs text-primary-400 font-semibold uppercase tracking-wider mb-2">{post.category}</span>
                <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors leading-tight">{post.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime} read</span>
                  <span className="flex items-center gap-1 text-primary-400">Read more <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
