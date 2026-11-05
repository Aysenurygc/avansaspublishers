import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import LeadGate from '@/components/ui/LeadGate'
import CallMe from '@/components/ui/CallMe'
import { Choice, StepRule, BackToTools } from './shared'

type Form = 'book' | 'series' | 'talk' | 'article' | 'notyet'

type Option = { label: string; w: Partial<Record<Form, number>>; why: string }
type Question = { q: string; options: Option[] }

const questions: Question[] = [
  {
    q: 'Said out loud, start to finish, how long would it take?',
    options: [
      { label: 'Ten minutes', w: { article: 2, talk: 1 }, why: 'You can say it in ten minutes. A book would be that point, padded.' },
      { label: 'About an hour', w: { talk: 2, article: 1 }, why: 'An hour is the natural length of a talk or a long essay, not a book.' },
      { label: 'A day, with tangents', w: { book: 2, series: 1 }, why: 'A day’s worth of material, with tangents, is the raw size of a book.' },
      { label: 'I do not know yet', w: { notyet: 2 }, why: 'You do not yet know how much there is to say. That comes before choosing a form.' },
    ],
  },
  {
    q: 'Is there one thread that runs from the first page to the last?',
    options: [
      { label: 'Yes: one argument, or one story', w: { book: 2 }, why: 'One thread from start to finish is what holds a book together.' },
      { label: 'Several good pieces that stand apart', w: { series: 2, article: 1 }, why: 'Pieces that stand apart read better as a series than forced into chapters.' },
      { label: 'One sharp point', w: { article: 2, talk: 1 }, why: 'A single sharp point is strongest short. Stretched, it loses its edge.' },
      { label: 'Not sure', w: { notyet: 2 }, why: 'Without a thread, there is nothing yet to choose a form for.' },
    ],
  },
  {
    q: 'What has to happen to the reader?',
    options: [
      { label: 'Change over time: step by step, or chapter by chapter', w: { book: 2, series: 1 }, why: 'A change that happens in stages needs the length and order a book allows.' },
      { label: 'One idea needs to land, once', w: { article: 2, talk: 1 }, why: 'One idea landing once is the job of an article.' },
      { label: 'They need to be persuaded in the room', w: { talk: 2 }, why: 'Persuasion that depends on presence and timing belongs on a stage.' },
      { label: 'They need to keep up as things change', w: { series: 2 }, why: 'A reader who needs to keep up wants something that keeps arriving.' },
    ],
  },
  {
    q: 'How long does the material stay true?',
    options: [
      { label: 'Years. It is not tied to this season', w: { book: 2 }, why: 'Durable material suits a book, which is read for years after it is printed.' },
      { label: 'A year or two', w: { book: 1, article: 1 }, why: 'Material that holds for a year or two can carry a book, but only just.' },
      { label: 'It moves monthly', w: { series: 2, article: 1 }, why: 'Material that moves monthly will date a book before it is printed.' },
    ],
  },
  {
    q: 'Who asked for it?',
    options: [
      { label: 'People I work with keep asking me the same questions', w: { book: 2, series: 1 }, why: 'Repeated questions from the people you serve are the best evidence a book is wanted.' },
      { label: 'Audiences, after I speak', w: { talk: 1, book: 1 }, why: 'Audiences asking after a talk may want the talk again, or a book. Often the talk first.' },
      { label: 'My family, about the past', w: { book: 2 }, why: 'A family asking about the past is asking for a memoir, even a short one.' },
      { label: 'No one yet', w: { article: 1, notyet: 1 }, why: 'No one has asked yet. A short piece is the cheapest way to find out whether they will.' },
    ],
  },
  {
    q: 'How do you explain it best?',
    options: [
      { label: 'On the page, at length', w: { book: 1, article: 1 }, why: 'You think best at length on the page.' },
      { label: 'Speaking, to a room', w: { talk: 2 }, why: 'You explain it best out loud, which says something about where it should live first.' },
      { label: 'In instalments, as it develops', w: { series: 2 }, why: 'You work in instalments, which is how a series is built.' },
      { label: 'In conversation, with questions', w: { book: 1, talk: 1 }, why: 'You explain well in conversation. That suits a talked-out book, or a talk with questions.' },
    ],
  },
]

const forms: Form[] = ['notyet', 'article', 'talk', 'series', 'book']

const outcomes: Record<Form, { title: string; body: string; instead: string }> = {
  book: {
    title: 'A book',
    body:
      'On these answers, it is a book. There is a thread long enough to need chapters, material that will stay true, and readers who are already asking. That is the shape a book needs, and most ideas do not have it.',
    instead:
      'Before anything else, write the thread in one sentence. The readiness scorecard will tell you whether the rest is in place.',
  },
  series: {
    title: 'A series',
    body:
      'This looks like a series: a run of articles, a newsletter or a set of episodes. The pieces stand on their own and the material keeps moving. Forced into a book, it would read as a collection with a binding.',
    instead:
      'Publish the first six pieces. If, read in order, they turn out to need each other, the book is in there and you will see where.',
  },
  talk: {
    title: 'A talk',
    body:
      'This wants a room before it wants a page. It is the right length for a talk and it depends on being delivered. Many good books began as talks that were given thirty times; very few began as a book.',
    instead:
      'Give the talk. Record it. Note the questions afterwards. The questions are the chapters, if there is ever a book.',
  },
  article: {
    title: 'An article',
    body:
      'This is an article, and that is not a lesser answer. One sharp point, said once, at around 1,500 words, will do more than the same point spread over 200 pages.',
    instead:
      'Write it, publish it, and watch what people ask afterwards. If the questions outrun the article, come back.',
  },
  notyet: {
    title: 'Not yet anything',
    body:
      'It is too early to say. Not because the idea is weak, but because it has not been tested against a form. That is normal at this stage and nothing to pay anyone to fix.',
    instead:
      'Explain it to three people this month. Write down what they ask. Then take this again.',
  },
}

function triage(answers: (number | null)[]) {
  const tally: Record<Form, number> = { book: 0, series: 0, talk: 0, article: 0, notyet: 0 }
  questions.forEach((q, i) => {
    const a = answers[i]
    if (a === null) return
    const w = q.options[a].w
    for (const f of forms) tally[f] += w[f] ?? 0
  })
  // On a tie, the smaller form wins. `forms` is ordered smallest first.
  const ranked = [...forms].sort((a, b) => tally[b] - tally[a] || forms.indexOf(a) - forms.indexOf(b))
  const winner = ranked[0]
  const runner = tally[ranked[1]] > 0 && tally[ranked[1]] >= tally[winner] - 2 ? ranked[1] : null
  const reasons = questions
    .map((q, i) => (answers[i] === null ? null : q.options[answers[i] as number]))
    .filter((o): o is Option => o !== null && (o.w[winner] ?? 0) > 0)
    .map(o => o.why)
  const against = questions
    .map((q, i) => (answers[i] === null ? null : q.options[answers[i] as number]))
    .filter((o): o is Option => o !== null && !(o.w[winner] ?? 0))
    .map(o => o.why)
  return { tally, winner, runner, reasons, against }
}

export default function IsItABook() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const done = step >= questions.length
  const set = (i: number, v: number) => setAnswers(prev => prev.map((p, j) => (j === i ? v : p)))

  const r = triage(answers)
  const o = outcomes[r.winner]

  return (
    <>
      <PageHead
        n="02"
        title="Is it a book?"
        sub="Six questions. Some ideas are books. More are articles, talks or series, and are better for it. This will say which, and why."
      />

      <section className="pt-10 pb-20">
        <div className="wrap max-w-[760px]">
          {!done && (
            <>
              <StepRule total={questions.length} step={step + 1} />
              <div className="flex flex-col gap-6 p-6 sm:p-8" style={{ border: '2px solid var(--ink)' }}>
                <span className="num text-muted text-[.8rem]">
                  {String(step + 1).padStart(2, '0')} / {questions.length}
                </span>
                <h2 className="text-[1.5rem] sm:text-[1.8rem]">{questions[step].q}</h2>
                <Choice
                  id={`iab-q${step}`}
                  label="Choose the closest"
                  options={questions[step].options.map(x => x.label)}
                  value={answers[step]}
                  onChange={i => set(step, i)}
                  stack
                />
                <div className="flex gap-3">
                  <button
                    id="iab-back"
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    disabled={step === 0}
                    className="btn-o flex-1 disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    id="iab-next"
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    disabled={answers[step] === null}
                    className="btn flex-1 disabled:opacity-40"
                  >
                    {step === questions.length - 1 ? 'See the answer' : 'Next'}
                  </button>
                </div>
              </div>
            </>
          )}

          {done && (
            <div className="flex flex-col gap-10">
              <div className="inv p-6 sm:p-8">
                <span className="lbl inv-muted block mb-4">On these answers, it is</span>
                <h2 className="mb-4" style={{ fontSize: 'clamp(2.2rem, 7vw, 3.6rem)' }}>{o.title}.</h2>
                <p className="inv-muted text-[1rem] leading-[1.6] max-w-[56ch]">{o.body}</p>
                {r.runner && (
                  <p className="text-[.93rem] mt-5 max-w-[56ch]">
                    A close second: {outcomes[r.runner].title.toLowerCase()}.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-[1.3rem] mb-4">The reasoning</h3>
                <ul className="rule-t">
                  {r.reasons.map(x => (
                    <li key={x} className="hair-b py-4 text-[.95rem] leading-[1.6]">{x}</li>
                  ))}
                </ul>
                {r.against.length > 0 && (
                  <>
                    <span className="lbl text-muted block mt-8 mb-3">Pulling the other way</span>
                    <ul className="rule-t">
                      {r.against.map(x => (
                        <li key={x} className="hair-b py-4 text-muted text-[.93rem] leading-[1.6]">{x}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="panel p-6 sm:p-7">
                <span className="lbl block mb-3">What to do instead of deciding</span>
                <p className="text-[.98rem] leading-[1.6] max-w-[58ch]">{o.instead}</p>
                {r.winner === 'book' && (
                  <Link to="/tools/readiness" className="btn-o mt-5">Readiness scorecard</Link>
                )}
              </div>

              <button id="iab-restart" type="button" onClick={() => setStep(0)} className="btn-o self-start">
                Change answers
              </button>

              <LeadGate
                source="is-it-a-book"
                result={{
                  form: r.winner,
                  runnerUp: r.runner,
                  tally: r.tally,
                  answers: questions.map((q, i) => ({
                    q: q.q,
                    a: answers[i] === null ? null : q.options[answers[i] as number].label,
                  })),
                }}
                heading="Keep the reasoning"
                blurb="The answer and the reasons for it, written out, so you can test the idea against them later. No sequence follows. If an editor has a view worth sending, it comes from them."
                cta="Send it"
              />

              {/* Only a book or a series is a call for this house. An article
                  or a talk is a real answer, and it is not our work. */}
              <CallMe
                from="is-it-a-book"
                hotReason={
                  r.winner === 'book' || r.winner === 'series'
                    ? `Triage says: ${r.winner}`
                    : undefined
                }
                result={{ form: r.winner, runnerUp: r.runner }}
              />
            </div>
          )}

          <BackToTools />
        </div>
      </section>
    </>
  )
}
