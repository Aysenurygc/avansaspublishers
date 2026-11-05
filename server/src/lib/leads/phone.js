/**
 * Turning a dial code and whatever someone typed into one storable number.
 *
 * This checks shape, not existence. It cannot tell a real number from a
 * well-formed invented one — only a carrier lookup can, and the house has no
 * reason to buy one. So a stored number means "this could be dialled", and
 * the person dialling finds out the rest.
 *
 * Deliberately no libphonenumber: it would add a metadata bundle and a
 * dependency to gain per-carrier length rules that nobody here acts on.
 */

/**
 * The dial codes offered in the select. The house sells into the United States
 * first, then the UK, Canada, Australia and New Zealand, so those lead; the
 * rest are there so a visitor from elsewhere is not turned away at the field.
 *
 * `trunk` is the national prefix a local writes but an international dial
 * drops — 020 7946 0018 is dialled as +44 20 7946 0018.
 */
export const DIAL_CODES = [
  { iso: 'US', name: 'United States',  cc: '+1',   trunk: null, min: 10, max: 10 },
  { iso: 'CA', name: 'Canada',         cc: '+1',   trunk: null, min: 10, max: 10 },
  { iso: 'GB', name: 'United Kingdom', cc: '+44',  trunk: '0',  min: 9,  max: 10 },
  { iso: 'AU', name: 'Australia',      cc: '+61',  trunk: '0',  min: 9,  max: 9 },
  { iso: 'NZ', name: 'New Zealand',    cc: '+64',  trunk: '0',  min: 8,  max: 10 },
  { iso: 'IE', name: 'Ireland',        cc: '+353', trunk: '0',  min: 7,  max: 9 },
  { iso: 'TR', name: 'Türkiye',        cc: '+90',  trunk: '0',  min: 10, max: 10 },
  { iso: 'DE', name: 'Germany',        cc: '+49',  trunk: '0',  min: 6,  max: 12 },
  { iso: 'FR', name: 'France',         cc: '+33',  trunk: '0',  min: 9,  max: 9 },
  { iso: 'NL', name: 'Netherlands',    cc: '+31',  trunk: '0',  min: 9,  max: 9 },
  { iso: 'ES', name: 'Spain',          cc: '+34',  trunk: null, min: 9,  max: 9 },
  { iso: 'IT', name: 'Italy',          cc: '+39',  trunk: null, min: 6,  max: 11 },
  { iso: 'AE', name: 'United Arab Emirates', cc: '+971', trunk: '0', min: 8, max: 9 },
  { iso: 'SG', name: 'Singapore',      cc: '+65',  trunk: null, min: 8,  max: 8 },
  { iso: 'ZA', name: 'South Africa',   cc: '+27',  trunk: '0',  min: 9,  max: 9 },
  { iso: 'IN', name: 'India',          cc: '+91',  trunk: '0',  min: 10, max: 10 },
]

const BY_CC = DIAL_CODES.reduce((acc, c) => {
  // +1 is both US and CA; the first entry wins, and its rules are identical.
  if (!acc[c.cc]) acc[c.cc] = c
  return acc
}, {})

export function isKnownDialCode(cc) {
  return Object.prototype.hasOwnProperty.call(BY_CC, String(cc))
}

/** Digits only, with a leading international prefix or dial code shaken off. */
function nationalDigits(raw, ccDigits, trunk) {
  let d = String(raw).replace(/\D+/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (ccDigits && d.startsWith(ccDigits) && d.length > ccDigits.length + 5) {
    d = d.slice(ccDigits.length)
  }
  if (trunk && d.startsWith(trunk)) d = d.slice(trunk.length)
  return d
}

/** A number that is the same digit over and over, or a straight run. */
function looksFabricated(d) {
  if (/^(\d)\1+$/.test(d)) return true
  if ('01234567890'.includes(d) || '09876543210'.includes(d)) return true
  return false
}

/**
 * @returns {{ ok: true, phone: string, cc: string, national: string }
 *          | { ok: false, reason: string }}
 */
export function normalizePhone(cc, raw) {
  const code = String(cc ?? '').trim()
  if (!isKnownDialCode(code)) return { ok: false, reason: 'Choose a country code.' }
  if (!raw || !String(raw).trim()) return { ok: false, reason: 'A phone number is required.' }

  const spec = BY_CC[code]
  const ccDigits = code.replace(/\D+/g, '')
  const national = nationalDigits(raw, ccDigits, spec.trunk)

  if (!national) return { ok: false, reason: 'That number has no digits in it.' }
  if (national.length < spec.min || national.length > spec.max) {
    return {
      ok: false,
      reason: `A ${spec.name} number is ${
        spec.min === spec.max ? `${spec.min} digits` : `${spec.min}–${spec.max} digits`
      } after the country code.`,
    }
  }
  // E.164 allows 15 digits in total, country code included.
  if (ccDigits.length + national.length > 15) {
    return { ok: false, reason: 'That number is too long to be dialled.' }
  }
  if (looksFabricated(national)) return { ok: false, reason: 'That does not look like a real number.' }

  return { ok: true, phone: `${code}${national}`, cc: code, national }
}

/** Dial codes longest first, so +44 is tried before +4 could ever match. */
const CODES_BY_LENGTH = [...new Set(DIAL_CODES.map(c => c.cc))].sort((a, b) => b.length - a.length)

/**
 * For display in HQ: +1 415 555 0132 rather than +14155550132.
 *
 * The country code is matched against the known list rather than taken as
 * "one to three digits": a greedy match turns +44 20 7946 0018 into +442,
 * which is not a country and makes the number unreadable.
 */
export function formatPhone(phone) {
  if (!phone) return ''
  const s = String(phone)
  const cc = CODES_BY_LENGTH.find(c => s.startsWith(c))
  if (!cc) return s
  const rest = s.slice(cc.length)
  if (!/^\d+$/.test(rest)) return s
  const groups = rest.length === 10 ? [3, 3, 4] : rest.length === 9 ? [3, 3, 3] : [4, 4, 4]
  const out = []
  let i = 0
  for (const g of groups) {
    if (i >= rest.length) break
    out.push(rest.slice(i, i + g))
    i += g
  }
  if (i < rest.length) out.push(rest.slice(i))
  return `${cc} ${out.join(' ')}`
}
