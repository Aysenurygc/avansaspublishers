import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Do I keep 100% ownership of my book?',
    a: 'Absolutely. You own 100% of the copyright, royalties, and all rights to your book. We sign a strict NDA and never claim authorship or rights to your work.',
  },
  {
    q: 'How long does ghostwriting take?',
    a: 'Timelines depend on scope. A 50,000-word book typically takes 3–5 months from kickoff to final manuscript. Rush options are available. You receive a guaranteed completion date in your contract.',
  },
  {
    q: 'How do you match me with the right writer?',
    a: 'We review your project brief, preferred tone, and sample materials, then handpick 2–3 writers from our vetted team with experience in your genre. You choose who you work with.',
  },
  {
    q: 'What if I\'m not satisfied with the work?',
    a: 'We offer unlimited revisions until you are 100% satisfied. If we are unable to meet your expectations, you receive a full refund — guaranteed. We\'ve never had a project end without resolution.',
  },
  {
    q: 'Where will my book be published?',
    a: 'We publish to Amazon KDP, IngramSpark, Barnes & Noble Press, Apple Books, Kobo, Google Play Books, and 150+ additional retailers depending on your package.',
  },
  {
    q: 'Do you offer payment plans?',
    a: 'Yes. All packages include split payment options — typically 50% to start, 25% at midpoint, and 25% upon completion. Extended payment plans are available for larger projects.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section-padding bg-dark-800">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">FAQ</p>
          <h2 className="section-title mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-dark-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-dark-700 transition-colors">
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <ChevronDown className={cn('w-5 h-5 text-primary-400 flex-shrink-0 transition-transform', open === i && 'rotate-180')} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-dark-600 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
