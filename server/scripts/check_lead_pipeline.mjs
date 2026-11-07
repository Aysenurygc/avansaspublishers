/**
 * Checks on the lead pipeline that need no database and no network.
 *
 * Run: node scripts/check_lead_pipeline.mjs   (from server/)
 *
 * The point is drift. Each rule lives in one file, but the files have to
 * agree: a source the client can post must be a source the server accepts,
 * and a form type the server scores must be a form type HQ can label. Those
 * agreements are what break silently months later, so they are asserted here
 * rather than trusted.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import { FORM_TYPES, SOURCE_FORM_TYPE, SOURCES, scoreLead, guessSegment, isHotMessage } from '../src/lib/leads/scoring.js'
import { normalizePhone, formatPhone, DIAL_CODES } from '../src/lib/leads/phone.js'
import { checkSpam } from '../src/lib/leads/spam.js'
import { describe, answerList, hotReason, plainMessage, describeSource } from '../src/lib/leads/describe.js'
import { CONSENT, CALLBACK_CONFIRMATION, EMAIL_CONFIRMATION } from '../src/lib/leads/consent.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

let pass = 0
const fails = []

function ok(label, condition, detail = '') {
  if (condition) pass++
  else fails.push(`${label}${detail ? ` — ${detail}` : ''}`)
}

function eq(label, actual, expected) {
  ok(label, actual === expected, `got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`)
}

/* ------------------------------------------------- scoring and form types */

for (const [source, formType] of Object.entries(SOURCE_FORM_TYPE)) {
  ok(`source "${source}" maps to a known form type`, formType in FORM_TYPES, formType)
}

for (const [formType, spec] of Object.entries(FORM_TYPES)) {
  ok(`${formType} has a label`, typeof spec.label === 'string' && spec.label.length > 0)
  ok(`${formType} score is in range`, spec.score > 0 && spec.score <= 99, String(spec.score))
  ok(`${formType} hotScore is not lower than score`, spec.hotScore >= spec.score)
}

ok('call_now is always hot', FORM_TYPES.call_now.alwaysHot === true)
ok(
  'call_now scores at least as high as everything else',
  Object.values(FORM_TYPES).every(s => s.hotScore <= FORM_TYPES.call_now.hotScore)
)

eq('a callback scores 99', scoreLead({ formType: 'call_now' }).score, 99)
eq('a callback is hot with no message', scoreLead({ formType: 'call_now' }).hot, true)
eq('a plain scorecard is not hot', scoreLead({ formType: 'readiness_scorecard', message: 'hello' }).hot, false)
eq('a HOT: scorecard is hot', scoreLead({ formType: 'readiness_scorecard', message: 'HOT: ready' }).hot, true)
eq(
  'a HOT: scorecard uses the hot score',
  scoreLead({ formType: 'readiness_scorecard', message: 'HOT: ready' }).score,
  FORM_TYPES.readiness_scorecard.hotScore
)
eq('an unknown form type still scores', scoreLead({ formType: 'invented' }).score, 50)
eq('HOT must be a prefix, not anywhere', isHotMessage('this is HOT: not a prefix'), false)
eq('HOT prefix is case-insensitive', isHotMessage('hot: yes'), true)

/* A visitor must not be able to pick their own score. */
const routeSrc = readFileSync(join(root, 'server/src/lib/leads/intake.js'), 'utf8')
ok(
  'intake derives formType from source and never from the request body',
  /const formType = SOURCE_FORM_TYPE\[source\]/.test(routeSrc) && !/input\.formType/.test(routeSrc)
)
ok('intake never stores an IP address', !/\breq\.ip\b|x-forwarded-for/i.test(routeSrc))

/* -------------------------------------------------------------- segments */

eq('founder reads as authority', guessSegment({ message: 'I am a founder with a business book' }), 'authority')
eq('memoir reads as memoir', guessSegment({ message: 'a memoir about growing up' }), 'memoir')
eq('a novel reads as fiction', guessSegment({ message: 'my literary novel' }), 'fiction')
eq('nothing recognisable stays null', guessSegment({ message: 'hello there' }), null)
eq('no message stays null', guessSegment({}), null)

/* ----------------------------------------------------------------- phone */

for (const c of DIAL_CODES) {
  ok(`${c.iso} dial code is well formed`, /^\+\d{1,3}$/.test(c.cc), c.cc)
  ok(`${c.iso} has a sane length range`, c.min > 0 && c.max >= c.min && c.max <= 15)
}

eq('US number normalises', normalizePhone('+1', '(415) 555-0132').phone, '+14155550132')
eq('UK trunk zero is dropped', normalizePhone('+44', '020 7946 0018').phone, '+442079460018')
eq('TR trunk zero is dropped', normalizePhone('+90', '0532 123 45 67').phone, '+905321234567')
eq('an international 00 prefix is dropped', normalizePhone('+44', '0044 20 7946 0018').phone, '+442079460018')
eq('too short is refused', normalizePhone('+1', '123').ok, false)
eq('an unknown dial code is refused', normalizePhone('+999', '4155550132').ok, false)
eq('an empty number is refused', normalizePhone('+1', '').ok, false)
eq('all one digit is refused', normalizePhone('+1', '1111111111').ok, false)

eq('a US number formats readably', formatPhone('+14155550132'), '+1 415 555 0132')
eq('a UK country code is not split', formatPhone('+442079460018').startsWith('+44 '), true)
eq('a 3-digit country code survives', formatPhone('+971501234567').startsWith('+971 '), true)
eq('a non-number passes through', formatPhone('not-a-number'), 'not-a-number')
eq('empty formats to empty', formatPhone(null), '')

/* ------------------------------------------------------------------ spam */

eq('a honeypot is spam', checkSpam({ honeypot: 'x' }).spam, true)
eq('an SEO pitch is spam', checkSpam({ message: 'we offer seo services' }).spam, true)
eq('two links is spam', checkSpam({ message: 'see http://a.com and http://b.com' }).spam, true)
eq('a burner domain is spam', checkSpam({ email: 'x@mailinator.com' }).spam, true)
eq('a 555-01xx number is spam', checkSpam({ phone: '+14155550132' }).spam, true)
eq('BBCode markup is spam', checkSpam({ message: '[url=x]buy[/url]' }).spam, true)
eq('an anchor tag is spam', checkSpam({ message: '<a href="x">buy</a>' }).spam, true)

/* The ones that must get through. A false positive here is a lost author. */
const realAuthors = [
  { name: 'Jane Okonkwo', message: 'I want to write a memoir about my mother. I have about 40,000 words.' },
  { name: 'Dr. Ayşe Yılmaz', message: 'Bir kitap yazmak istiyorum.' },
  { name: "Seán O'Brien", message: 'My book is about the firm I founded. Website is example.com if useful.' },
  { name: 'Li Wei', message: '我想写一本书' },
  { email: 'founder@acme.co', message: 'Can we talk about ghostwriting?' },
]
for (const a of realAuthors) {
  const r = checkSpam(a)
  ok(`a real author gets through: ${a.name ?? a.email}`, r.spam === false, r.reason)
}

/* ----------------------------------------------------- what a caller reads */

const shapes = {
  readiness_scorecard: { verdict: 'nearly', score: 48, max: 60, areas: {}, answers: [{ q: 'Who is it for?', a: 'A clear reader' }] },
  book_triage: { form: 'book', runnerUp: 'series', tally: {}, answers: [{ q: 'How long?', a: 'Years' }] },
  opening_pages: { words: 1240, sentences: 70, avgSentence: 17.7, dialoguePct: 22, openingSignals: ['opens on action'] },
  memoir_map: { entries: [{ kind: 'turn', title: 'Left home', when: '1998', changed: 'Everything' }], chapters: [{ title: 'Leaving' }], shape: 'begin-at-turn', storyShare: '5/9' },
}

for (const [formType, result] of Object.entries(shapes)) {
  const lead = { formType, result, segment: null, hot: false, message: null }
  const line = describe(lead)
  ok(`${formType} describes to something readable`, line.length > 10 && !line.includes('[object'), line)
  ok(`${formType} does not leak raw JSON`, !line.includes('{') && !line.includes('"'), line)
}

ok(
  'a result shape that changed does not crash the inbox',
  describe({ formType: 'readiness_scorecard', result: 'not an object' }).length > 0
)
ok('a missing result still describes', describe({ formType: 'book_triage' }).length > 0)
eq('describe survives a null lead', describe(null), '')

eq('answers unpack from a quiz', answerList({ result: shapes.readiness_scorecard }).length, 1)
eq('answers unpack from the mapper', answerList({ result: shapes.memoir_map }).length, 1)
eq('answers tolerate no result', answerList({}).length, 0)

eq('the HOT marker is stripped from the reason', hotReason({ hot: true, message: 'HOT: ready, 48/60' }), 'ready, 48/60')
eq('a cold lead has no reason', hotReason({ hot: false, message: 'HOT: x' }), null)
eq('the marker is stripped from what they said', plainMessage({ message: 'HOT: ready' }), 'ready')

eq('no attribution reads as direct', describeSource({}), 'direct')
ok('a referrer reduces to a hostname', describeSource({ referrer: 'https://www.google.com/search?q=x' }).includes('google.com'))
ok('a utm source wins over a referrer', describeSource({ utmSource: 'instagram', referrer: 'https://x.com' }) === 'instagram')

/* -------------------------------------------------------------- the words */

ok('the consent line names the house', CONSENT.includes('Avansas Publishers'))
ok('the consent line covers calling', /call/i.test(CONSENT))
ok('the consent line promises not to sell the number', /never sell/i.test(CONSENT))
ok(
  'the callback confirmation promises no response time',
  !/\b(within|in (an|\d+)|minutes?|hours?|today|immediately|right away|5|15|24)\b/i.test(CALLBACK_CONFIRMATION),
  CALLBACK_CONFIRMATION
)
ok(
  'the callback confirmation says a person calls',
  /person|editor|human/i.test(CALLBACK_CONFIRMATION)
)
ok(
  'nothing claims an email was sent while no transport exists',
  !/on its way|check your (inbox|email)|we('| ha)ve sent|sent to/i.test(EMAIL_CONFIRMATION),
  EMAIL_CONFIRMATION
)

/* ---------------------------------------------- the client agrees with us */

const apiTs = readFileSync(join(root, 'client/src/lib/api.ts'), 'utf8')
const union = apiTs.match(/export type LeadSource =([\s\S]*?)\n\n/)
ok('the client declares a LeadSource union', Boolean(union))
if (union) {
  const clientSources = [...union[1].matchAll(/'([^']+)'/g)].map(m => m[1])
  for (const s of clientSources) {
    ok(`the server accepts the client's source "${s}"`, SOURCES.has(s))
  }
  for (const s of SOURCES) {
    ok(`the client knows the server's source "${s}"`, clientSources.includes(s))
  }
}

/* The result must be on screen before anything is asked for. */
const gate = readFileSync(join(root, 'client/src/components/ui/LeadGate.tsx'), 'utf8')
ok('the gate still posts to the single intake', /'\/inbound'|leads\.submit/.test(gate))
ok('the gate sends first-touch attribution', /attribution\(\)/.test(gate))
ok('the gate has a honeypot', /name="company"/.test(gate))
ok('the marketing opt-in starts unticked', /useState\(false\)[\s\S]{0,400}consent/.test(gate) || /const \[consent, setConsent\] = useState\(false\)/.test(gate))
ok('the gate still works without JavaScript', /action="\/api\/inbound"/.test(gate) && /method="post"/.test(gate))

const callMe = readFileSync(join(root, 'client/src/components/ui/CallMe.tsx'), 'utf8')
ok('the callback form works without JavaScript', /action="\/api\/inbound"/.test(callMe) && /method="post"/.test(callMe))
ok('the callback form shows the consent line', /w\?\.consent/.test(callMe))
ok('our own number is shown only when one is published', /w\?\.phone &&/.test(callMe))

/* No invented prices or earnings anywhere in what we publish to crawlers. */
const discovery = readFileSync(join(root, 'server/src/routes/discovery.js'), 'utf8')
const llms = discovery.slice(discovery.indexOf("'# Avansas Publishers'"))
ok('llms.txt quotes no price', !/\$\s?\d/.test(llms))
ok('llms.txt makes no bestseller claim', !/bestsell|guarantee|#1\b/i.test(llms))
ok('/pricing is kept out of the sitemap', !/'\/pricing'/.test(discovery.match(/STATIC_PAGES = \[[\s\S]*?\]/)?.[0] ?? ''))

/* ------------------------------- /thanks reflects no free text ----------- */

const thanks = readFileSync(join(root, 'client/src/pages/Thanks.tsx'), 'utf8')
ok(
  '/thanks maps an error code and never prints the query string',
  /REASONS\[error\]/.test(thanks) && !/>\{error\}</.test(thanks),
  'a page that renders ?error= verbatim lets anyone put their own sentence, in our design, on our domain'
)
ok('/thanks falls back when the code is unrecognised', /\?\?\s*GENERIC/.test(thanks))

const inboundSrc = readFileSync(join(root, 'server/src/routes/inbound.js'), 'utf8')
ok(
  'the error redirect carries a code, not the server sentence',
  /error: out\.code/.test(inboundSrc) && !/error: out\.message/.test(inboundSrc)
)

for (const code of ['unknown-source', 'bad-email', 'bad-phone', 'no-contact', 'call-needs-phone']) {
  ok(`intake returns the code "${code}"`, routeSrc.includes(`'${code}'`))
  ok(`/thanks has copy for the code "${code}"`, new RegExp(`['"]?${code}['"]?\\s*:`).test(thanks))
}

/* --------------------------- HQ quotes only the visitor's own words ------ */

const hqRoute = readFileSync(join(root, 'server/src/routes/leads.js'), 'utf8')
ok(
  'a callback never reports house-written text as what the visitor said',
  /said:\s*lead\.formType === 'call_now' \? null : plainMessage\(lead\)/.test(hqRoute),
  'CallMe composes the message itself, so passing it through as `said` makes the caller quote us back to them'
)

const detail = readFileSync(join(root, 'client/src/pages/hq/LeadDetail.tsx'), 'utf8')
ok('the lead page keeps the exact consent warning', detail.includes('No marketing opt-in — reply about this request only.'))
ok('the lead page keeps one-tap calling', /href=\{`tel:/.test(detail) && /href=\{`sms:/.test(detail) && /wa\.me/.test(detail))

const hqPage = readFileSync(join(root, 'client/src/pages/hq/LeadHQ.tsx'), 'utf8')
ok('HQ refuses to render anything on 401 or 403', /if \(denied\) return <Denied \/>/.test(hqPage))
ok('the inbox search stays debounced', /setTimeout\([\s\S]{0,120}?,\s*250\)/.test(hqPage) && /clearTimeout/.test(hqPage))
ok('insights still says why it shows counts and not rates', /noise/.test(hqPage))

for (const page of [hqPage, detail]) {
  ok('no class name is built by concatenation in HQ', !/className=[{]?`[^`]*[$][{]/.test(page))
}

/* ------------------------------------------------------------------ report */

console.log(`\n${pass} checks passed`)
if (fails.length) {
  console.error(`${fails.length} FAILED:`)
  for (const f of fails) console.error(`  - ${f}`)
  process.exit(1)
}
console.log('lead pipeline: ok\n')
