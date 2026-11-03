import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const books = [
  { title: 'The Leadership Code',    author: 'James Richardson', genre: 'Business',     color: 'from-orange-600 to-red-700' },
  { title: 'Digital Disruption',     author: 'Sarah Chen',       genre: 'Technology',   color: 'from-blue-600 to-violet-700' },
  { title: 'Healing Beyond Medicine',author: 'Dr. Marcus Webb',  genre: 'Health',       color: 'from-green-600 to-teal-700' },
  { title: 'Unlocking Your Potential',author: 'Lisa Fontaine',   genre: 'Self-Help',    color: 'from-purple-600 to-pink-700' },
  { title: 'Beyond the Front Line',  author: 'Robert Tanner',    genre: 'Memoir',       color: 'from-amber-600 to-orange-700' },
  { title: 'The Profitable Mind',    author: 'Amanda Kozlowski', genre: 'Business',     color: 'from-cyan-600 to-blue-700' },
]

export default function PortfolioSection() {
  return (
    <section className="section-padding bg-dark-900">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">Our Work</p>
          <h2 className="section-title mb-4">Books That Define Careers <br />and Change Lives</h2>
          <p className="section-subtitle mx-auto">
            A selection from our portfolio of 5,000+ published titles across every genre.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {books.map(book => (
            <div key={book.title} className="group cursor-pointer">
              <div className={`aspect-[2/3] rounded-xl bg-gradient-to-b ${book.color} flex items-end p-3 shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300`}>
                <div>
                  <div className="text-xs text-white/60 uppercase tracking-wider mb-1">{book.genre}</div>
                  <div className="text-sm font-serif font-bold text-white leading-tight">{book.title}</div>
                  <div className="text-xs text-white/70 mt-1">{book.author}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/portfolio" className="btn-outline inline-flex items-center gap-2">
            View Full Portfolio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
