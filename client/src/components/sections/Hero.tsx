import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, BookOpen, Award } from 'lucide-react'

const badges = [
  { icon: Star,     text: '4.9/5 Rating' },
  { icon: Users,    text: '2,400+ Authors' },
  { icon: BookOpen, text: '5,000+ Books' },
  { icon: Award,    text: '#1 Ghostwriting' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(202,93,30,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(180,130,11,0.08),transparent_50%)]" />

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="container-max section-padding relative z-10 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-900/40 border border-primary-700/50 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-sm text-primary-300 font-medium">World's Premier Ghostwriting Agency</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Your Story Deserves to{' '}
            <span className="gradient-text">Become a Bestseller</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            From blank page to published masterpiece — Avansas Publishers delivers world-class ghostwriting, editing, design, and marketing. You own 100% of your work.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/consultation" className="btn-primary text-base py-4 px-10">
              Start Your Book Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/portfolio" className="btn-outline text-base py-4 px-10">
              View Our Work
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {badges.map(b => (
              <div key={b.text} className="flex items-center gap-2 bg-dark-800/60 border border-dark-600 rounded-full px-4 py-2">
                <b.icon className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-gray-300 font-medium">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured logos */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">Our Authors Have Been Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale">
            {['The New York Times', 'Forbes', 'USA Today', 'Wall Street Journal', 'Washington Post'].map(pub => (
              <span key={pub} className="text-lg font-serif font-bold text-gray-300">{pub}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
