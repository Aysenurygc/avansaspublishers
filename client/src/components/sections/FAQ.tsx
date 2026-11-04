import { useState } from 'react'

export const faqs = [
  { q: 'Who owns the book?',            a: 'You do. The copyright, the royalties and the credit are yours. We sign an NDA and we never claim authorship.' },
  { q: 'How long does it take?',        a: 'A 50,000-word book runs three to five months from kickoff to final manuscript. Your contract carries a date, not an estimate.' },
  { q: 'Who writes it?',                a: 'We shortlist two or three writers with real experience in your genre and send you their work. You pick. If it is not right, you pick again.' },
  { q: "What if I don't like the draft?", a: 'Revisions are unlimited until it is right. If we still cannot get there, you get a refund.' },
  { q: 'Where does it sell?',           a: 'Amazon KDP, IngramSpark, Barnes & Noble Press, Apple Books, Kobo and Google Play, plus up to 150 further retailers depending on the package.' },
  { q: 'Can I pay in stages?',          a: 'Yes. Half to start, a quarter at the midpoint, a quarter on delivery. Longer plans on request for larger projects.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="band">
      <div className="wrap">
        <div className="sh">
          <span className="n num">06</span>
          <h2>Questions, answered plainly</h2>
        </div>

        <div className="rule-t max-w-[860px]">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q} className="hair-b">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left flex items-center justify-between gap-4 py-5"
                  style={{ fontStretch: '80%', fontWeight: 650, fontSize: '1rem' }}
                >
                  {f.q}
                  <span className="relative flex-none w-[15px] h-[15px]" aria-hidden="true">
                    <span className="absolute left-0 top-[6.5px] w-[15px] h-0.5" style={{ background: 'var(--ink)' }} />
                    <span
                      className="absolute left-[6.5px] top-0 w-0.5 h-[15px] transition-transform duration-200"
                      style={{ background: 'var(--ink)', transform: isOpen ? 'scaleY(0)' : 'scaleY(1)' }}
                    />
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-[max-height] duration-300"
                  style={{ maxHeight: isOpen ? 340 : 0 }}
                >
                  <p className="pb-5 text-muted text-[.93rem] leading-[1.62] max-w-[62ch]">{f.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
