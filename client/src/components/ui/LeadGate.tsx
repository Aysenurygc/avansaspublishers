import { useState } from 'react'
import toast from 'react-hot-toast'
import Field from './Field'
import { leads, type LeadSource } from '@/lib/api'

type Props = {
  source: LeadSource
  /** Whatever the tool computed, stored alongside the address. */
  result?: unknown
  /** Shown above the form — say what they get, in this tool's own terms. */
  heading: string
  blurb: string
  cta?: string
  onSent?: () => void
}

/**
 * The shared email step for every lead-magnet tool.
 *
 * The result is always shown before this gate, never after: a tool that
 * withholds its answer until an address is handed over reads as a mill, which
 * is the one thing this brand is built to avoid. The gate offers to send the
 * written version and nothing more.
 */
export default function LeadGate({ source, result, heading, blurb, cta = 'Send it', onSent }: Props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await leads.submit({ email, name: name || undefined, source, result, consent })
      setDone(true)
      onSent?.()
    } catch {
      toast.error('That did not send. Email hello@avansaspublishers.com and we will pick it up.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="p-6 sm:p-7 inv">
        <h3 className="text-[1.3rem] mb-2">On its way.</h3>
        <p className="inv-muted text-[.93rem] max-w-[46ch]">
          Check {email}. If an editor thinks there is something here, you will hear from a person,
          not a sequence.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="p-6 sm:p-7 flex flex-col gap-5" style={{ border: '2px solid var(--ink)' }}>
      <div>
        <h3 className="text-[1.3rem] mb-2">{heading}</h3>
        <p className="text-muted text-[.93rem] max-w-[52ch]">{blurb}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id={`${source}-name`}  label="Name (optional)" value={name}  onChange={setName}  placeholder="Your name" />
        <Field id={`${source}-email`} label="Email" type="email" value={email} onChange={setEmail} required placeholder="you@example.com" />
      </div>

      <label htmlFor={`${source}-consent`} className="flex items-start gap-3 cursor-pointer">
        <input
          id={`${source}-consent`}
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          className="mt-1 w-4 h-4 flex-none accent-current"
        />
        <span className="text-muted text-[.84rem] leading-[1.5]">
          Send me occasional notes on writing and publishing. Optional, and you can stop any time.
        </span>
      </label>

      <button type="submit" disabled={busy} className="btn self-start disabled:opacity-50">
        {busy ? 'Sending…' : cta}
      </button>

      <p className="text-muted text-[.78rem] leading-[1.5] max-w-[52ch]">
        We use your address to send what you asked for. We do not sell it, and we do not add you
        to anything you did not tick.
      </p>
    </form>
  )
}
