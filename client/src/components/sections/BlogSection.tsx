import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'

const posts = [
  {
    slug: 'how-to-write-a-bestselling-book',
    title: 'The 7 Secrets Behind Every Bestselling Book',
    excerpt: 'What separates a book that sells 100 copies from one that sells 100,000? We break down the patterns from our 5,000+ published titles.',
    category: 'Writing Tips',
    readTime: '8 min read',
    color: 'from-orange-600 to-red-700',
  },
  {
    slug: 'ghostwriting-myths-debunked',
    title: 'Ghostwriting Myths That Are Holding You Back',
    excerpt: "Is ghostwriting cheating? Does it mean your work isn't authentic? We tackle the most common misconceptions that stop people from sharing their stories.",
    category: 'Ghostwriting',
    readTime: '6 min read',
    color: 'from-purple-600 to-pink-700',
  },
  {
    slug: 'self-publishing-vs-traditional',
    title: 'Self-Publishing vs Traditional: The Real Numbers in 2026',
    excerpt: 'Updated data on royalties, timelines, creative control, and income. Which path is right for your book?',
    category: 'Publishing',
    readTime: '10 min read',
    color: 'from-blue-600 to-cyan-700',
  },
]

export default function BlogSection() {
  return (
    <section className="section-padding bg-dark-900">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">The Avansas Blog</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Publishing Insights & <br />Author Resources</h2>
          </div>
          <Link to="/blog" className="btn-ghost text-sm flex-shrink-0">
            View all posts <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group card-dark flex flex-col hover:-translate-y-1 transition-all duration-300">
              <div className={`h-40 rounded-xl bg-gradient-to-br ${post.color} mb-4 flex items-center justify-center`}>
                <span className="text-white/20 font-serif text-6xl font-bold">"</span>
              </div>
              <span className="text-xs text-primary-400 font-semibold uppercase tracking-wider mb-2">{post.category}</span>
              <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors leading-tight">{post.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Clock className="w-3.5 h-3.5" /> {post.readTime}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
