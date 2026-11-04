import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="band inv">
      <div className="wrap">
        <h2 className="mb-5 max-w-[18ch]" style={{ fontSize: 'clamp(2.6rem, 7vw, 5.4rem)' }}>
          Your name on the cover. Ours on the spine.
        </h2>
        <p className="inv-muted text-[1.04rem] max-w-[48ch] mb-8">
          Tell us about the book. Thirty minutes, no charge, and a straight answer about whether
          we are the right house for it.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <Link
            to="/consultation"
            className="inline-block lbl px-7 py-4"
            style={{ background: 'var(--inv-ink)', color: 'var(--inv-ground)', fontSize: '.82rem' }}
          >
            Book a call
          </Link>
          <Link
            to="/contact"
            className="inline-block lbl px-6 py-3.5 border-2 border-current"
            style={{ fontSize: '.82rem' }}
          >
            Send the manuscript
          </Link>
        </div>
        <p className="lbl mt-5 opacity-60" style={{ fontSize: '.62rem', letterSpacing: '.1em' }}>
          Reply within one working day
        </p>
      </div>
    </section>
  )
}
