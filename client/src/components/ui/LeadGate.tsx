import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Field from './Field'
import { useWording } from './PhoneField'
import { leads, type LeadSource } from '@/lib/api'
import { attribution } from '@/lib/capture'

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
 *
 * Drawn as a ruled entry, not a box: a heavy rule, the heading in the margin,
 * the form beside it. It is the cooler of the two capture options, so it takes
 * the outlined button and leaves the frame and the solid button to the call.
 */
export default function LeadGate({ source, result, heading, blurb, cta = 'Send it', onSent }: Props) {
  const w = useWording()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [consent, setConsent] = useState(false)
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
        email,
        name: name || undefined,
        source,
        result,
        consent,
        attribution: attribution(),
        company,
      })
      setDone(true)
      onSent?.()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'That did not send. Email hello@avansaspublishers.com and we will pick it up.'
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }

  const headingId = `${source}-gate-heading`

  return (
    <section
      aria-labelledby={headingId}
      className="rule-t pt-5 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
    >
      {done ? (
        <>
          <div>
            <span className="lbl text-muted block mb-3">By email</span>
            <h3 id={headingId} ref={doneRef} tabIndex={-1} className="text-[1.3rem] sm:text-[1.5rem]">
              Noted.
            </h3>
          </div>
          <div className="min-w-0">
            <p className="text-[1.05rem] leading-[1.55] max-w-[46ch]">
              {w?.emailConfirmation ??
                'We have it. An editor reads these — if there is something here, you will hear from a person, not a sequence.'}
            </p>
            {/* What we hold, read back. It states the address, never a delivery. */}
            <dl className="mt-5 pt-4 border-t border-hairline grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline">
              {name && (
                <>
                  <dt className="lbl text-muted">Name</dt>
                  <dd className="text-[.95rem] break-words">{name}</dd>
                </>
              )}
              <dt className="lbl text-muted">Address</dt>
              <dd className="text-[.95rem] break-all">{email}</dd>
            </dl>
          </div>
        </>
      ) : (
        <>
          <div>
            <span className="lbl text-muted block mb-3">By email</span>
            <h3 id={headingId} className="text-[1.3rem] sm:text-[1.5rem] mb-3">{heading}</h3>
            <p className="text-muted text-[.93rem] leading-[1.6] max-w-[52ch]">{blurb}</p>
          </div>

          <form
            onSubmit={submit}
            action="/api/inbound"
            method="post"
            className="min-w-0 flex flex-col gap-5"
          >
            <input type="hidden" name="source" value={source} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id={`${source}-name`}  name="name"  label="Name (optional)" value={name}  onChange={setName}  placeholder="Your name" autoComplete="name" />
              <Field id={`${source}-email`} name="email" label="Email" type="email" value={email} onChange={setEmail} required placeholder="you@example.com" autoComplete="email" />
            </div>

            {/* Hidden from people and from screen readers, so only a bot fills it. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <label htmlFor={`${source}-company`}>Company</label>
              <input
                id={`${source}-company`}
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </div>

            <label htmlFor={`${source}-consent`} className="flex items-start gap-3 cursor-pointer">
              <input
                id={`${source}-consent`}
                name="consent"
                value="true"
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="mt-[3px] w-[18px] h-[18px] flex-none accent-current"
              />
              <span className="text-muted text-[.84rem] leading-[1.5]">
                Send me occasional notes on writing and publishing. Optional, and you can stop any time.
              </span>
            </label>

            <div className="flex flex-col gap-4 pt-4 border-t border-hairline sm:flex-row sm:items-start sm:gap-6">
              <button
                type="submit"
                disabled={busy}
                aria-busy={busy}
                className="btn-o flex-none w-full sm:w-auto disabled:opacity-50 disabled:cursor-wait"
              >
                {busy ? 'Sending…' : cta}
              </button>
              <p className="text-muted text-[.78rem] leading-[1.5] max-w-[46ch]">
                We use your address to send what you asked for. We do not sell it, and we do not add you
                to anything you did not tick.
              </p>
            </div>
          </form>
        </>
      )}
    </section>
  )
}
