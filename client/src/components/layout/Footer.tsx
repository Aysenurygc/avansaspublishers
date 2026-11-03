import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const services = [
  { label: 'Ghostwriting',         slug: 'ghostwriting' },
  { label: 'Book Publishing',      slug: 'book-publishing' },
  { label: 'Editing & Proofreading', slug: 'editing' },
  { label: 'Cover Design',         slug: 'cover-design' },
  { label: 'Audiobook Production', slug: 'audiobook' },
  { label: 'Book Marketing',       slug: 'marketing' },
]

const company = [
  { label: 'About Us',      to: '/about' },
  { label: 'Portfolio',     to: '/portfolio' },
  { label: 'Pricing',       to: '/pricing' },
  { label: 'Blog',          to: '/blog' },
  { label: 'Careers',       to: '/careers' },
  { label: 'Press',         to: '/press' },
]

const socials = [
  { icon: Facebook,  href: '#', label: 'Facebook' },
  { icon: Twitter,   href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin,  href: '#', label: 'LinkedIn' },
  { icon: Youtube,   href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600">
      <div className="container-max section-padding pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-gold-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-white">
                Avansas<span className="text-primary-400">Publishers</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transforming stories into bestsellers. World-class ghostwriting and publishing services tailored for visionary authors.
            </p>
            <div className="flex gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-9 h-9 bg-dark-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <s.icon className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.map(s => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {company.map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@avansaspublishers.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  hello@avansaspublishers.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+18005551234" className="text-sm text-gray-400 hover:text-white transition-colors">
                  +1 (800) 555-1234
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">New York, NY 10001, USA</span>
              </li>
            </ul>
            <Link to="/consultation" className="btn-primary text-sm py-2.5 mt-6 w-full text-center block">
              Book Free Consultation
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-600 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Avansas Publishers. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/refund"  className="hover:text-gray-300 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
