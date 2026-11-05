/**
 * Catching the submissions that are not people.
 *
 * Every rule here errs toward letting a lead through. A real author whose
 * message trips a filter is a lost sale; a bot that gets stored is one row
 * somebody marks JUNK in HQ. So this only rejects what is unmistakable, and
 * the rate limiter in front of the route handles volume.
 */

/** Phrases that never appear in a message about someone's own book. */
const PITCHES = [
  /\bseo (services|packages|audit|agency)\b/i,
  /\bbacklinks?\b/i,
  /\bguest post(ing)?\b/i,
  /\b(crypto|bitcoin|forex|binary options)\b/i,
  /\b(casino|betting|slots)\b/i,
  /\bloan offer\b/i,
  /\b(viagra|cialis)\b/i,
  /\bwork from home opportunit/i,
  /\bincrease your (traffic|ranking|sales) guaranteed\b/i,
  /\bi am (a|an) (digital marketer|seo expert)\b/i,
]

/** Disposable domains, kept short on purpose: the list is unwinnable, and a
 *  throwaway address on a genuine tool result is not a reason to drop it. */
const BURNER_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'yopmail.com',
  'tempmail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com',
  'dropmail.me', 'maildrop.cc',
])

function linkCount(text) {
  return (String(text).match(/https?:\/\/|www\.|\[url[=\]]/gi) || []).length
}

/**
 * @returns {{ spam: false } | { spam: true, reason: string }}
 */
export function checkSpam({ name, email, phone, message, honeypot }) {
  // A field no human sees, so anything in it was typed by something else.
  if (honeypot && String(honeypot).trim()) {
    return { spam: true, reason: 'honeypot filled' }
  }

  const text = [name, message].filter(Boolean).join(' \n ')

  // Two or more links in a message about your own book is a pitch, not a book.
  if (linkCount(text) >= 2) return { spam: true, reason: 'multiple links in message' }

  for (const p of PITCHES) {
    if (p.test(text)) return { spam: true, reason: `pitch phrase: ${p.source}` }
  }

  // BBCode or raw HTML tags in a plain text field.
  if (/\[\/?(url|link|b|i)\]|<a\s+href=/i.test(text)) {
    return { spam: true, reason: 'markup in message' }
  }

  if (email) {
    const domain = String(email).toLowerCase().split('@')[1] ?? ''
    if (BURNER_DOMAINS.has(domain)) return { spam: true, reason: `burner domain: ${domain}` }
    // A name pasted into the email field and nothing else.
    if (/\s/.test(String(email).trim())) return { spam: true, reason: 'whitespace in email' }
  }

  // Cyrillic or CJK in a name field alongside an English message is normal;
  // a message that is *only* non-Latin script with links is not. Checked
  // above by linkCount, so nothing script-based is rejected here on its own.

  // 555-0100 through 555-0199 in any North American area code is the range
  // reserved for fiction, so a number in it was copied from somewhere.
  if (phone) {
    const d = String(phone).replace(/\D/g, '')
    const nanp = d.length === 11 && d.startsWith('1') ? d.slice(1) : d
    if (nanp.length === 10 && /^\d{3}55501\d{2}$/.test(nanp)) {
      return { spam: true, reason: 'reserved 555-01xx test number' }
    }
  }

  return { spam: false }
}
