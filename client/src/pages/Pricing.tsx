import PageHead from '@/components/layout/PageHead'
import { tiers, TierCard } from '@/components/sections/PricingSection'
import CTA from '@/components/sections/CTA'

const addons = [
  { name: 'Structural edit',    price: 599 },
  { name: 'Audiobook',          price: 799 },
  { name: 'Author site',        price: 999 },
  { name: 'Press release',      price: 249 },
  { name: 'Advance readers',    price: 349 },
  { name: 'Social kit',         price: 199 },
  { name: 'Enhanced listing',   price: 299 },
  { name: 'Hardcover layout',   price: 149 },
]

export default function Pricing() {
  return (
    <>
      <PageHead
        n="05"
        title="Fixed price. Written scope."
        sub="Every package is quoted in writing before work starts, and split into staged payments. No retainers, no hourly billing, no surprises on the invoice."
      />

      <section className="pb-20">
        <div className="wrap">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-0.5 items-stretch">
            {tiers.map(t => <TierCard key={t.name} tier={t} />)}
          </div>
        </div>
      </section>

      <section className="band panel">
        <div className="wrap">
          <div className="sh">
            <span className="n num">06</span>
            <h2>Add-ons</h2>
            <p className="sub">Bolt any of these onto a package, or buy them on their own.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5">
            {addons.map(a => (
              <div key={a.name} className="p-5" style={{ border: '2px solid var(--ink)' }}>
                <div className="text-[.92rem] mb-2" style={{ fontStretch: '80%', fontWeight: 650 }}>{a.name}</div>
                <div className="num" style={{ fontSize: '1.1rem' }}>${a.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-muted text-[.86rem] max-w-[62ch]">
            If we cannot do the book justice, we will tell you before you pay. That has happened, and
            it will happen again.
          </p>
        </div>
      </section>

      <CTA />
    </>
  )
}
