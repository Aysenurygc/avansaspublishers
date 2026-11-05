import { useState } from 'react'
import toast from 'react-hot-toast'
import Field from './Field'
import PhoneField, { useWording } from './PhoneField'
import { leads, type LeadSource } from '@/lib/api'
import { attribution } from '@/lib/capture'

type Props = {
  /** The tool this was asked from, so HQ knows what the call is about. */
  from: LeadSource
  /** Whatever the tool computed, so the caller opens with it. */
  result?: unknown
  /** Set by the tool when its own rule says this answer matters. */
  hotReason?: string
  heading?: string
  blurb?: string
}

/**
 * "Just call me", which sits beside every tool result.
 *
 * It is the hottest thing a stranger can do, so it is one field and a button —
 * no questions, no scheduling, nothing to read first.
 *
 * The form posts to /api/inbound with real `name` attributes and a real
 * `action`, so it still submits with JavaScript off or broken. With JavaScript
 * the submit is intercepted and sent as JSON; without it the browser posts the
 * form and the server redirects to /thanks.
 */
export default function CallMe({
  from,
  result,
  hotReason,
  heading = 'Or have an editor call you.',
  blurb = 'One number, no form. Whoever calls will have read your result first.',
}: Props) {
  const w = useWording()
  const [name, setName] = useState('')
  const [cc, setCc] = useState('+1')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await leads.submit({
        source: 'call-me',
        name: name || undefined,
        phone,
        phoneCc: cc,
        // The tool's own HOT rule travels in the message, where the server
        // reads it. A callback is hot regardless; this carries the reason.
        message: hotReason ? `HOT: ${hotReason}` : `Asked for a call from ${from}`,
        result,
        attribution: attribution(),
        company,
      })
      setDone(true)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'That did not send. Try again, or email hello@avansaspublishers.com.'
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="p-6 sm:p-7 inv">
        <h3 className="text-[1.3rem] mb-2">Noted.</h3>
        <p className="inv-muted text-[.93rem] max-w-[46ch]">
          {w?.callbackConfirmation ??
            'Your number is with us. A real person from the house will call as soon as one is free.'}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      action="/api/inbound"
      method="post"
      className="p-6 sm:p-7 flex flex-col gap-5"
      style={{ border: '2px solid var(--ink)' }}
    >
      <input type="hidden" name="source" value="call-me" />
      <input type="hidden" name="message" value={hotReason ? `HOT: ${hotReason}` : `Asked for a call from ${from}`} />

      <div>
        <h3 className="text-[1.3rem] mb-2">{heading}</h3>
        <p className="text-muted text-[.93rem] max-w-[52ch]">{blurb}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id={`${from}-call-name`} label="Name (optional)" value={name} onChange={setName} placeholder="Your name" />
        <PhoneField id={`${from}-call-phone`} cc={cc} phone={phone} onCc={setCc} onPhone={setPhone} required />
      </div>

      {/* Hidden from people, and from screen readers, so only a bot fills it. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor={`${from}-company`}>Company</label>
        <input
          id={`${from}-company`}
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
      </div>

      <button type="submit" disabled={busy} className="btn self-start disabled:opacity-50">
        {busy ? 'Sending…' : 'Call me'}
      </button>

      <p className="text-muted text-[.78rem] leading-[1.5] max-w-[52ch]">
        {w?.consent ??
          'By sending this, you agree that Avansas Publishers may call or email you about your book. We never sell your number.'}
      </p>

      {/* Shown only once the house publishes a number. Rendered as selectable
          text rather than only a tel: link, which does nothing for many
          viewers and cannot report whether it worked. */}
      {w?.phone && (
        <p className="text-muted text-[.82rem]">
          Or call us: <a href={`tel:${w.phone}`} className="underline decoration-1 underline-offset-2">{w.phone}</a>
        </p>
      )}
    </form>
  )
}
