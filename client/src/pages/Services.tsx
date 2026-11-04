import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import { services } from '@/components/sections/ServicesSection'
import CTA from '@/components/sections/CTA'

export default function Services() {
  return (
    <>
      <PageHead
        n="01"
        title="Services"
        sub="Eight services, each run by people who have done it before. Take one or take all of them."
      />

      <section className="pb-20">
        <div className="wrap">
          <div style={{ borderTop: '2px solid var(--ink)' }}>
            {services.map(s => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="grid gap-y-2 gap-x-4 py-6 hair-b transition-colors hover:bg-panel
                           grid-cols-[44px_minmax(0,1fr)] items-start
                           md:grid-cols-[62px_minmax(0,1.1fr)_minmax(0,2fr)_auto] md:gap-x-[22px] md:items-center"
              >
                <span className="num text-muted">{s.n}</span>
                <h3 className="text-[1.4rem]">{s.title}</h3>
                <p className="col-start-2 md:col-start-auto text-muted text-[.93rem] leading-[1.5]">{s.desc}</p>
                <span className="col-start-2 md:col-start-auto num whitespace-nowrap" style={{ fontSize: '.86rem' }}>
                  from ${s.from.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
