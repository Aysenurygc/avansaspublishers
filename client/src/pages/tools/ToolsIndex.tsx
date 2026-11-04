import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import Spine from '@/components/ui/Spine'

const tools = [
  {
    n: '01',
    to: '/tools/readiness',
    title: 'Book readiness scorecard',
    spine: 'Readiness',
    tone: 'dark' as const,
    length: 'Ten questions',
    body: 'The idea, the reader, the platform, the material, the time, the budget. One of four verdicts, including not a book yet, and what to do about it.',
  },
  {
    n: '02',
    to: '/tools/is-it-a-book',
    title: 'Is it a book?',
    spine: 'Is it a book',
    tone: 'light' as const,
    length: 'Six questions',
    body: 'Whether the idea is a book, a series, a talk, an article, or not yet anything. With the reasoning, so you can argue with it.',
  },
  {
    n: '03',
    to: '/tools/opening-pages',
    title: 'Opening-pages appraisal',
    spine: 'Opening pages',
    tone: 'dark' as const,
    length: '500 to 1,000 words',
    body: 'A structural read-back of your first pages: sentence length, passive voice, adverbs, paragraphs, dialogue. Arithmetic, done in your browser.',
  },
  {
    n: '04',
    to: '/tools/memoir-map',
    title: 'Memoir story mapper',
    spine: 'Memoir map',
    tone: 'light' as const,
    length: 'As long as it takes',
    body: 'Periods, turning points, people and places, arranged into a candidate run of chapters. For your own life, or for someone else’s.',
  },
]

export default function ToolsIndex() {
  return (
    <>
      <PageHead
        n="09"
        title="Tools"
        sub="Four ways to test a book before spending anything on it. Each shows its answer on the page. Some of the answers are no."
      />

      <section className="pt-10 pb-20">
        <div className="wrap">
          <div className="flex items-end gap-[5px] mb-10" aria-hidden="true">
            {tools.map((t, i) => (
              <Spine key={t.to} title={t.spine} width={46} height={[210, 182, 232, 196][i]} tone={t.tone} />
            ))}
          </div>

          <div className="rule-t">
            {tools.map(t => (
              <div
                key={t.to}
                className="hair-b py-6 grid gap-x-6 gap-y-3 grid-cols-[2.5rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline"
              >
                <span className="num text-muted">{t.n}</span>
                <div className="min-w-0">
                  <h2 className="text-[1.6rem] sm:text-[2rem] mb-2">
                    <Link to={t.to} className="hover:opacity-80">{t.title}</Link>
                  </h2>
                  <p className="text-muted text-[.95rem] leading-[1.6] max-w-[60ch]">{t.body}</p>
                  <span className="lbl text-muted block mt-3" style={{ fontSize: '.66rem' }}>{t.length}</span>
                </div>
                <Link to={t.to} className="btn-o col-start-2 md:col-start-auto justify-self-start">Open</Link>
              </div>
            ))}
          </div>

          <p className="text-muted text-[.9rem] mt-8 max-w-[60ch]">
            Nothing here asks for an address before it answers. If you want a written copy, each tool
            offers to send one at the end.
          </p>
        </div>
      </section>
    </>
  )
}
