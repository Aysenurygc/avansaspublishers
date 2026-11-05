/**
 * First-touch attribution.
 *
 * Captured on the first pageview of a visit and never overwritten, because
 * what we want to know is what *brought* someone, not which page they were on
 * when they finally filled something in. Last-touch would credit /tools for
 * every lead and tell us nothing about where to put the next month's work.
 *
 * Every read and write is wrapped: localStorage throws in a private window
 * and comes back empty when site data is cleared, and a page that cannot
 * remember where a visitor came from must still take their phone number.
 */

const KEY = 'avansas.attribution'

export type Attribution = {
  visitorId: string
  landingPath: string
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmTerm: string | null
  utmContent: string | null
  capturedAt: string
}

function newVisitorId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  } catch {
    /* fall through */
  }
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Instagram and Facebook open links in their own in-app browser, which sends
 * no referrer. Without this, every lead from a reel lands in HQ as "direct"
 * and the channel that produced it is invisible.
 */
function inAppSource(ua: string): string | null {
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'facebook'
  if (/LinkedInApp/i.test(ua)) return 'linkedin'
  if (/TikTok|BytedanceWebview/i.test(ua)) return 'tiktok'
  return null
}

function read(): Attribution | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Attribution>
    return parsed && typeof parsed.visitorId === 'string' ? (parsed as Attribution) : null
  } catch {
    return null
  }
}

function capture(): Attribution {
  const params = new URLSearchParams(window.location.search)
  const ua = navigator.userAgent || ''
  const referrer = document.referrer || null

  // A referrer from our own domain means this is not the first page of the
  // visit — it is an internal click — so it is not recorded as a source.
  let external: string | null = referrer
  try {
    if (referrer && new URL(referrer).hostname === window.location.hostname) external = null
  } catch {
    /* keep the raw string */
  }

  const param = (k: string) => params.get(k)?.slice(0, 120) || null

  return {
    visitorId: newVisitorId(),
    landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
    referrer: external?.slice(0, 500) ?? null,
    utmSource: param('utm_source') ?? inAppSource(ua),
    utmMedium: param('utm_medium'),
    utmCampaign: param('utm_campaign') ?? param('r'),
    utmTerm: param('utm_term'),
    utmContent: param('utm_content'),
    capturedAt: new Date().toISOString(),
  }
}

/** Call once, as early as possible. Safe to call again; it will not overwrite. */
export function initCapture(): Attribution {
  const existing = read()
  if (existing) return existing
  const fresh = capture()
  try {
    localStorage.setItem(KEY, JSON.stringify(fresh))
  } catch {
    /* A visitor who blocks storage is still a visitor; the lead just arrives
       with whatever this pageview knows and no visitor id continuity. */
  }
  return fresh
}

/** What every form sends along with what the visitor typed. */
export function attribution(): Attribution {
  return read() ?? initCapture()
}
