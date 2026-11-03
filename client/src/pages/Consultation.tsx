import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Calendar, Clock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const services = ['Ghostwriting', 'Book Publishing', 'Editing & Proofreading', 'Cover Design', 'Formatting', 'Audiobook Production', 'Book Marketing', 'Author Website', 'Full Package']
const budgets = ['$500–$1,500', '$1,500–$3,500', '$3,500–$8,000', '$8,000+', 'Not sure yet']

export default function Consultation() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    service: '', genre: '', wordCount: '',
    budget: '', timeline: '', message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Consultation booked! Check your email for confirmation.")
    setStep(4)
  }

  if (step === 4) {
    return (
      <div className="pt-32 section-padding">
        <div className="container-max max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-4">You're Booked!</h1>
          <p className="text-gray-400 mb-8">We've received your consultation request. A publishing consultant will reach out within 2 business hours to confirm your appointment and send a calendar invite.</p>
          <Link to="/" className="btn-primary">Back to Home <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24">
      <section className="section-padding bg-dark-800 border-b border-dark-600">
        <div className="container-max text-center">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">Free Consultation</p>
          <h1 className="section-title mb-4">Let's Talk About Your Book</h1>
          <p className="section-subtitle mx-auto">30 minutes. No pressure. Just a conversation about your vision and how we can bring it to life.</p>
        </div>
      </section>

      <section className="section-padding bg-dark-900">
        <div className="container-max max-w-2xl">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-500'}`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={`w-16 h-px transition-all ${step > s ? 'bg-primary-500' : 'bg-dark-600'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="card-dark">
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-bold text-white mb-4">About You</h2>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Full Name *</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Phone Number (optional)</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors" placeholder="+1 (555) 000-0000" />
                </div>
                <button type="button" onClick={() => setStep(2)} disabled={!form.name || !form.email} className="btn-primary w-full">
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-bold text-white mb-4">About Your Book</h2>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">What service do you need? *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map(s => (
                      <button key={s} type="button" onClick={() => setForm({...form, service: s})}
                        className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${form.service === s ? 'border-primary-500 bg-primary-900/30 text-primary-300' : 'border-dark-500 text-gray-400 hover:border-dark-400'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Genre / Category</label>
                  <input type="text" value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. Business, Self-Help, Memoir, Fiction..." />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                  <button type="button" onClick={() => setStep(3)} disabled={!form.service} className="btn-primary flex-1">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-bold text-white mb-4">Budget & Timeline</h2>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">What's your budget range?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {budgets.map(b => (
                      <button key={b} type="button" onClick={() => setForm({...form, budget: b})}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${form.budget === b ? 'border-primary-500 bg-primary-900/30 text-primary-300' : 'border-dark-500 text-gray-400 hover:border-dark-400'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Tell us about your project</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    placeholder="Give us a brief overview of your book idea, goals, and any questions you have..." />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
                  <button type="submit" className="btn-primary flex-1">
                    <Calendar className="w-4 h-4" /> Book Free Consultation
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="flex flex-col sm:flex-row gap-6 mt-8 text-center">
            {[
              { icon: Calendar, text: '30-minute call' },
              { icon: Clock,    text: 'Response within 2 hours' },
              { icon: Check,    text: 'No commitment required' },
            ].map(item => (
              <div key={item.text} className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <item.icon className="w-4 h-4 text-primary-500" /> {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
