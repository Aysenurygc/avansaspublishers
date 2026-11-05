/**
 * Telling the people who make the calls that someone is waiting.
 *
 * The house has no email transport wired yet, so this is built as a seam: set
 * RESEND_API_KEY, LEAD_ALERT_FROM and LEAD_ALERT_TO and alerts start sending
 * with no code change. Until then every alert is written to stdout, which
 * Railway keeps, and recorded against the lead as `alert_skipped` so nobody
 * later mistakes an unsent alert for an unanswered one.
 *
 * This only ever emails the house about its own leads. It never emails the
 * visitor: that needs a confirmation and an unsubscribe path, and sending
 * marketing mail before those exist is the thing CAN-SPAM and the UK's PECR
 * actually penalise. Visitor mail goes through its own module when it exists.
 *
 * No dependency: Node's global fetch is enough for Resend's HTTP API.
 */
import { describe, describeSource, hotReason } from './describe.js'
import { formatPhone } from './phone.js'

const KEY  = () => process.env.RESEND_API_KEY
const FROM = () => process.env.LEAD_ALERT_FROM
const TO   = () =>
  (process.env.LEAD_ALERT_TO ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

export function alertsConfigured() {
  return Boolean(KEY() && FROM() && TO().length)
}

function subject(lead) {
  const who = lead.name || lead.email || formatPhone(lead.phone) || 'Someone'
  return `${lead.hot ? '[HOT] ' : ''}${who} — ${describe(lead).slice(0, 90)}`
}

function body(lead, baseUrl) {
  const lines = [
    lead.hot ? `HOT (${lead.score}) — ${hotReason(lead) ?? 'flagged by the tool'}` : `Score ${lead.score}`,
    '',
    `Name:    ${lead.name ?? '—'}`,
    `Phone:   ${lead.phone ? formatPhone(lead.phone) : '—'}`,
    `Email:   ${lead.email ?? '—'}`,
    `Asked:   ${describe(lead)}`,
    `Came by: ${describeSource(lead)}`,
    `Consent: ${lead.consent ? 'yes, marketing opt-in' : 'no marketing opt-in'}`,
  ]
  if (baseUrl) lines.push('', `Open in HQ: ${baseUrl}/hq/lead/${lead.id}`)
  lines.push(
    '',
    'Call this person. Do not send them a sequence.',
  )
  return lines.join('\n')
}

/**
 * Never throws and never rejects: a failed alert must not fail the submission
 * the visitor just made. The lead is already saved by the time this runs.
 *
 * @returns {Promise<{ sent: boolean, reason?: string }>}
 */
export async function alertLeadArrived(lead, { baseUrl } = {}) {
  const line = `[lead] ${lead.hot ? 'HOT ' : ''}${lead.score} ${lead.formType} ${
    lead.phone ? formatPhone(lead.phone) : lead.email ?? 'no contact'
  } — ${describe(lead)}`

  if (!alertsConfigured()) {
    console.log(`${line}  (no alert transport configured)`)
    return { sent: false, reason: 'no transport configured' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM(),
        to: TO(),
        subject: subject(lead),
        text: body(lead, baseUrl),
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`${line}  (alert failed ${res.status}: ${detail.slice(0, 200)})`)
      return { sent: false, reason: `resend ${res.status}` }
    }
    console.log(line)
    return { sent: true }
  } catch (err) {
    console.error(`${line}  (alert error: ${err.message})`)
    return { sent: false, reason: err.message }
  }
}
