import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,93,30,0.3),transparent_70%)]" />
      <div className="container-max relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
          Ready to Write Your <br />
          <span className="text-gold-400">Next Chapter?</span>
        </h2>
        <p className="text-xl text-primary-200 max-w-2xl mx-auto mb-10">
          Join 2,400+ authors who trusted Avansas Publishers to bring their stories to life. Your free consultation is waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/consultation" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-primary-700 hover:bg-gray-100 font-bold rounded-lg transition-all duration-300 text-base shadow-xl">
            Book Free Consultation <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="tel:+18005551234" className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg transition-all duration-300 text-base">
            <Phone className="w-5 h-5" /> Call Us Now
          </a>
        </div>
        <p className="text-primary-300 text-sm mt-6">No commitment. No credit card. Just a conversation about your book.</p>
      </div>
    </section>
  )
}
