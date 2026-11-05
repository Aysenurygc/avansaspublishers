/**
 * Turning a stored lead into something the person about to phone can read.
 *
 * Without this, HQ shows a JSON blob and whoever makes the call opens the
 * conversation with "so, er, you used our website". With it they open with
 * "you said the hardest part is the middle" — which is the whole point of
 * running tools instead of an opt-in box.
 *
 * Every new tool adds its case to `SUMMARIES`. A tool with no case still
 * renders: it falls back to its label and its message, which is worse than a
 * proper line but is never wrong.
 */
import { formTypeLabel } from './scoring.js'

const num = n => (typeof n === 'number' ? n.toLocaleString('en-US') : null)

/** One short line per tool, written for someone holding a phone. */
const SUMMARIES = {
  readiness_scorecard: r => {
    const bits = []
    if (typeof r.score === 'number') bits.push(`${r.score}/${r.max ?? 60}`)
    if (r.verdict) bits.push(String(r.verdict))
    return bits
  },

  book_triage: r => {
    const bits = []
    if (r.form) bits.push(`best form: ${r.form}`)
    if (r.runnerUp) bits.push(`then ${r.runnerUp}`)
    return bits
  },

  opening_pages: r => {
    const bits = []
    if (num(r.words)) bits.push(`${num(r.words)} words`)
    if (typeof r.avgSentence === 'number') bits.push(`avg sentence ${r.avgSentence}`)
    if (typeof r.dialoguePct === 'number') bits.push(`${r.dialoguePct}% dialogue`)
    if (Array.isArray(r.openingSignals) && r.openingSignals.length)
      bits.push(r.openingSignals.slice(0, 2).join(', '))
    return bits
  },

  memoir_map: r => {
    const bits = []
    if (Array.isArray(r.entries)) bits.push(`${r.entries.length} moments`)
    if (Array.isArray(r.chapters)) bits.push(`${r.chapters.length} chapters`)
    if (r.shape) bits.push(r.shape === 'begin-at-turn' ? 'begins at the turn' : 'chronological')
    if (r.forSomeoneElse) bits.push("for someone else's story")
    if (r.storyShare) bits.push(`${r.storyShare} moments change something`)
    return bits
  },

  scope_estimator: r => {
    const bits = []
    if (num(r.words)) bits.push(`${num(r.words)} words`)
    if (r.timeline) bits.push(String(r.timeline))
    return bits
  },
}

/** The reason a tool flagged this one, with the HOT: marker taken off. */
export function hotReason(lead) {
  if (!lead?.hot || !lead.message) return null
  const m = String(lead.message).match(/^\s*HOT:\s*(.+)$/is)
  return m ? m[1].trim().split('\n')[0].slice(0, 200) : null
}

/** The message with the HOT: marker taken off, for showing as what they said. */
export function plainMessage(lead) {
  if (!lead?.message) return null
  return String(lead.message).replace(/^\s*HOT:\s*/i, '').trim() || null
}

/**
 * @returns {string} e.g. "Readiness Scorecard · 44/60 · memoir · 3 months away"
 */
export function describe(lead) {
  if (!lead) return ''
  const parts = [formTypeLabel(lead.formType)]

  const summary = SUMMARIES[lead.formType]
  const result = lead.result && typeof lead.result === 'object' ? lead.result : null
  if (summary && result) {
    try {
      parts.push(...summary(result).filter(Boolean))
    } catch {
      // A result shape that changed under us must not break the inbox.
    }
  }

  if (lead.segment) parts.push(lead.segment)

  const reason = hotReason(lead)
  if (reason) parts.push(reason)
  else {
    const said = plainMessage(lead)
    if (said) parts.push(said.length > 80 ? `${said.slice(0, 80)}…` : said)
  }

  return parts.join(' · ')
}

/**
 * The answers a tool collected, as label/value pairs, for the lead page.
 * Only the shapes the shipped tools actually send are unpacked.
 */
export function answerList(lead) {
  const r = lead?.result
  if (!r || typeof r !== 'object') return []
  if (Array.isArray(r.answers)) {
    return r.answers
      .filter(a => a && a.q)
      .map(a => ({ label: String(a.q), value: a.a == null ? 'skipped' : String(a.a) }))
  }
  if (Array.isArray(r.entries)) {
    return r.entries
      .filter(Boolean)
      .map(e => ({
        label: [e.kind, e.when].filter(Boolean).join(' · ') || 'moment',
        value: [e.title, e.changed].filter(Boolean).join(' — '),
      }))
  }
  return []
}

/** Where they were when they first arrived, in one line. */
export function describeSource(lead) {
  if (!lead) return ''
  const bits = []
  if (lead.utmSource) bits.push(lead.utmSource)
  else if (lead.referrer) {
    try {
      bits.push(new URL(lead.referrer).hostname.replace(/^www\./, ''))
    } catch {
      bits.push(lead.referrer.slice(0, 40))
    }
  } else bits.push('direct')
  if (lead.utmCampaign) bits.push(lead.utmCampaign)
  if (lead.landingPath && lead.landingPath !== '/') bits.push(`landed on ${lead.landingPath}`)
  return bits.join(' · ')
}
