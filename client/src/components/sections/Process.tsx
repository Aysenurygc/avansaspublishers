export const steps = [
  { n: '01', title: 'Call',    desc: 'Thirty minutes on your book, your reader and your deadline. No charge, no pitch deck.' },
  { n: '02', title: 'Scope',   desc: 'A written scope, a fixed price and a date, in your inbox within one working day.' },
  { n: '03', title: 'Outline', desc: 'Recorded interviews turned into a chapter map. You approve it before a word is drafted.' },
  { n: '04', title: 'Draft',   desc: 'Chapters arrive in batches. You read, mark up and approve as we go.' },
  { n: '05', title: 'Publish', desc: 'Design, files, ISBNs, upload, launch. Then the marketing starts.' },
]

export default function Process() {
  return (
    <section className="band panel">
      <div className="wrap">
        <div className="sh">
          <span className="n num">02</span>
          <h2>Five steps. You approve each one.</h2>
          <p className="sub">
            Nothing moves to the next stage until you sign off on the last. You always know where the book stands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-0.5">
          {steps.map(s => (
            <div
              key={s.n}
              className="py-5 border-t border-hairline lg:border-t-0 lg:py-6 lg:pr-[18px]"
            >
              <div className="hidden lg:block h-2.5 mb-[18px]" style={{ background: 'var(--ink)' }} />
              <span className="num text-muted block mb-2">{s.n}</span>
              <h4 className="text-[1.06rem] mb-2">{s.title}</h4>
              <p className="text-[.88rem] text-muted leading-[1.5]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
