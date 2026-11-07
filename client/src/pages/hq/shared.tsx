import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import Colophon from '@/components/ui/Colophon'
import type { HQLead } from '@/lib/api'

/** Pieces both HQ screens draw the same way. */

export const STATUSES = ['NEW', 'CONTACTED', 'BOOKED', 'WON', 'LOST', 'JUNK'] as const

/** How long someone has been waiting, in the words a person would use. */
export function waited(minutes: number | null): string {
  if (minutes == null) return ''
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  if (h < 24) return `${h}h ${minutes % 60}m`
  const d = Math.floor(h / 24)
  return `${d}d ${h % 24}h`
}

/**
 * Speed-to-lead, shown as a word rather than a colour alone: the row says
 * "cold" next to the timer so it reads the same to someone who cannot
 * distinguish the two shades. The word also carries the weight: fresh is
 * muted, cooling is ink, cold is set reversed out of an ink block.
 */
export function temperature(minutes: number | null): 'fresh' | 'cooling' | 'cold' | null {
  if (minutes == null) return null
  if (minutes < 15) return 'fresh'
  if (minutes < 120) return 'cooling'
  return 'cold'
}

export const display = (l: HQLead) => l.name || l.email || l.phoneDisplay || 'No name given'

/** A follow-up is stored as midnight UTC of the chosen day, so it is read back in UTC. */
export const dueDay = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

export const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

/** Inputs: hairline at rest, ink when focused, so focus is always visible. */
export const fieldClass =
  'w-full min-w-0 px-3 py-2.5 text-[.95rem] bg-transparent text-ink outline-none border-2 border-hairline transition-colors focus:border-ink'

/** The same, for a textarea that may be dragged taller. Written out in full, not glued. */
export const areaClass =
  'w-full min-w-0 px-3 py-2.5 text-[.95rem] bg-transparent text-ink outline-none border-2 border-hairline transition-colors focus:border-ink resize-y'

export function Wait({ minutes, big = false }: { minutes: number | null; big?: boolean }) {
  const t = temperature(minutes)
  if (!t) return null
  // Every class string is written out in full so Tailwind keeps it.
  const cls = big
    ? t === 'cold'
      ? 'lbl inv inline-block px-2 py-1 text-[.82rem]'
      : t === 'cooling'
        ? 'lbl text-ink inline-block py-1 text-[.82rem]'
        : 'lbl text-muted inline-block py-1 text-[.82rem]'
    : t === 'cold'
      ? 'lbl inv inline-block px-1.5 py-0.5 text-[.68rem]'
      : t === 'cooling'
        ? 'lbl text-ink inline-block py-0.5 text-[.68rem]'
        : 'lbl text-muted inline-block py-0.5 text-[.68rem]'
  return (
    <span className={cls}>
      <span className="sr-only">Waiting </span>
      <span className="num">{waited(minutes)}</span> · {t}
    </span>
  )
}

/** "Hot", as a word with a solid mark before it. Never a coloured badge. */
export function HotMark() {
  return (
    <span className="lbl inline-flex items-center gap-1.5 text-[.66rem] text-ink">
      <span aria-hidden="true" className="inline-block w-[7px] h-[7px] bg-ink" />
      Hot
    </span>
  )
}

/**
 * Shown on a 401 or 403, and only then. Nothing about any lead is rendered
 * before the API has said yes.
 */
export function Denied() {
  return (
    <PageHead n="—" title="Lead HQ">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 sm:gap-x-10">
        <div aria-hidden="true" className="spine spine-light self-start w-[42px] sm:w-[52px] h-[200px] sm:h-[240px]">
          <span className="st">House only</span>
          <Colophon className="cx mt-auto" />
        </div>
        <div className="min-w-0">
          <span className="lbl text-muted block mb-3">Sign in as an administrator</span>
          <p className="text-[1.1rem] sm:text-[1.25rem] leading-[1.45] max-w-[44ch] mb-6">
            These rows are other people's names, numbers and unpublished books. Only the house can open this.
          </p>
          <Link to="/login" className="btn">Sign in</Link>
        </div>
      </div>
    </PageHead>
  )
}
