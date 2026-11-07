import { useEffect, useState } from 'react'
import { wording, type Wording } from '@/lib/api'

type Props = {
  id: string
  label?: string
  cc: string
  phone: string
  onCc: (v: string) => void
  onPhone: (v: string) => void
  required?: boolean
}

/**
 * The dial codes, fetched once and cached for the tab.
 *
 * They come from the server rather than a second list in the client, so the
 * select can never offer a code the intake would then reject.
 */
let cached: Wording | null = null
let inFlight: Promise<Wording> | null = null

export function useWording(): Wording | null {
  const [w, setW] = useState<Wording | null>(cached)
  useEffect(() => {
    if (cached) return
    inFlight ??= wording.get().then(d => {
      cached = d
      return d
    })
    let alive = true
    inFlight.then(d => alive && setW(d)).catch(() => {
      /* The field falls back to a plain number input below. */
    })
    return () => {
      alive = false
    }
  }, [])
  return w
}

const FALLBACK = [
  { iso: 'US', name: 'United States', cc: '+1' },
  { iso: 'GB', name: 'United Kingdom', cc: '+44' },
  { iso: 'CA', name: 'Canada', cc: '+1' },
  { iso: 'AU', name: 'Australia', cc: '+61' },
  { iso: 'NZ', name: 'New Zealand', cc: '+64' },
]

export default function PhoneField({ id, label = 'Phone', cc, phone, onCc, onPhone, required }: Props) {
  const w = useWording()
  const codes = w?.dialCodes?.length ? w.dialCodes : FALLBACK
  const ccId = `${id}-cc`

  const box = { border: '2px solid var(--hairline)', color: 'var(--ink)' }

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="lbl block mb-2 text-muted">{label}</label>
      {/* One row that never outgrows its column: the code shrinks to its
          widest option, capped, and the number takes whatever is left. */}
      <div className="flex gap-2 min-w-0">
        <label htmlFor={ccId} className="sr-only">Country dialling code</label>
        <select
          id={ccId}
          // Named, so a form posted without JavaScript carries the code the
          // visitor actually chose rather than a hidden copy of the default.
          name="phoneCc"
          value={cc}
          onChange={e => onCc(e.target.value)}
          className="num flex-none max-w-[7.5rem] px-2.5 py-3 text-[1rem] bg-transparent outline-none transition-colors focus:border-ink"
          style={box}
        >
          {codes.map(c => (
            <option key={c.iso} value={c.cc}>
              {c.iso} {c.cc}
            </option>
          ))}
        </select>
        <input
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={phone}
          required={required}
          onChange={e => onPhone(e.target.value)}
          placeholder="Your number"
          className="w-full min-w-0 flex-1 px-3.5 py-3 text-[1rem] bg-transparent outline-none transition-colors focus:border-ink"
          style={box}
        />
      </div>
    </div>
  )
}
