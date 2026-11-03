import { Link } from 'react-router-dom'
import { PenTool, BookOpen, Edit3, Palette, Layout, Headphones, TrendingUp, Globe, ArrowRight, Check } from 'lucide-react'

const services = [
  {
    icon: PenTool,
    title: 'Ghostwriting',
    slug: 'ghostwriting',
    description: 'Expert writers craft your complete manuscript while you maintain 100% ownership, credit, and royalties.',
    features: ['Any genre or format', 'Voice-matched writing', 'Research included', 'Unlimited revisions'],
    startingAt: 1249,
    color: 'from-orange-500 to-red-600',
  },
  {
    icon: BookOpen,
    title: 'Book Publishing',
    slug: 'book-publishing',
    description: 'End-to-end publishing to Amazon, Barnes & Noble, Apple Books, and 150+ global retailers.',
    features: ['ISBN assignment', 'Multi-platform upload', 'Print & eBook', 'Global distribution'],
    startingAt: 499,
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Edit3,
    title: 'Editing & Proofreading',
    slug: 'editing',
    description: 'Developmental editing, copyediting, line editing, and final proofreading from industry veterans.',
    features: ['Developmental editing', 'Line & copy editing', 'Proofreading', 'Style consistency'],
    startingAt: 299,
    color: 'from-yellow-500 to-amber-600',
  },
  {
    icon: Palette,
    title: 'Cover Design',
    slug: 'cover-design',
    description: 'Genre-researched, sales-optimized covers created by award-winning designers.',
    features: ['Front, back & spine', 'Genre research', 'eBook & print versions', '5 concepts to choose from'],
    startingAt: 349,
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Layout,
    title: 'Formatting',
    slug: 'formatting',
    description: 'Professional interior layout for paperback, hardcover, and all eBook formats.',
    features: ['Print-ready PDF', 'EPUB & MOBI', 'Custom chapter styles', 'Images & charts'],
    startingAt: 199,
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Headphones,
    title: 'Audiobook Production',
    slug: 'audiobook',
    description: 'Studio-quality audiobook production with professional narrator casting and ACX distribution.',
    features: ['Narrator casting', 'Studio recording', 'Post-production', 'ACX & Findaway distribution'],
    startingAt: 799,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: TrendingUp,
    title: 'Book Marketing',
    slug: 'marketing',
    description: 'Data-driven marketing campaigns to drive sales, reviews, and bestseller rankings.',
    features: ['Amazon optimization', 'ARC distribution', 'Social media campaigns', 'Press releases'],
    startingAt: 599,
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Globe,
    title: 'Author Website',
    slug: 'author-website',
    description: 'Custom author websites designed to build your brand, grow your mailing list, and sell your books.',
    features: ['Custom design', 'SEO optimized', 'Email integration', 'Book store built-in'],
    startingAt: 999,
    color: 'from-teal-500 to-cyan-600',
  },
]

export default function Services() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="section-padding bg-dark-800 border-b border-dark-600">
        <div className="container-max text-center">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">What We Offer</p>
          <h1 className="section-title mb-4">Publishing Services Built for Bestsellers</h1>
          <p className="section-subtitle mx-auto">
            Every service is delivered by vetted industry professionals with transparent pricing and written scopes before work begins.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding bg-dark-900">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map(service => (
              <div key={service.slug} className="card-dark flex gap-6 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-serif text-xl font-bold text-white">{service.title}</h3>
                    <span className="text-sm text-gray-400 flex-shrink-0">from <span className="text-white font-semibold">${service.startingAt.toLocaleString()}</span></span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  <ul className="grid grid-cols-2 gap-1.5 mb-4">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
