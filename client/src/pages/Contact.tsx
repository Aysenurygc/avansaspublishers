import { useState } from 'react'
import toast from 'react-hot-toast'
import PageHead from '@/components/layout/PageHead'
import Field from '@/components/ui/Field'
import { contact } from '@/lib/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await contact.send(form)
      toast.success('Sent. We reply within one working day.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('That did not send. Email us directly at hello@avansaspublishers.com.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHead
        n="08"
        title="Get in touch"
        sub="Tell us about the book. We read everything that arrives and reply within one working day."
      />

      <section className="pb-20">
        <div className="wrap grid gap-12 grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <div style={{ borderTop: '2px solid var(--ink)' }}>
              {[
                { k: 'Email', v: 'hello@avansaspublishers.com' },
                { k: 'Phone', v: '+1 (800) 555-1234' },
                { k: 'Hours', v: 'Mon–Fri, 9–19 EST' },
                { k: 'Post',  v: 'New York, NY 10001' },
              ].map(r => (
                <div key={r.k} className="grid grid-cols-[72px_1fr] gap-4 py-3.5 hair-b items-baseline">
                  <span className="lbl text-muted" style={{ fontSize: '.66rem' }}>{r.k}</span>
                  <span className="text-[.93rem] select-all">{r.v}</span>
                </div>
              ))}
            </div>
            <p className="text-muted text-[.88rem] leading-[1.55] mt-6 max-w-[40ch]">
              Sending a manuscript? Attach it to an email. We will tell you plainly whether we are
              the right house for it.
            </p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5 p-6 sm:p-8" style={{ border: '2px solid var(--ink)' }}>
            <h2 className="text-[1.5rem]">Send a message</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field id="c-name"  label="Name"    value={form.name}  onChange={v => setForm({ ...form, name: v })}  required placeholder="Your name" />
              <Field id="c-email" label="Email"   type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required placeholder="you@example.com" />
            </div>
            <Field id="c-subject" label="Subject" value={form.subject} onChange={v => setForm({ ...form, subject: v })} required placeholder="What is this about?" />
            <Field id="c-message" label="Message" value={form.message} onChange={v => setForm({ ...form, message: v })} required rows={6} placeholder="Tell us about the book." />
            <button type="submit" disabled={sending} className="btn disabled:opacity-50">
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
