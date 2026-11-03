import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success("Message sent! We'll be in touch within 24 hours.")
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="pt-24">
      <section className="section-padding bg-dark-800 border-b border-dark-600">
        <div className="container-max text-center">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">Get In Touch</p>
          <h1 className="section-title mb-4">We'd Love to Hear About Your Book</h1>
          <p className="section-subtitle mx-auto">Our publishing consultants typically respond within 2 business hours.</p>
        </div>
      </section>

      <section className="section-padding bg-dark-900">
        <div className="container-max grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: Mail,  label: 'Email',   value: 'hello@avansaspublishers.com', href: 'mailto:hello@avansaspublishers.com' },
              { icon: Phone, label: 'Phone',   value: '+1 (800) 555-1234',           href: 'tel:+18005551234' },
              { icon: MapPin,label: 'Address', value: '123 Publishing Lane, New York, NY 10001', href: null },
              { icon: Clock, label: 'Hours',   value: 'Mon–Fri: 9AM–7PM EST\nSat: 10AM–4PM EST', href: null },
            ].map(item => (
              <div key={item.label} className="card-dark flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-0.5">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="text-white hover:text-primary-400 transition-colors text-sm">{item.value}</a>
                  ) : (
                    <div className="text-sm text-white whitespace-pre-line">{item.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card-dark space-y-5">
              <h2 className="font-serif text-2xl font-bold text-white mb-2">Send Us a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
                <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Tell us about your book project..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
