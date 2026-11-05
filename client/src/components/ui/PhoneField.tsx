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

  const box = { border: '2px solid var(--hairline)', color: 'var(--ink)' }

  return (
    <div>
      <label htmlFor={id} className="lbl block mb-2 text-muted">{label}</label>
      <div className="flex gap-2">
        <select
          aria-label="Country dialling code"
          value={cc}
          onChange={e => onCc(e.target.value)}
          className="px-2.5 py-3 text-[.95rem] bg-transparent outline-none focus:border-ink flex-none"
          style={{ ...box, maxWidth: '8.5rem' }}
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
          className="w-full min-w-0 px-3.5 py-3 text-[.95rem] bg-transparent outline-none transition-colors focus:border-ink"
          style={box}
        />
      </div>
      <input type="hidden" name="phoneCc" value={cc} />
    </div>
  )
}
