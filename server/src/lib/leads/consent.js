/**
 * The wording shown to a visitor before we take a number, and the wording
 * shown back after. Both live here, as one constant each, because the moment
 * two copies exist one of them drifts and the drifted one is the one a
 * regulator reads.
 *
 * The client imports these through GET /api/inbound/wording, so the page and
 * the stored record always quote the same sentence.
 */

/** Goes under every phone field, unchanged. */
export const CONSENT =
  'By sending this, you agree that Avansas Publishers may call or email you ' +
  'about your book. We never sell your number.'

/**
 * Shown after a callback request.
 *
 * It deliberately promises no response time. The house does not publish
 * staffed hours, so "within an hour" would be a commitment nobody has agreed
 * to keep, and the first broken one costs more than the speed ever gained.
 */
export const CALLBACK_CONFIRMATION =
  'Your number is with us. A real person from the house will call as soon as ' +
  'one is free — not an assistant, and not a recording.'

/**
 * Shown when someone leaves an address rather than a number.
 *
 * It says we have the address, not that something has been sent, because
 * nothing is sent yet: there is no visitor-facing email transport, and a
 * screen that says "check your inbox" over an empty inbox is the first thing
 * a visitor catches us in. Change this sentence in the same commit that
 * wires sending, not before.
 */
export const EMAIL_CONFIRMATION =
  'We have it. An editor reads these — if there is something here, you will ' +
  'hear from a person, not a sequence.'
