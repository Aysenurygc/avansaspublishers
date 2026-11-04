import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import LeadGate from '@/components/ui/LeadGate'
import { Choice, StepRule, Meter, BackToTools } from './shared'

type Area = 'Idea' | 'Reader' | 'Platform' | 'Material' | 'Time' | 'Budget'

type Question = {
  area: Area
  q: string
  options: { label: string; score: number }[]
}

const questions: Question[] = [
  {
    area: 'Idea',
    q: 'Can you state what the book argues, or the story it tells, in one sentence?',
    options: [
      { label: 'Yes, and people who hear it can repeat it back', score: 3 },
      { label: 'Yes, though it shifts a little each time I say it', score: 2 },
      { label: 'I can describe the subject, not the argument', score: 1 },
      { label: 'Not yet', score: 0 },
    ],
  },
  {
    area: 'Idea',
    q: 'Why this book, from you, now?',
    options: [
      { label: 'I have a view or a story others in my field do not', score: 3 },
      { label: 'I know the subject well; the angle is still forming', score: 2 },
      { label: 'Good books exist on this already; mine would be similar', score: 1 },
      { label: 'Mainly, I want to have written a book', score: 0 },
    ],
  },
  {
    area: 'Reader',
    q: 'Who is the reader?',
    options: [
      { label: 'A specific person: their work, their problem, what they have tried', score: 3 },
      { label: 'My family, and those who come after them', score: 2 },
      { label: 'A broad group I could describe in a paragraph', score: 2 },
      { label: 'Anyone interested in the subject', score: 1 },
      { label: 'I have not thought about it', score: 0 },
    ],
  },
  {
    area: 'Reader',
    q: 'What should the reader think, do or feel at the end that they could not at the start?',
    options: [
      { label: 'I can name it precisely', score: 3 },
      { label: 'Roughly', score: 2 },
      { label: 'They will know more about the subject', score: 1 },
      { label: 'I am not sure', score: 0 },
    ],
  },
  {
    area: 'Platform',
    q: 'How will the book reach its readers?',
    options: [
      { label: 'Through work I already do: clients, talks, a list, a practice', score: 3 },
      { label: 'It is for family and friends, not for wide sale', score: 3 },
      { label: 'Through a network that would notice it', score: 2 },
      { label: 'Through the book itself, once it is out', score: 1 },
      { label: 'I have not considered it', score: 0 },
    ],
  },
  {
    area: 'Material',
    q: 'How much material is there, in any form: writing, talks, recordings, stories you can tell at length?',
    options: [
      { label: 'More than a book’s worth', score: 3 },
      { label: 'Enough for the core of it', score: 2 },
      { label: 'A handful of strong pieces', score: 1 },
      { label: 'Mostly the wish to write it', score: 0 },
    ],
  },
  {
    area: 'Material',
    q: 'Could you talk about the subject for ten hours without repeating yourself?',
    options: [
      { label: 'Easily', score: 3 },
      { label: 'Probably', score: 2 },
      { label: 'Two or three hours, then it would thin out', score: 1 },
      { label: 'I do not know', score: 0 },
    ],
  },
  {
    area: 'Time',
    q: 'What time can you give it each week, for four to six months? Interviews, reading drafts, decisions.',
    options: [
      { label: 'Two to four hours, protected', score: 3 },
      { label: 'An hour or two, most weeks', score: 2 },
      { label: 'Whatever is left over', score: 1 },
      { label: 'Very little for the next six months', score: 0 },
    ],
  },
  {
    area: 'Time',
    q: 'Who has the final say on the manuscript?',
    options: [
      { label: 'Me', score: 3 },
      { label: 'Me, with one person whose view I trust', score: 2 },
      { label: 'Partners, a board or a family, all with opinions', score: 1 },
      { label: 'That is not settled', score: 0 },
    ],
  },
  {
    area: 'Budget',
    q: 'Where is the budget?',
    options: [
      { label: 'Set aside, and tested against quotes for comparable work', score: 3 },
      { label: 'A rough figure, not yet tested', score: 2 },
      { label: 'Not set; I want to know what it costs first', score: 1 },
      { label: 'I expect the book to pay for itself before I pay for it', score: 0 },
    ],
  },
]

const areas: Area[] = ['Idea', 'Reader', 'Platform', 'Material', 'Time', 'Budget']

const advice: Record<Area, string> = {
  Idea:
    'Write the argument in one sentence. Then write the reply a sceptical colleague would give. If you cannot answer the reply, the book is not ready, and no writer can make it ready for you.',
  Reader:
    'Name one real reader. Their work, their problem, what they have already tried. Write for that person; the others follow. A book for everyone is read by no one in particular.',
  Platform:
    'Books rarely find readers on their own. Most are read by people who already know the author’s work. Decide how this one reaches its readers before deciding how it is written.',
  Material:
    'Talk the book before writing it. Record yourself explaining the subject for an hour a week for a month. If the recordings run dry, the book would have too.',
  Time:
    'Books stall on calendars and committees more often than on ideas. Block the hours before you start, and settle who signs off.',
  Budget:
    'Get two or three quotes for the kind of book you mean before deciding anything else. A budget settled halfway through tends to decide the book for you.',
}

type Verdict = 'ready' | 'nearly' | 'groundwork' | 'notyet'

const verdicts: Record<Verdict, { title: string; body: string; next: string[] }> = {
  ready: {
    title: 'Ready to start',
    body:
      'The idea holds, the reader is named, and the time and material are there to carry it. That is less common than it sounds. What is left is structure, and choosing the writer who fits it.',
    next: [
      'Put the one-sentence argument at the top of a page and keep it there.',
      'Gather what exists: talks, decks, notes, recordings. Nothing needs tidying.',
      'Talk to a house, ours or another, about structure before anyone writes a chapter.',
    ],
  },
  nearly: {
    title: 'Nearly there',
    body:
      'Most of what a book needs is in place. One or two things are not, and they are the things that stall a book in its third month. Settle them before you spend money on it.',
    next: [
      'Work on the areas marked below. Weeks, not months.',
      'Then take the answers again. If the verdict moves, start.',
    ],
  },
  groundwork: {
    title: 'Groundwork first',
    body:
      'There is something here. Starting now would mean paying someone to help you find out what the book is, which is slower and dearer than finding out yourself. On these answers we would most likely say not yet.',
    next: [
      'Do the work marked below, in that order.',
      'Give it three months. Then take this again.',
    ],
  },
  notyet: {
    title: 'Not a book yet',
    body:
      'On these answers we would not take this on, and we would advise against starting it with anyone. That is not a judgement of the idea, which may be good. A book needs an argument, a reader and the time to carry both, and those are not in place.',
    next: [
      'Write it as one article, about 1,500 words. If it holds, write five more.',
      'If the articles start to need each other, that sequence is the beginning of a book.',
      'If they do not, you have saved a year and a good deal of money.',
    ],
  },
}

function score(answers: (number | null)[]) {
  const byArea = Object.fromEntries(areas.map(a => [a, { got: 0, max: 0 }])) as Record<Area, { got: number; max: number }>
  let total = 0
  questions.forEach((q, i) => {
    const a = answers[i]
    const s = a === null ? 0 : q.options[a].score
    byArea[q.area].got += s
    byArea[q.area].max += 3
    total += s
  })
  const max = questions.length * 3

  let verdict: Verdict =
    total >= 25 ? 'ready' : total >= 18 ? 'nearly' : total >= 11 ? 'groundwork' : 'notyet'

  // The idea is the floor. Without one, nothing else rescues the verdict.
  const idea = byArea.Idea.got
  if (idea <= 1) verdict = 'notyet'
  else if (idea <= 2 && (verdict === 'ready' || verdict === 'nearly')) verdict = 'groundwork'

  const weak = areas.filter(a => byArea[a].got / byArea[a].max < 0.6)
  return { total, max, verdict, byArea, weak }
}

export default function ReadinessScorecard() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const done = step >= questions.length

  const set = (i: number, v: number) => setAnswers(prev => prev.map((p, j) => (j === i ? v : p)))

  const r = score(answers)
  const v = verdicts[r.verdict]

  return (
    <>
      <PageHead
        n="01"
        title="Book readiness scorecard"
        sub="Ten questions on the idea, the reader, the platform, the material, the time and the budget. The answer may be not yet. That is a useful answer."
      />

      <section className="pt-10 pb-20">
        <div className="wrap max-w-[760px]">
          {!done && (
            <>
              <StepRule total={questions.length} step={step + 1} />
              <div className="flex flex-col gap-6 p-6 sm:p-8" style={{ border: '2px solid var(--ink)' }}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="lbl text-muted">{questions[step].area}</span>
                  <span className="num text-muted text-[.8rem]">
                    {String(step + 1).padStart(2, '0')} / {questions.length}
                  </span>
                </div>
                <h2 className="text-[1.5rem] sm:text-[1.8rem]">{questions[step].q}</h2>
                <Choice
                  id={`rs-q${step}`}
                  label="Choose the closest"
                  options={questions[step].options.map(o => o.label)}
                  value={answers[step]}
                  onChange={i => set(step, i)}
                  stack
                />
                <div className="flex gap-3">
                  <button
                    id="rs-back"
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    disabled={step === 0}
                    className="btn-o flex-1 disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    id="rs-next"
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    disabled={answers[step] === null}
                    className="btn flex-1 disabled:opacity-40"
                  >
                    {step === questions.length - 1 ? 'See the verdict' : 'Next'}
                  </button>
                </div>
              </div>
            </>
          )}

          {done && (
            <div className="flex flex-col gap-10">
              <div className="inv p-6 sm:p-8">
                <span className="lbl inv-muted block mb-4">The verdict</span>
                <h2 className="mb-4" style={{ fontSize: 'clamp(2.2rem, 7vw, 3.6rem)' }}>{v.title}.</h2>
                <p className="inv-muted text-[1rem] leading-[1.6] max-w-[56ch]">{v.body}</p>
                <p className="num mt-6 text-[.9rem]">
                  {r.total} / {r.max}
                </p>
              </div>

              <div>
                <h3 className="text-[1.3rem] mb-4">By area</h3>
                <div className="rule-t">
                  {areas.map(a => {
                    const { got, max } = r.byArea[a]
                    const isWeak = r.weak.includes(a)
                    return (
                      <div key={a} className="hair-b py-4 grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_auto] gap-4 items-center">
                        <span className={isWeak ? 'lbl text-ink' : 'lbl text-muted'}>{a}</span>
                        <Meter value={got} max={max} label={`${a}: ${got} of ${max}`} />
                        <span className="num text-[.85rem]">{got}/{max}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-[1.3rem] mb-4">What to do next</h3>
                <ol className="rule-t">
                  {v.next.map((n, i) => (
                    <li key={n} className="hair-b py-4 grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
                      <span className="num text-muted">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[.95rem]">{n}</span>
                    </li>
                  ))}
                </ol>
                {r.verdict === 'notyet' && (
                  <p className="text-muted text-[.93rem] mt-5 max-w-[60ch]">
                    Unsure whether the idea is a book, an article or a talk?{' '}
                    <Link to="/tools/is-it-a-book" className="text-ink border-b-2 border-ink">Run the triage</Link>.
                  </p>
                )}
              </div>

              {r.weak.length > 0 && (
                <div>
                  <h3 className="text-[1.3rem] mb-4">Where it is thin</h3>
                  <div className="rule-t">
                    {r.weak.map(a => (
                      <div key={a} className="hair-b py-5">
                        <span className="lbl block mb-2">{a}</span>
                        <p className="text-muted text-[.95rem] leading-[1.6] max-w-[62ch]">{advice[a]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                id="rs-restart"
                type="button"
                onClick={() => setStep(0)}
                className="btn-o self-start"
              >
                Change answers
              </button>

              <LeadGate
                source="book-readiness-scorecard"
                result={{
                  verdict: r.verdict,
                  score: r.total,
                  max: r.max,
                  areas: Object.fromEntries(areas.map(a => [a, `${r.byArea[a].got}/${r.byArea[a].max}`])),
                  answers: questions.map((q, i) => ({
                    q: q.q,
                    a: answers[i] === null ? null : q.options[answers[i] as number].label,
                  })),
                }}
                heading="Keep a written copy"
                blurb="The verdict, the scores by area and the notes above, sent as one page you can come back to in three months. If an editor reads it and has something to add, they will write. Otherwise, nothing."
                cta="Send the scorecard"
              />
            </div>
          )}

          <BackToTools />
        </div>
      </section>
    </>
  )
}
