/**
 * The one place a lead can enter the system.
 *
 * Every form, every tool, the contact page and the consultation page all end
 * up in this function. That is the point: scoring, spam, dedup, consent and
 * attribution are decided once, so there is no second path where one of them
 * was forgotten.
 */
import prisma from '../prisma.js'
import { SOURCES, SOURCE_FORM_TYPE, FORM_TYPES, scoreLead, guessSegment } from './scoring.js'
import { normalizePhone } from './phone.js'
import { checkSpam } from './spam.js'
import { alertLeadArrived } from './notify.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** How far back a matching phone or email counts as the same person. */
const DEDUP_DAYS = 90

const str = (v, max) => (v == null ? null : String(v).trim().slice(0, max) || null)

/**
 * A ticked checkbox arrives as the boolean `true` from JSON but as the string
 * "true" or "on" from a plain HTML form. Only those three count: anything
 * else, including the string "false", is no consent.
 */
const ticked = v => v === true || v === 'true' || v === 'on' || v === '1'

/**
 * @param {object} input  Whatever the form sent.
 * @param {object} ctx    { userAgent, baseUrl }
 * @returns {Promise<{ ok: true, id: string, repeat: boolean, junk: boolean }
 *                  | { ok: false, status: number, message: string }>}
 */
export async function intake(input = {}, ctx = {}) {
  const source = str(input.source, 60)
  if (!source || !SOURCES.has(source)) {
    return { ok: false, status: 400, message: 'Unknown source.' }
  }

  // The source decides the form type. A caller cannot name its own: the score
  // is an internal ordering, so letting a public form choose it would let
  // anyone put themselves at the top of the call list.
  const formType = SOURCE_FORM_TYPE[source]

  const name    = str(input.name, 200)
  const message = str(input.message, 4000)
  const email   = input.email ? String(input.email).toLowerCase().trim().slice(0, 320) : null

  if (email && !EMAIL.test(email)) {
    return { ok: false, status: 400, message: 'That email address does not look right.' }
  }

  let phone = null
  let phoneCc = null
  if (input.phone && String(input.phone).trim()) {
    const p = normalizePhone(input.phoneCc ?? '+1', input.phone)
    if (!p.ok) return { ok: false, status: 400, message: p.reason }
    phone = p.phone
    phoneCc = p.cc
  }

  if (!email && !phone) {
    return { ok: false, status: 400, message: 'Give us an email address or a phone number.' }
  }

  // A callback request with no number cannot be answered, so it is rejected
  // at the door rather than stored as a lead nobody can act on.
  if (formType === 'call_now' && !phone) {
    return { ok: false, status: 400, message: 'A phone number is required to be called back.' }
  }

  const result = input.result && typeof input.result === 'object' ? input.result : null
  const { score, hot } = scoreLead({ formType, message })
  const segment = guessSegment({ message, result })

  // Spam is stored as JUNK rather than dropped. A bot sees the same response
  // either way, and a wrongly flagged author is recoverable in HQ instead of
  // being silently thrown away.
  const spam = checkSpam({ name, email, phone, message, honeypot: input.company })
  const status = spam.spam ? 'JUNK' : 'NEW'

  const first = firstTouch(input)

  const existing = await findExisting({ email, phone })

  let lead
  let repeat = false

  if (existing) {
    repeat = true
    lead = await prisma.lead.update({
      where: { id: existing.id },
      data: {
        // Keep the best contact details we have ever had.
        name:    existing.name ?? name,
        email:   existing.email ?? email,
        phone:   existing.phone ?? phone,
        phoneCc: existing.phoneCc ?? phoneCc,
        // Latest ask wins: it is what the caller should open with.
        source,
        formType,
        message: message ?? existing.message,
        result:  result ?? undefined,
        segment: segment ?? existing.segment,
        // The warmest thing they have ever done, not the most recent.
        score: Math.max(existing.score, score),
        hot:   existing.hot || hot,
        // Consent is additive and never withdrawn by a later form that
        // happened not to ask.
        consent: existing.consent || ticked(input.consent),
        // First touch stays first touch.
        ...onlyIfMissing(existing, first),
        // A repeat never reopens a closed lead, but a NEW one stays NEW.
        status: existing.status === 'JUNK' ? 'JUNK' : existing.status,
        userAgent: str(ctx.userAgent, 500) ?? existing.userAgent,
      },
    })
    await prisma.leadEvent.create({
      data: {
        leadId: lead.id,
        kind: 'repeat',
        actor: 'system',
        detail: `Came back through ${source}${spam.spam ? ` (flagged: ${spam.reason})` : ''}`,
      },
    })
  } else {
    lead = await prisma.lead.create({
      data: {
        name, email, phone, phoneCc,
        source, formType, message,
        result: result ?? undefined,
        segment, score, hot, status,
        consent: ticked(input.consent),
        ...first,
        userAgent: str(ctx.userAgent, 500),
      },
    })
    await prisma.leadEvent.create({
      data: {
        leadId: lead.id,
        kind: 'created',
        actor: 'system',
        detail: spam.spam ? `Flagged as junk: ${spam.reason}` : `Arrived through ${source}`,
      },
    })
  }

  // Junk raises nobody's phone.
  if (!spam.spam) {
    const alert = await alertLeadArrived(lead, { baseUrl: ctx.baseUrl })
    await prisma.leadEvent
      .create({
        data: {
          leadId: lead.id,
          kind: alert.sent ? 'alert_sent' : 'alert_skipped',
          actor: 'system',
          detail: alert.reason ?? null,
        },
      })
      .catch(() => {
        /* The lead is saved; losing its bookkeeping row must not fail the reply. */
      })
  }

  return { ok: true, id: lead.id, repeat, junk: spam.spam }
}

/** The same person, if we have met them inside the dedup window. */
async function findExisting({ email, phone }) {
  const or = []
  if (phone) or.push({ phone })
  if (email) or.push({ email })
  if (!or.length) return null
  const since = new Date(Date.now() - DEDUP_DAYS * 24 * 60 * 60 * 1000)
  return prisma.lead.findFirst({
    where: { OR: or, createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * The attribution the page captured on this visitor's very first pageview.
 * The client sends it with every form; the server trusts it only as a label
 * and never as anything that grants access.
 */
function firstTouch(input) {
  const a = input.attribution && typeof input.attribution === 'object' ? input.attribution : input
  return {
    landingPath: str(a.landingPath, 500),
    referrer:    str(a.referrer, 500),
    utmSource:   str(a.utmSource, 120),
    utmMedium:   str(a.utmMedium, 120),
    utmCampaign: str(a.utmCampaign, 120),
    utmTerm:     str(a.utmTerm, 120),
    utmContent:  str(a.utmContent, 120),
    visitorId:   str(a.visitorId, 64),
  }
}

/** Fill an attribution field only where the stored lead has none. */
function onlyIfMissing(existing, incoming) {
  const out = {}
  for (const [k, v] of Object.entries(incoming)) {
    if (v != null && existing[k] == null) out[k] = v
  }
  return out
}

export { FORM_TYPES }
