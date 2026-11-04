import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'

export default function BlogPost() {
  const { slug: _slug } = useParams()

  return (
    <div className="pt-24">
      <article className="section-padding">
        <div className="container-max max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="h-64 rounded-2xl bg-gradient-to-br from-orange-600 to-red-700 mb-8" />

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="text-primary-400 font-semibold uppercase text-xs tracking-wider">Writing Tips</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> November 3, 2026</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 8 min read</span>
          </div>

          <h1 className="text-4xl font-serif font-bold text-white mb-6 leading-tight">
            The 7 Secrets Behind Every Bestselling Book
          </h1>

          <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-6">
            <p>After publishing over 5,000 books across every genre, we've identified the patterns that separate breakout bestsellers from books that quietly fade into obscurity. The differences aren't always what you'd expect.</p>

            <h2 className="text-2xl font-serif font-bold text-white">1. The Title Does Half the Work</h2>
            <p>The best-selling business books of the last decade share a formula: a bold claim + a specific mechanism. <em>Atomic Habits</em>. <em>The 4-Hour Workweek</em>. <em>Deep Work</em>. Readers buy the promise before they read a single word.</p>

            <h2 className="text-2xl font-serif font-bold text-white">2. The First Chapter Is a Sales Page</h2>
            <p>Your first chapter must answer one question: <strong>why does this reader need this book right now?</strong> Every bestseller opens by articulating a pain point the reader already has and positioning the book as the solution.</p>

            <h2 className="text-2xl font-serif font-bold text-white">3. Structure Is More Important Than Prose</h2>
            <p>Readers forgive imperfect sentences. They don't forgive a book that's hard to follow. The clearest path from problem to solution wins every time.</p>
          </div>

          <div className="border-t border-dark-600 mt-12 pt-8">
            <Link to="/consultation" className="btn-primary">
              Ready to Write Your Book? Book a Free Consultation
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
