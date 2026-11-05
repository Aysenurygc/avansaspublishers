import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import Field from '@/components/ui/Field'
import LeadGate from '@/components/ui/LeadGate'
import CallMe from '@/components/ui/CallMe'
import { Choice, StepRule, Meter, BackToTools } from './shared'

type Kind = 'Period' | 'Turning point' | 'Person' | 'Place'
const kinds: Kind[] = ['Period', 'Turning point', 'Person', 'Place']

type Entry = { id: number; kind: Kind; title: string; when: string; changed: string }

const titleHint: Record<Kind, string> = {
  Period: 'The farm years, the first marriage, the move north…',
  'Turning point': 'The letter, the diagnosis, the day the shop closed…',
  Person: 'A teacher, a business partner, a brother…',
  Place: 'The flat above the bakery, the mill, the ward…',
}
const changedLabel: Record<Kind, string> = {
  Period: 'What was different by the end of it?',
  'Turning point': 'What was different afterwards?',
  Person: 'What did this person change?',
  Place: 'What happened here that could not have happened elsewhere?',
}

type Chapter = {
  title: string
  when: string
  period?: Entry
  turn?: Entry
  people: Entry[]
  key: number | null
}

function keyOf(when: string): number | null {
  const m = when.match(/\d{1,4}/)
  return m ? Number(m[0]) : null
}

function buildArc(entries: Entry[], shape: number, pivotId: number | null) {
  const anchors = entries
    .filter(e => e.kind === 'Period' || e.kind === 'Turning point')
    .map((e, i) => ({ e, i, k: keyOf(e.when) }))
  const timed = anchors.filter(a => a.k !== null).sort((a, b) => (a.k as number) - (b.k as number) || a.i - b.i)
  const untimed = anchors.filter(a => a.k === null)
  const ordered = [...timed, ...untimed]

  const chapters: Chapter[] = []
  for (const { e, k } of ordered) {
    const cur = chapters[chapters.length - 1]
    if (e.kind === 'Turning point' && cur && !cur.turn && (cur.key === null || k === null || k >= cur.key)) {
      cur.turn = e
      continue
    }
    if (e.kind === 'Period') chapters.push({ title: e.title, when: e.when, period: e, people: [], key: k })
    else chapters.push({ title: e.title, when: e.when, turn: e, people: [], key: k })
  }

  // People and places go to the chapter whose span holds their date.
  const unplaced: Entry[] = []
  for (const e of entries.filter(x => x.kind === 'Person' || x.kind === 'Place')) {
    const k = keyOf(e.when)
    if (k === null) { unplaced.push(e); continue }
    let home = -1
    chapters.forEach((c, i) => { if (c.key !== null && c.key <= k) home = i })
    if (home < 0) unplaced.push(e)
    else chapters[home].people.push(e)
  }

  const turns = entries.filter(e => e.kind === 'Turning point')
  const pivot =
    turns.find(t => t.id === pivotId) ?? turns.find(t => t.changed.trim()) ?? turns[0] ?? null

  return { chapters, unplaced, pivot: shape === 1 ? pivot : null }
}

function diagnose(entries: Entry[], question: string) {
  const withChange = entries.filter(e => e.changed.trim()).length
  const names = entries.filter(e => e.kind === 'Person' && !e.changed.trim())
  const turns = entries.filter(e => e.kind === 'Turning point').length
  const periods = entries.filter(e => e.kind === 'Period').length
  const keys = entries.map(e => keyOf(e.when)).filter((k): k is number => k !== null)
  const mixed = keys.some(k => k >= 1800) && keys.some(k => k < 1800)

  const notes: { head: string; body: string; severe: boolean }[] = []
  if (entries.length < 6)
    notes.push({ severe: true, head: 'Too little to map yet', body: 'A memoir needs more raw material than this. Keep gathering. Ten to twenty entries is a reasonable start, and most people find far more once they begin.' })
  if (turns === 0)
    notes.push({ severe: true, head: 'No turning points', body: 'This is a timeline, not yet a story. A story needs at least one moment after which things were different. Look for the decision, the loss, the arrival, the refusal.' })
  else if (periods > turns * 3)
    notes.push({ severe: false, head: 'Many periods, few turns', body: 'Long stretches with little turning between them read as a record. For each period, ask what ended it.' })
  if (names.length > 0)
    notes.push({ severe: names.length > 2, head: `${names.length} ${names.length === 1 ? 'name' : 'names'} without a change`, body: 'A name with no change attached is a name, not a character. For each, write one thing they did that altered the course. If there is nothing, they may belong in a list of thanks rather than a chapter.' })
  if (!question.trim())
    notes.push({ severe: true, head: 'No central question', body: 'Memoirs that are a list of names and dates usually lack one thing: a question the life is trying to answer. Why did we leave. What did the business cost. How did she keep going. Without it, the chapters have nothing to be about.' })
  if (mixed)
    notes.push({ severe: false, head: 'Years and ages mixed', body: 'Some entries are dated by year and some by age, so the order may be wrong. Use one or the other.' })
  return { withChange, notes }
}

export default function MemoirMapper() {
  const [step, setStep] = useState(1)
  const [who, setWho] = useState<number | null>(null)
  const [subject, setSubject] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [nextId, setNextId] = useState(1)
  const [draft, setDraft] = useState({ kind: 0, title: '', when: '', changed: '' })
  const [shape, setShape] = useState<number | null>(0)
  const [question, setQuestion] = useState('')
  const [pivotId, setPivotId] = useState<number | null>(null)

  const onBehalf = who === 1
  const their = onBehalf ? (subject.trim() ? `${subject.trim()}’s` : 'their') : 'your'
  const kind = kinds[draft.kind]

  const add = () => {
    setEntries(prev => [...prev, { id: nextId, kind, title: draft.title.trim(), when: draft.when.trim(), changed: draft.changed.trim() }])
    setNextId(n => n + 1)
    setDraft({ kind: draft.kind, title: '', when: '', changed: '' })
  }
  const remove = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    if (pivotId === id) setPivotId(null)
  }

  const arc = buildArc(entries, shape ?? 0, pivotId)
  const diag = diagnose(entries, question)
  const turningPoints = entries.filter(e => e.kind === 'Turning point')

  return (
    <>
      <PageHead
        n="04"
        title="Memoir story mapper"
        sub="Turn scattered recollection into a shape. Add the periods, turning points, people and places, then see them as a candidate run of chapters, with the gaps marked."
      />

      <section className="pt-10 pb-20">
        <div className="wrap max-w-[860px]">
          {step <= 3 && <StepRule total={3} step={step} />}

          {step === 1 && (
            <div className="flex flex-col gap-6 p-6 sm:p-8" style={{ border: '2px solid var(--ink)' }}>
              <h2 className="text-[1.5rem] sm:text-[1.8rem]">Whose life is it?</h2>
              <Choice
                id="mm-who"
                label="This book is"
                options={['My own life', 'Someone else’s: a parent, a relative, a founder']}
                value={who}
                onChange={setWho}
                stack
              />
              {onBehalf && (
                <>
                  <Field id="mm-subject" label="Their first name (optional)" value={subject} onChange={setSubject} placeholder="Used only on this page" />
                  <p className="text-muted text-[.93rem] leading-[1.6] max-w-[60ch]">
                    Fill this in with what you know. Where you are unsure, write it down anyway and
                    mark it as a question for them. The gaps are the interview.
                  </p>
                </>
              )}
              <button id="mm-next-1" type="button" onClick={() => setStep(2)} disabled={who === null} className="btn disabled:opacity-40">
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5 p-6 sm:p-8" style={{ border: '2px solid var(--ink)' }}>
                <h2 className="text-[1.5rem] sm:text-[1.8rem]">Gather</h2>
                <p className="text-muted text-[.95rem] leading-[1.6] max-w-[60ch]">
                  Add what comes to mind, in any order. For each, the last box matters most: what changed.
                  That is the difference between a story and a list.
                </p>
                <Choice id="mm-kind" label="Kind" options={kinds} value={draft.kind} onChange={i => setDraft({ ...draft, kind: i })} />
                <Field id="mm-title" label="Name it" value={draft.title} onChange={v => setDraft({ ...draft, title: v })} placeholder={titleHint[kind]} />
                <Field id="mm-when" label="When (a year, or an age)" value={draft.when} onChange={v => setDraft({ ...draft, when: v })} placeholder="1974, or 31" />
                <Field id="mm-changed" label={changedLabel[kind]} value={draft.changed} onChange={v => setDraft({ ...draft, changed: v })} rows={3} placeholder="One or two sentences" />
                <button id="mm-add" type="button" onClick={add} disabled={!draft.title.trim()} className="btn-o self-start disabled:opacity-40">
                  Add to the map
                </button>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <h3 className="text-[1.3rem]">So far</h3>
                  <span className="num text-muted text-[.82rem]">{entries.length}</span>
                </div>
                {entries.length === 0 ? (
                  <p className="text-muted text-[.93rem] rule-t pt-4">Nothing yet. Start with the period you remember most clearly.</p>
                ) : (
                  <ul className="rule-t">
                    {entries.map(e => (
                      <li key={e.id} className="hair-b py-4 grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
                        <div className="min-w-0">
                          <span className="lbl text-muted block mb-1">{e.kind}{e.when && ` · ${e.when}`}</span>
                          <span className="block text-[1rem] wt-650 break-words">{e.title}</span>
                          {e.changed
                            ? <span className="block text-muted text-[.9rem] mt-1 break-words">{e.changed}</span>
                            : <span className="inline-block lbl inv px-2 py-1 mt-2" style={{ fontSize: '.6rem' }}>No change written</span>}
                        </div>
                        <button id={`mm-remove-${e.id}`} type="button" onClick={() => remove(e.id)} className="lbl text-muted hover:text-ink" style={{ fontSize: '.66rem' }} aria-label={`Remove ${e.title}`}>
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-3">
                <button id="mm-back-2" type="button" onClick={() => setStep(1)} className="btn-o flex-1">Back</button>
                <button id="mm-next-2" type="button" onClick={() => setStep(3)} disabled={entries.length === 0} className="btn flex-1 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6 p-6 sm:p-8" style={{ border: '2px solid var(--ink)' }}>
              <h2 className="text-[1.5rem] sm:text-[1.8rem]">Shape</h2>
              <Field
                id="mm-question"
                label={`The question ${their} life is trying to answer`}
                value={question}
                onChange={setQuestion}
                rows={2}
                placeholder="Why did we leave? What did the business cost? How did she keep going?"
              />
              <Choice
                id="mm-shape"
                label="Where should it begin?"
                options={['At the beginning, in order', 'At the turning point, then back to the start']}
                value={shape}
                onChange={setShape}
                stack
              />
              {shape === 1 && turningPoints.length > 0 && (
                <Choice
                  id="mm-pivot"
                  label="The moment the book turns on"
                  options={turningPoints.map(t => t.title)}
                  value={turningPoints.findIndex(t => t.id === pivotId) >= 0 ? turningPoints.findIndex(t => t.id === pivotId) : null}
                  onChange={i => setPivotId(turningPoints[i].id)}
                  stack
                />
              )}
              {shape === 1 && turningPoints.length === 0 && (
                <p className="text-muted text-[.93rem]">There are no turning points on the map yet, so there is nothing to open on. Go back and add one.</p>
              )}
              <div className="flex gap-3">
                <button id="mm-back-3" type="button" onClick={() => setStep(2)} className="btn-o flex-1">Back</button>
                <button id="mm-next-3" type="button" onClick={() => setStep(4)} className="btn flex-1">Draw the arc</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-10">
              <div className="inv p-6 sm:p-8">
                <span className="lbl inv-muted block mb-4">A candidate arc</span>
                <h2 className="mb-4" style={{ fontSize: 'clamp(1.9rem, 6vw, 3rem)' }}>
                  {arc.chapters.length} {arc.chapters.length === 1 ? 'chapter' : 'chapters'}, roughly.
                </h2>
                <p className="inv-muted text-[.98rem] leading-[1.6] max-w-[58ch]">
                  {question.trim()
                    ? <>The book asks: <span className="text-[1rem]" style={{ color: 'var(--inv-ink)' }}>{question.trim()}</span> Each chapter below should move that question on. A chapter that does not is a candidate for cutting.</>
                    : 'There is no central question yet, so this is an order of events rather than an arc. Read the notes below first.'}
                </p>
              </div>

              <div>
                <span className="lbl text-muted block mb-3">Story or record</span>
                <Meter value={diag.withChange} max={entries.length} label={`${diag.withChange} of ${entries.length} entries say what changed`} />
                <p className="text-[.93rem] mt-3 max-w-[60ch]">
                  <span className="num">{diag.withChange} of {entries.length}</span> entries say what changed.
                  The fuller this bar, the more the material behaves like a story.
                </p>
              </div>

              <div>
                <h3 className="text-[1.3rem] mb-4">Chapters</h3>
                <ol className="rule-t">
                  {arc.pivot && (
                    <li className="hair-b py-5 grid grid-cols-[3rem_minmax(0,1fr)] gap-3">
                      <span className="num text-muted">00</span>
                      <div className="min-w-0">
                        <span className="lbl block mb-1">Opening</span>
                        <span className="block text-[1.05rem] wt-650 break-words">{arc.pivot.title}</span>
                        <p className="text-muted text-[.9rem] mt-1">Open inside this moment, stop before it resolves, then go back to the start. The reader carries the question through every chapter that follows.</p>
                      </div>
                    </li>
                  )}
                  {arc.chapters.map((c, i) => {
                    const driven = c.turn?.changed || c.period?.changed
                    return (
                      <li key={`${c.title}-${i}`} className="hair-b py-5 grid grid-cols-[3rem_minmax(0,1fr)] gap-3">
                        <span className="num text-muted">{String(i + 1).padStart(2, '0')}</span>
                        <div className="min-w-0">
                          {c.when && <span className="lbl text-muted block mb-1">{c.when}</span>}
                          <span className="block text-[1.05rem] wt-650 break-words">{c.title}</span>
                          {c.turn && c.period && (
                            <p className="text-[.9rem] mt-1 break-words"><span className="lbl">Ends on</span> {c.turn.title}</p>
                          )}
                          {driven
                            ? <p className="text-muted text-[.9rem] mt-1 break-words">{driven}</p>
                            : <span className="inline-block lbl inv px-2 py-1 mt-2" style={{ fontSize: '.6rem' }}>Record, not yet story</span>}
                          {c.people.length > 0 && (
                            <p className="text-muted text-[.86rem] mt-2 break-words">
                              With: {c.people.map(p => p.title).join(', ')}
                            </p>
                          )}
                          {arc.pivot && c.turn?.id === arc.pivot.id && (
                            <p className="lbl mt-2" style={{ fontSize: '.62rem' }}>The opening returns here</p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
                {arc.chapters.length === 0 && (
                  <p className="text-muted text-[.93rem] pt-4">No periods or turning points yet, so there is nothing to build chapters from.</p>
                )}
                {arc.unplaced.length > 0 && (
                  <p className="text-muted text-[.9rem] mt-5 max-w-[62ch]">
                    Not yet placed: {arc.unplaced.map(p => p.title).join(', ')}. Give each a year and it
                    will find its chapter, or decide where it earns a scene.
                  </p>
                )}
              </div>

              {diag.notes.length > 0 && (
                <div>
                  <h3 className="text-[1.3rem] mb-4">Before anyone writes it</h3>
                  <div className="rule-t">
                    {diag.notes.map(n => (
                      <div key={n.head} className="hair-b py-5">
                        <span className={n.severe ? 'lbl inv inline-block px-2 py-1 mb-2' : 'lbl inline-block mb-2'}>{n.head}</span>
                        <p className="text-muted text-[.95rem] leading-[1.6] max-w-[62ch]">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {onBehalf && (
                <div className="panel p-6 sm:p-7">
                  <span className="lbl block mb-3">Writing someone else’s life</span>
                  <ul className="flex flex-col gap-3 text-[.95rem] leading-[1.6] max-w-[62ch]">
                    <li>Ask them before anything else. A memoir made without the subject’s wish is a biography, and a different kind of book.</li>
                    <li>Decide whose book it is. Their account and the family’s account rarely match. Both can be true; one has to lead.</li>
                    <li>Record the conversations. Detail lives in how people say things, and it goes first.</li>
                    <li>Agree who reads the draft, and that the subject can strike anything they would rather not see in print.</li>
                    <li>If time matters, say so at the start. Schedules can be built around it.</li>
                  </ul>
                </div>
              )}

              <button id="mm-edit" type="button" onClick={() => setStep(2)} className="btn-o self-start">
                Add or change entries
              </button>

              <LeadGate
                source="memoir-story-mapper"
                result={{
                  forSomeoneElse: onBehalf,
                  question: question.trim() || null,
                  shape: shape === 1 ? 'begin-at-turn' : 'chronological',
                  entries: entries.map(({ kind: k, title, when, changed }) => ({ kind: k, title, when, changed })),
                  chapters: arc.chapters.map(c => ({ title: c.title, when: c.when, endsOn: c.turn?.title ?? null })),
                  opening: arc.pivot?.title ?? null,
                  storyShare: `${diag.withChange}/${entries.length}`,
                  notes: diag.notes.map(n => n.head),
                }}
                heading="Keep the map"
                blurb={onBehalf
                  ? 'The entries, the arc and the notes, written out as one page you can take into the first conversation with them. If an editor thinks there is a book here, they will write.'
                  : 'The entries, the arc and the notes, written out as one page to add to as more comes back. If an editor thinks there is a book here, they will write.'}
                cta="Send the map"
              />

              {/* Five remembered moments is someone who has done the work of
                  remembering. Two is someone having a look around. */}
              <CallMe
                from="memoir-story-mapper"
                hotReason={
                  entries.length >= 5
                    ? `Mapped ${entries.length} moments into ${arc.chapters.length} chapters${onBehalf ? ", for someone else's story" : ''}`
                    : undefined
                }
                result={{ entries: entries.length, chapters: arc.chapters.length, forSomeoneElse: onBehalf }}
              />

              <p className="text-muted text-[.9rem] max-w-[60ch]">
                Not sure the material is a book at all? <Link to="/tools/is-it-a-book" className="text-ink border-b-2 border-ink">Run the triage</Link>.
              </p>
            </div>
          )}

          <BackToTools />
        </div>
      </section>
    </>
  )
}
