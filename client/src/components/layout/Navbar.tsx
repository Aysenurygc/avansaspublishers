import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const services = [
  { label: 'Ghostwriting',         slug: 'ghostwriting' },
  { label: 'Book Publishing',      slug: 'book-publishing' },
  { label: 'Editing & Proofreading', slug: 'editing' },
  { label: 'Cover Design',         slug: 'cover-design' },
  { label: 'Formatting',           slug: 'formatting' },
  { label: 'Audiobook Production', slug: 'audiobook' },
  { label: 'Book Marketing',       slug: 'marketing' },
  { label: 'Author Website',       slug: 'author-website' },
]

export default function Navbar() {
  const [open, setOpen]           = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700 py-3' : 'bg-transparent py-5'
    )}>
      <div className="container-max px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-gold-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
            Avansas<span className="text-primary-400">Publishers</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => cn('btn-ghost text-sm', isActive && 'text-primary-400')}>
            Home
          </NavLink>

          {/* Services dropdown */}
          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className="btn-ghost text-sm flex items-center gap-1">
              Services <ChevronDown className={cn('w-4 h-4 transition-transform', servicesOpen && 'rotate-180')} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64">
                <div className="bg-dark-800 border border-dark-600 rounded-xl p-2 shadow-2xl">
                  {services.map(s => (
                    <Link key={s.slug} to={`/services/${s.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
                      {s.label}
                    </Link>
                  ))}
                  <div className="border-t border-dark-600 mt-1 pt-1">
                    <Link to="/services" className="block px-4 py-2.5 text-sm text-primary-400 hover:text-primary-300 rounded-lg transition-colors font-medium">
                      View All Services →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/pricing"   className={({ isActive }) => cn('btn-ghost text-sm', isActive && 'text-primary-400')}>Pricing</NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => cn('btn-ghost text-sm', isActive && 'text-primary-400')}>Portfolio</NavLink>
          <NavLink to="/about"     className={({ isActive }) => cn('btn-ghost text-sm', isActive && 'text-primary-400')}>About</NavLink>
          <NavLink to="/blog"      className={({ isActive }) => cn('btn-ghost text-sm', isActive && 'text-primary-400')}>Blog</NavLink>
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link to="/consultation" className="btn-primary text-sm py-2.5 px-6">Free Consultation</Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-gray-300 hover:text-white">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-dark-800 border-t border-dark-600 px-4 py-4 space-y-1">
          {[
            { to: '/',            label: 'Home' },
            { to: '/services',    label: 'Services' },
            { to: '/pricing',     label: 'Pricing' },
            { to: '/portfolio',   label: 'Portfolio' },
            { to: '/about',       label: 'About' },
            { to: '/blog',        label: 'Blog' },
            { to: '/contact',     label: 'Contact' },
          ].map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => cn('block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors', isActive && 'text-primary-400 bg-dark-700')}>
              {item.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-dark-600 flex flex-col gap-2">
            <Link to="/login"        className="btn-outline text-center text-sm">Sign In</Link>
            <Link to="/consultation" className="btn-primary text-center text-sm">Free Consultation</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
