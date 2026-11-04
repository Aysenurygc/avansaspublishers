import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Field from '@/components/ui/Field'
import { consultations } from '@/lib/api'

const serviceOptions = [
  'Ghostwriting', 'Editing', 'Cover design', 'Interior & spine',
  'Publishing', 'Audiobook', 'Marketing', 'Author site', 'The whole book',
]
const budgetOptions = ['Under $1,500', '$1,500–3,500', '$3,500–8,000', 'Over $8,000', 'Not sure yet']

export default function Consultation() {
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    service: '', genre: '', budget: '', message: '',
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await consultations.create(form)
      setStep(4)
    } catch {
      toast.error('That did not send. Email hello@avansaspublishers.com and we will pick it up.')
    } finally {
      setSending(false)
    }
  }

  if (step === 4) {
    return (
      <section className="band">
        <div className="wrap max-w-[620px]">
          <div className="sh">
            <span className="n num">✓</span>
            <h1>Booked.</h1>
            <p className="sub">
              We have your details. An editor will reply within one working day with times and a
              short list of questions about the book.
            </p>
          </div>
          <Link to="/" className="btn">Back to the house</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="band-tight pt-14 pb-20">
      <div className="wrap max-w-[760px]">
        <div className="sh">
          <span className="n num">0{step}</span>
          <h1>Start your book</h1>
          <p className="sub">Thirty minutes, no charge, and a straight answer about whether we are the right house for it.</p>
        </div>

        {/* step rule */}
        <div className="flex gap-0.5 mb-9">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className="h-2.5 flex-1"
              style={{ background: step >= s ? 'var(--ink)' : 'var(--hairline)' }}
              aria-hidden="true"
            />
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5 p-6 sm:p-8" style={{ border: '2px solid var(--ink)' }}>
          {step === 1 && (
            <>
              <h2 className="text-[1.4rem]">You</h2>
              <Field id="k-name"  label="Name"             value={form.name}  onChange={v => setForm({ ...form, name: v })}  required placeholder="Your name" />
              <Field id="k-email" label="Email"            type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required placeholder="you@example.com" />
              <Field id="k-phone" label="Phone (optional)" type="tel"   value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="+1 (000) 000-0000" />
              <button type="button" onClick={() => setStep(2)} disabled={!form.name || !form.email} className="btn disabled:opacity-40">
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-[1.4rem]">The book</h2>
              <div>
                <span className="lbl block mb-3 text-muted">What do you need?</span>
                <div className="flex flex-wrap gap-0.5">
                  {serviceOptions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, service: s })}
                      className="lbl px-3.5 py-2.5 border-2 transition-colors"
                      style={
                        form.service === s
                          ? { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)', fontSize: '.68rem' }
                          : { borderColor: 'var(--hairline)', color: 'var(--muted)', fontSize: '.68rem' }
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <Field id="k-genre" label="Category" value={form.genre} onChange={v => setForm({ ...form, genre: v })} placeholder="Business, memoir, health…" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-o flex-1">Back</button>
                <button type="button" onClick={() => setStep(3)} disabled={!form.service} className="btn flex-1 disabled:opacity-40">Next</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-[1.4rem]">Budget and brief</h2>
              <div>
                <span className="lbl block mb-3 text-muted">Budget range</span>
                <div className="flex flex-wrap gap-0.5">
                  {budgetOptions.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setForm({ ...form, budget: b })}
                      className="lbl px-3.5 py-2.5 border-2 transition-colors"
                      style={
                        form.budget === b
                          ? { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)', fontSize: '.68rem' }
                          : { borderColor: 'var(--hairline)', color: 'var(--muted)', fontSize: '.68rem' }
                      }
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <Field id="k-message" label="The book, briefly" value={form.message} onChange={v => setForm({ ...form, message: v })} rows={5} placeholder="What is it about, who is it for, and when do you need it?" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-o flex-1">Back</button>
                <button type="submit" disabled={sending} className="btn flex-1 disabled:opacity-50">
                  {sending ? 'Sending…' : 'Book the call'}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="flex flex-wrap gap-6 mt-7 lbl text-muted" style={{ fontSize: '.66rem' }}>
          <span>Thirty minutes</span>
          <span>No charge</span>
          <span>Reply within one working day</span>
        </div>
      </div>
    </section>
  )
}
