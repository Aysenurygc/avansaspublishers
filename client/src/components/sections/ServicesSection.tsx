import { Link } from 'react-router-dom'
import { PenTool, BookOpen, Edit3, Palette, Layout, Headphones, TrendingUp, Globe, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: PenTool,
    title: 'Ghostwriting',
    slug: 'ghostwriting',
    description: 'Expert writers craft your book from concept to final manuscript while you keep 100% ownership and credit.',
    color: 'from-orange-500 to-red-600',
  },
  {
    icon: BookOpen,
    title: 'Book Publishing',
    slug: 'book-publishing',
    description: 'Full-service publishing from finished manuscript to Amazon, Barnes & Noble, and global distributors.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Edit3,
    title: 'Editing & Proofreading',
    slug: 'editing',
    description: 'Developmental editing, copyediting, and proofreading to make your manuscript publication-ready.',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    icon: Palette,
    title: 'Cover Design',
    slug: 'cover-design',
    description: 'Award-winning designers create genre-researched covers that grab attention and drive sales.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Layout,
    title: 'Formatting',
    slug: 'formatting',
    description: 'Professional interior layout for print and eBook formats that meet all publishing standards.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Headphones,
    title: 'Audiobook Production',
    slug: 'audiobook',
    description: 'Full audiobook production with professional narrator casting and studio-quality recording.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: TrendingUp,
    title: 'Book Marketing',
    slug: 'marketing',
    description: 'Data-driven marketing campaigns that get your book in front of the right readers and drive sales.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Globe,
    title: 'Author Website',
    slug: 'author-website',
    description: 'Custom author websites designed to build your brand, grow your audience, and sell your books.',
    color: 'from-teal-500 to-cyan-600',
  },
]

export default function ServicesSection() {
  return (
    <section className="section-padding bg-dark-900">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">What We Do</p>
          <h2 className="section-title mb-4">Everything You Need to <br />Publish Your Best Work</h2>
          <p className="section-subtitle mx-auto">
            From your first idea to a bestselling book — every service under one roof with the world's best publishing team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(service => (
            <Link key={service.slug} to={`/services/${service.slug}`}
              className="card-dark group flex flex-col hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{service.description}</p>
              <div className="flex items-center gap-1 text-primary-400 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services" className="btn-outline">View All Services</Link>
        </div>
      </div>
    </section>
  )
}
