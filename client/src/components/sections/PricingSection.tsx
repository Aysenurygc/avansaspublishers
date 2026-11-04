import { Link } from 'react-router-dom'

export const tiers = [
  {
    name: 'Essentials', tag: 'A first book, done properly.', price: 1249, pick: false,
    features: ['Up to 30,000 words', 'Ghostwriting', 'One revision round', 'Cover design', 'EPUB formatting', 'Amazon KDP publishing', 'Email support'],
  },
  {
    name: 'Professional', tag: 'The full book, start to launch.', price: 3499, pick: true,
    features: ['Up to 60,000 words', 'Ghostwriting and editing', 'Unlimited revisions', 'Cover, interior and spine', 'Print and digital formats', 'KDP, IngramSpark, B&N', 'Author site, five pages', 'Launch marketing kit', 'Priority support'],
  },
  {
    name: 'Premier', tag: 'Everything, with a named lead.', price: 8849, pick: false,
    features: ['No word limit', 'Senior writer and full edit', 'Unlimited revisions', 'All formats', '150+ retailers', 'Audiobook production', 'Six-month campaign', 'Press outreach', 'Named account lead'],
  },
]

export function TierCard({ tier }: { tier: typeof tiers[number] }) {
  return (
    <div
      className={`flex flex-col p-6 sm:p-7 ${tier.pick ? 'inv' : ''}`}
      style={{ border: '2px solid var(--ink)' }}
    >
      {tier.pick && (
        <span
          className="self-start mb-4 px-2.5 py-1 lbl"
          style={{ background: 'var(--inv-ink)', color: 'var(--inv-ground)', fontSize: '.6rem', letterSpacing: '.1em' }}
        >
          Most chosen
        </span>
      )}
      <h3 className="text-[1.6rem] mb-1.5">{tier.name}</h3>
      <p className={`text-[.88rem] mb-5 ${tier.pick ? 'inv-muted' : 'text-muted'}`}>{tier.tag}</p>

      <div className="flex items-baseline gap-1.5 mb-5">
        <span style={{ fontStretch: '62%', fontWeight: 850, fontSize: '2.9rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          ${tier.price.toLocaleString()}
        </span>
        <span className="lbl pb-1" style={{ fontSize: '.62rem' }}>from</span>
      </div>

      <ul className="flex-1 mb-6" role="list">
        {tier.features.map(f => (
          <li
            key={f}
            className="py-2.5 text-[.88rem] leading-[1.4] last:border-b-0"
            style={{ borderBottom: `1px solid ${tier.pick ? 'rgba(128,128,128,.35)' : 'var(--hairline)'}` }}
          >
            {f}
          </li>
        ))}
      </ul>

      <Link
        to="/consultation"
        className="block text-center py-3.5 lbl border-2"
        style={
          tier.pick
            ? { background: 'var(--inv-ink)', color: 'var(--inv-ground)', borderColor: 'var(--inv-ink)', fontSize: '.76rem' }
            : { borderColor: 'var(--ink)', fontSize: '.76rem' }
        }
      >
        Choose
      </Link>
    </div>
  )
}

export default function PricingSection() {
  return (
    <section className="band">
      <div className="wrap">
        <div className="sh">
          <span className="n num">05</span>
          <h2>Fixed price. Written scope. No surprises.</h2>
          <p className="sub">Every package is quoted in writing before work starts, and split into staged payments.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-0.5 items-stretch">
          {tiers.map(t => <TierCard key={t.name} tier={t} />)}
        </div>

        <p className="mt-6 text-muted text-[.86rem]">
          Split payments on every package. If we cannot do the book justice, we will tell you before you pay.
        </p>
      </div>
    </section>
  )
}
