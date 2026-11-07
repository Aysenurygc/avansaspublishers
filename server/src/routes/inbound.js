import express, { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { intake } from '../lib/leads/intake.js'
import { CONSENT, CALLBACK_CONFIRMATION, EMAIL_CONFIRMATION } from '../lib/leads/consent.js'
import { DIAL_CODES } from '../lib/leads/phone.js'

const router = Router()

/**
 * A public endpoint on a marketing page, so it gets a tighter limit than the
 * API default. Twelve an hour from one address is generous for a person and
 * useless for a bot.
 */
const submitLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 12,
  message: { message: 'Too many submissions from this address. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Accepts a plain HTML form as well as JSON, so every form on the site still
 * works with JavaScript off or broken. The browser that posted a form gets a
 * redirect; the browser that posted JSON gets JSON.
 */
router.post(
  '/',
  submitLimit,
  express.urlencoded({ extended: false, limit: '256kb' }),
  async (req, res) => {
    const wantsHtml =
      !req.is('application/json') &&
      (req.is('application/x-www-form-urlencoded') || req.accepts(['json', 'html']) === 'html')

    try {
      const out = await intake(req.body ?? {}, {
        userAgent: req.headers['user-agent'],
        baseUrl: process.env.CLIENT_URL || null,
      })

      if (!out.ok) {
        if (wantsHtml) {
          // A code, never the prose. /thanks renders what it is given, so
          // reflecting server text there would let anyone put their own
          // sentence on the house's own domain, under its own design, by
          // sending a crafted link. The page maps the code to its own copy.
          const q = new URLSearchParams({ error: out.code ?? 'failed' })
          return res.redirect(303, `/thanks?${q}`)
        }
        return res.status(out.status).json({ message: out.message })
      }

      if (wantsHtml) {
        const q = new URLSearchParams({ for: String(req.body?.source ?? '') })
        return res.redirect(303, `/thanks?${q}`)
      }

      // `junk` is deliberately not reported back. A bot learns nothing, and a
      // wrongly flagged author is not told they look like one — the row is in
      // HQ either way.
      return res.status(201).json({ message: 'Saved.', id: out.id, repeat: out.repeat })
    } catch (err) {
      console.error('inbound failed:', err)
      if (wantsHtml) {
        const q = new URLSearchParams({ error: 'server' })
        return res.redirect(303, `/thanks?${q}`)
      }
      return res.status(500).json({ message: 'Something went wrong on our side.' })
    }
  }
)

/**
 * The consent and confirmation wording, plus the dial codes, served from the
 * same constants the stored record was made under. The page never hard-codes
 * its own copy of the consent line, so the two cannot drift apart.
 */
router.get('/wording', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=3600')
  res.json({
    consent: CONSENT,
    callbackConfirmation: CALLBACK_CONFIRMATION,
    emailConfirmation: EMAIL_CONFIRMATION,
    dialCodes: DIAL_CODES.map(({ iso, name, cc }) => ({ iso, name, cc })),
    /** Null until the house publishes a number; the page hides "call us" then. */
    phone: process.env.AVANSAS_PHONE || null,
  })
})

export default router
