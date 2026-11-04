import PageHead from '@/components/layout/PageHead'
import CTA from '@/components/sections/CTA'
import { steps } from '@/components/sections/Process'

const principles = [
  { n: '01', title: 'Author first',  desc: 'Your book, your credit, your royalties. Always. We exist to serve your vision, not to shape it into ours.' },
  { n: '02', title: 'Say the price', desc: 'A written scope and a fixed number before any work starts. No hourly billing, no scope creep conversations.' },
  { n: '03', title: 'Say no',        desc: 'If a book is not ready, or we are not the right house for it, we say so. A house that never declines is not editing.' },
  { n: '04', title: 'Finish things', desc: 'Every stage carries a date. Most books stall because nobody owns the next step. Someone here always does.' },
]

export default function About() {
  return (
    <>
      <PageHead
        n="04"
        title="The house"
        sub="Avansas is a publishing house for authors with something to say. We write, edit, design, publish and market books, and we give the spine as much attention as the cover."
      />

      <section className="band panel">
        <div className="wrap">
          <div className="sh">
            <span className="n num">01</span>
            <h2>What we hold to</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {principles.map(p => (
              <div key={p.n} className="grid grid-cols-[52px_1fr] gap-4 py-5 hair-b items-baseline">
                <span className="num text-muted">{p.n}</span>
                <div>
                  <h3 className="text-[1.15rem] mb-2">{p.title}</h3>
                  <p className="text-muted text-[.92rem] leading-[1.55]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="sh">
            <span className="n num">02</span>
            <h2>Five steps. You approve each one.</h2>
            <p className="sub">Nothing moves to the next stage until you sign off on the last.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-0.5">
            {steps.map(s => (
              <div key={s.n} className="py-5 border-t border-hairline lg:border-t-0 lg:py-6 lg:pr-[18px]">
                <div className="hidden lg:block h-2.5 mb-[18px]" style={{ background: 'var(--ink)' }} />
                <span className="num text-muted block mb-2">{s.n}</span>
                <h4 className="text-[1.06rem] mb-2">{s.title}</h4>
                <p className="text-[.88rem] text-muted leading-[1.5]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band-tight pb-20">
        <div className="wrap">
          <div className="sh">
            <span className="n num">03</span>
            <h2>Who you deal with</h2>
            <p className="sub">
              We have not published the team page yet. When we do it will carry real names and real
              credits, not stock portraits. Until then you will meet your editor on the first call.
            </p>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
