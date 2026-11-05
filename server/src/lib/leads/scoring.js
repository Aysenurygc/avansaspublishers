/**
 * What each kind of submission is worth, and what makes one hot.
 *
 * The numbers are an ordering, not a probability: they exist so that the
 * person who makes the calls works down the list in the right order. They are
 * not evidence of anything and must never be shown to a visitor.
 *
 * `hotScore` applies when the tool itself decided this particular answer was
 * hot, by putting `HOT: <reason>` at the front of the message. The tool knows
 * what hot means for its own questions; this file only knows the ordering.
 */
export const FORM_TYPES = {
  /** The hottest thing a stranger can do: ask to be phoned. */
  call_now: { score: 99, hotScore: 99, alwaysHot: true, label: 'Just call me' },
  consultation: { score: 95, hotScore: 97, label: 'Consultation request' },
  scope_estimator: { score: 90, hotScore: 96, label: 'Scope Estimator' },
  readiness_scorecard: { score: 88, hotScore: 95, label: 'Readiness Scorecard' },
  opening_pages: { score: 86, hotScore: 93, label: 'Opening Pages Appraisal' },
  memoir_map: { score: 85, hotScore: 92, label: 'Memoir Story Mapper' },
  book_triage: { score: 84, hotScore: 91, label: 'Is It a Book?' },
  contact: { score: 60, hotScore: 75, label: 'Contact form' },
}

/** The source slugs the four shipped tools post under, mapped to a form type. */
export const SOURCE_FORM_TYPE = {
  'book-readiness-scorecard': 'readiness_scorecard',
  'is-it-a-book': 'book_triage',
  'opening-pages-appraisal': 'opening_pages',
  'memoir-story-mapper': 'memoir_map',
  'scope-cost-estimator': 'scope_estimator',
  'call-me': 'call_now',
  contact: 'contact',
  consultation: 'consultation',
}

export const SOURCES = new Set(Object.keys(SOURCE_FORM_TYPE))

/** The prefix a tool uses to say "this one matters", and the rest is the reason. */
const HOT_PREFIX = /^\s*HOT:\s*/i

export function isHotMessage(message) {
  return typeof message === 'string' && HOT_PREFIX.test(message)
}

/**
 * Score a submission.
 *
 * An unknown form type scores 50 rather than throwing: a lead that arrives
 * under a name this file has not learned yet is still a person who asked for
 * something, and losing it would be worse than mis-ordering it.
 */
export function scoreLead({ formType, message }) {
  const spec = FORM_TYPES[formType]
  const hot = Boolean(spec?.alwaysHot) || isHotMessage(message)
  if (!spec) return { score: 50, hot, label: formType }
  return { score: hot ? spec.hotScore : spec.score, hot, label: spec.label }
}

export function formTypeLabel(formType) {
  return FORM_TYPES[formType]?.label ?? formType
}

/**
 * Guess which part of the house a lead belongs to, from what they typed.
 *
 * A guess, and labelled as one everywhere it is shown: it only decides which
 * editor sees the row first, never what anybody is told.
 */
const SEGMENT_HINTS = [
  ['memoir', /\b(memoir|autobiograph|my life|my own story|growing up|childhood|survived)\b/i],
  ['authority', /\b(founder|co-?founder|ceo|executive|coach|consultant|speaker|keynote|thought leader|business book|my firm|my company|my clients|practice)\b/i],
  ['fiction', /\b(novel|fiction|thriller|romance|fantasy|sci-?fi|science fiction|short stor|literary)\b/i],
  ['legacy', /\b(family history|legacy|grandchild|grandchildren|for my children|my father|my mother|my grandfather|my grandmother)\b/i],
]

export function guessSegment({ message, result }) {
  const hay = [message, result ? JSON.stringify(result) : ''].filter(Boolean).join(' ')
  if (!hay) return null
  for (const [segment, pattern] of SEGMENT_HINTS) if (pattern.test(hay)) return segment
  return null
}
