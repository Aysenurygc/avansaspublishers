import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Field from './Field'
import Colophon from './Colophon'
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
 * Drawn as a book: a dark spine down the left edge, the form as the page.
 * The email step above it is a ruled entry with no frame, so the two never
 * read as two copies of the same box. When the number is in, the page turns
 * over (ink ground, light spine) rather than vanishing.
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
  const doneRef = useRef<HTMLHeadingElement>(null)

  // The form is replaced in place, so focus would otherwise fall to <body>.
  useEffect(() => {
    if (done) doneRef.current?.focus()
  }, [done])

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

  const headingId = `${from}-call-heading`

  return (
    <section aria-labelledby={headingId} className="flex border-2 border-ink">
      {/* The spine. Decorative: the heading beside it says the same thing.
          Both tone classes are written out in full so Tailwind keeps them. */}
      <div
        aria-hidden="true"
        className={done ? 'spine spine-light w-[38px] sm:w-[48px]' : 'spine spine-dark w-[38px] sm:w-[48px]'}
      >
        <span className="st">An editor calls</span>
        <Colophon className="cx mt-auto" />
      </div>

      {done ? (
        <div className="inv min-w-0 flex-1 p-5 sm:p-7">
          <span className="lbl inv-muted block mb-3">By phone</span>
          <h3 id={headingId} ref={doneRef} tabIndex={-1} className="text-[1.6rem] sm:text-[2rem] mb-3">
            Noted.
          </h3>
          <p className="inv-muted text-[.98rem] leading-[1.6] max-w-[46ch]">
            {w?.callbackConfirmation ??
              'Your number is with us. A real person from the house will call as soon as one is free.'}
          </p>
          {/* Read back exactly what was entered, so a wrong digit is caught here. */}
          <dl className="mt-6 pt-4 border-t border-inv-muted grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline">
            {name && (
              <>
                <dt className="lbl inv-muted">Name</dt>
                <dd className="text-[.95rem] break-words">{name}</dd>
              </>
            )}
            <dt className="lbl inv-muted">Number</dt>
            <dd className="num text-[1rem] break-words">
              {cc} {phone}
            </dd>
          </dl>
        </div>
      ) : (
        <form
          onSubmit={submit}
          action="/api/inbound"
          method="post"
          className="min-w-0 flex-1 p-5 sm:p-7 flex flex-col gap-6"
        >
          <input type="hidden" name="source" value="call-me" />
          <input type="hidden" name="message" value={hotReason ? `HOT: ${hotReason}` : `Asked for a call from ${from}`} />

          <div>
            <span className="lbl text-muted block mb-3">By phone</span>
            <h3 id={headingId} className="text-[1.6rem] sm:text-[2rem] mb-3">{heading}</h3>
            <p className="text-muted text-[.95rem] leading-[1.6] max-w-[52ch]">{blurb}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4">
            <Field
              id={`${from}-call-name`}
              name="name"
              label="Name (optional)"
              value={name}
              onChange={setName}
              placeholder="Your name"
              autoComplete="name"
            />
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

          {/* The button and the sentence it agrees to sit side by side. */}
          <div className="flex flex-col gap-4 pt-5 border-t border-hairline sm:flex-row sm:items-start sm:gap-6">
            <button
              type="submit"
              disabled={busy}
              aria-busy={busy}
              className="btn flex-none w-full sm:w-auto disabled:opacity-50 disabled:cursor-wait"
            >
              {busy ? 'Sending…' : 'Call me'}
            </button>
            <p className="text-muted text-[.78rem] leading-[1.5] max-w-[46ch]">
              {w?.consent ??
                'By sending this, you agree that Avansas Publishers may call or email you about your book. We never sell your number.'}
            </p>
          </div>

          {/* Shown only once the house publishes a number. Rendered as selectable
              text rather than only a tel: link, which does nothing for many
              viewers and cannot report whether it worked. */}
          {w?.phone && (
            <p className="text-muted text-[.82rem]">
              Or call us: <a href={`tel:${w.phone}`} className="num text-ink underline decoration-1 underline-offset-2">{w.phone}</a>
            </p>
          )}
        </form>
      )}
    </section>
  )
}
