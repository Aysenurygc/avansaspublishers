import { Link } from 'react-router-dom'

/* Small pieces shared by the four tools. Every class below is a full literal. */

const onStyle  = { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)', fontSize: '.7rem' }
const offStyle = { borderColor: 'var(--hairline)', color: 'var(--muted)', fontSize: '.7rem' }

/** Option buttons, styled as Consultation and Portfolio style them. Stacked when `stack`. */
export function Choice({
  id, label, options, value, onChange, stack = false,
}: {
  id: string
  label: string
  options: string[]
  value: number | null
  onChange: (i: number) => void
  stack?: boolean
}) {
  const layout = stack ? 'flex flex-col gap-0.5' : 'flex flex-wrap gap-0.5'
  const btn = stack
    ? 'lbl text-left px-4 py-3 border-2 transition-colors leading-[1.35]'
    : 'lbl px-4 py-2.5 border-2 transition-colors'
  return (
    <div role="radiogroup" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="lbl block mb-3 text-muted">{label}</span>
      <div className={layout}>
        {options.map((o, i) => (
          <button
            key={o}
            id={`${id}-${i}`}
            type="button"
            role="radio"
            aria-checked={value === i}
            onClick={() => onChange(i)}
            className={btn}
            style={value === i ? onStyle : offStyle}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

/** The step rule from Consultation: filled segments up to the current step. */
export function StepRule({ total, step }: { total: number; step: number }) {
  return (
    <div className="flex gap-0.5 mb-9" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-2.5 flex-1"
          style={{ background: step > i ? 'var(--ink)' : 'var(--hairline)' }}
        />
      ))}
    </div>
  )
}

/** A filled bar. Severity is shown by how much is filled, never by colour. */
export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  return (
    <div
      className="h-2.5 w-full"
      style={{ background: 'var(--hairline)' }}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="h-full" style={{ width: `${pct}%`, background: 'var(--ink)' }} />
    </div>
  )
}

/** Quiet footer link back to the tools index. */
export function BackToTools() {
  return (
    <p className="mt-10">
      <Link to="/tools" className="lbl text-muted border-b-2 border-transparent hover:border-ink pb-0.5" style={{ fontSize: '.7rem' }}>
        All tools
      </Link>
    </p>
  )
}
