import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import Field from '@/components/ui/Field'
import LeadGate from '@/components/ui/LeadGate'
import { BackToTools } from './shared'

/*
 * Everything here is arithmetic on the text, done in this browser.
 * No model, no service, no network call until the reader uses the gate,
 * and the gate sends the numbers, never the pages.
 */

const MIN_WORDS = 150

const IRREGULAR_PARTICIPLES =
  'known|written|given|taken|seen|done|made|told|found|born|shown|thrown|held|kept|left|lost|built|brought|bought|caught|felt|heard|led|meant|met|paid|said|sent|sold|spent|stood|taught|thought|understood|won|begun|broken|chosen|driven|eaten|fallen|forgotten|frozen|gotten|hidden|ridden|risen|shaken|spoken|stolen|sworn|torn|woken|worn|put|set|cut|hit|hurt|shut|spread|struck|hung|drawn|grown|blown|flown|forgiven|beaten|bitten|bound|fed|fought|ground|laid|lit|read|sought|shot|slain|sunk|swept|thrust|wound|wrung'

const PASSIVE = new RegExp(
  `\\b(am|is|are|was|were|be|been|being)\\s+(?:\\w+ly\\s+)?(\\w+ed|${IRREGULAR_PARTICIPLES})\\b`,
  'gi',
)

// -ly words that are not adverbs, or are too common to count against anyone.
const NOT_ADVERBS = new Set(
  'only early family reply apply supply rely ally rally tally italy july lily holy ugly silly jelly belly bully fly ply sly wily folly jolly homily anomaly assembly monopoly butterfly firefly melancholy friendly lonely lovely elderly curly oily hilly chilly costly deadly likely daily weekly monthly yearly hourly nightly orderly lively manly kindly comely smelly woolly prickly bubbly wobbly cuddly sickly ghastly ghostly heavenly worldly scholarly cowardly beastly bodily burly gnarly surly steely fully'.split(' '),
)

// Concrete anchors: things a reader can see, hold, or stand in. A word list, nothing more.
const CONCRETE = new Set(
  ('hand hands face eyes eye mouth hair skin fingers feet foot arm arms knee knees shoulder back blood bone teeth ' +
    'door doors window windows wall walls floor roof stairs kitchen table chair bed room rooms hall house home garden yard street road car truck bus train ' +
    'station platform office desk phone screen laptop letter letters envelope paper book books pen cup glass bottle plate bread coffee tea water ' +
    'rain snow wind sun sky cloud clouds fog river sea lake shore beach field fields hill hills mountain tree trees forest grass mud dust stone stones ' +
    'dog cat horse bird birds coat shirt dress shoes boots hat keys key money coin coins bag box knife gun fire smoke light lamp candle clock watch ' +
    'church school hospital ward farm barn shop store market bar restaurant hotel airport plane ship boat bridge city town village field ' +
    'mother father mum mom dad brother sister son daughter wife husband grandmother grandfather baby child children boy girl man woman doctor nurse ' +
    'morning night evening afternoon midnight dawn winter summer spring autumn monday tuesday wednesday thursday friday saturday sunday ' +
    'january february march april may june july august september october november december').split(' '),
)

type Signal = { label: string; note: string }

function analyse(text: string) {
  const clean = text.replace(/\r\n/g, '\n').trim()
  const wordList = clean.match(/[A-Za-z0-9’'-]+/g)?.filter(w => /[A-Za-z0-9]/.test(w)) ?? []
  const words = wordList.length

  const sentences = (clean.replace(/\s+/g, ' ').match(/[^.!?]+(?:[.!?]+["'”’)]*|$)/g) ?? [])
    .map(s => s.trim())
    .filter(s => /[A-Za-z0-9]/.test(s))
  const sentLens = sentences.map(s => (s.match(/[A-Za-z0-9’'-]+/g) ?? []).length)
  const avgSent = sentLens.length ? words / sentLens.length : 0
  const longestIdx = sentLens.reduce((best, n, i) => (n > sentLens[best] ? i : best), 0)
  const longest = sentLens[longestIdx] ?? 0
  const mean = avgSent
  const sd = sentLens.length
    ? Math.sqrt(sentLens.reduce((a, n) => a + (n - mean) ** 2, 0) / sentLens.length)
    : 0

  const passiveHits = clean.match(PASSIVE)?.length ?? 0
  const passivePct = sentences.length ? (passiveHits / sentences.length) * 100 : 0

  const adverbs = wordList.filter(w => {
    const lw = w.toLowerCase().replace(/[’']/g, '')
    return lw.length > 4 && lw.endsWith('ly') && !NOT_ADVERBS.has(lw)
  })
  const adverbPer1k = words ? (adverbs.length / words) * 1000 : 0

  let paras = clean.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  if (paras.length === 1 && clean.includes('\n')) paras = clean.split(/\n/).map(p => p.trim()).filter(Boolean)
  const paraLens = paras.map(p => (p.match(/[A-Za-z0-9’'-]+/g) ?? []).length)
  const avgPara = paraLens.length ? words / paraLens.length : 0
  const longestPara = paraLens.length ? Math.max(...paraLens) : 0

  const quoted = clean.match(/“[^”]*”|"[^"]*"/g) ?? []
  const dialogueWords = quoted.reduce((a, q) => a + (q.match(/[A-Za-z0-9’'-]+/g) ?? []).length, 0)
  const dialoguePct = words ? Math.min(100, (dialogueWords / words) * 100) : 0

  // First concrete anchor: a listed concrete word, a number, or a capitalised
  // word mid-sentence (usually a name or a place).
  let anchorAt = -1
  let anchorWord = ''
  {
    const tokens = clean.match(/[A-Za-z0-9’'-]+|[.!?]/g) ?? []
    let wi = 0
    let sentenceStart = true
    for (const t of tokens) {
      if (/^[.!?]$/.test(t)) { sentenceStart = true; continue }
      wi++
      const lw = t.toLowerCase()
      const isConcrete = CONCRETE.has(lw)
      const isNumber = /\d/.test(t)
      const isProper = !sentenceStart && /^[A-Z][a-z]/.test(t) && t !== 'I'
      sentenceStart = false
      if (isConcrete || isNumber || isProper) { anchorAt = wi; anchorWord = t; break }
    }
  }

  const first = sentences[0] ?? ''
  const firstLen = sentLens[0] ?? 0
  const signals: Signal[] = []
  const f = first.toLowerCase()
  if (/\?["'”’)]*$/.test(first))
    signals.push({ label: 'Opens with a question', note: 'Readers have met the rhetorical opening question many times. It can work, but it asks them to answer before they have a reason to care.' })
  if (/^(imagine|picture this|have you ever|what if)\b/.test(f))
    signals.push({ label: 'Opens by addressing the reader', note: '“Imagine” and “Have you ever” are among the most common openings in non-fiction. A specific scene usually does the same job with less asking.' })
  if (/^(in today’s|in today's|in this book|this book|since the dawn|throughout history|in a world)\b/.test(f))
    signals.push({ label: 'Opens on a frame, not the matter', note: 'The first line describes the book or the age rather than saying something. Often the second or third paragraph is the real start.' })
  if (/\b(dictionary|defines|definition)\b/.test(f))
    signals.push({ label: 'Opens on a definition', note: 'Dictionary openings are a familiar device. They delay the author’s own voice.' })
  if (/^(it was|the sun|the rain|the morning|the day)\b/.test(f))
    signals.push({ label: 'Opens on setting or weather', note: 'A setting-first opening relies on what follows quickly. Check how soon a person does something.' })
  if (/\d/.test(first))
    signals.push({ label: 'Carries a number or date', note: 'A specific number in the first line is a commitment. Readers tend to trust specifics.' })
  if (/\s[A-Z][a-z]+/.test(first.slice(1)))
    signals.push({ label: 'Names someone or somewhere', note: 'A proper noun in the first line places the reader. That is usually a strength.' })
  if (firstLen > 0 && firstLen <= 12)
    signals.push({ label: 'Short first sentence', note: `${firstLen} words. A short first line is easy to enter.` })
  if (firstLen > 30)
    signals.push({ label: 'Long first sentence', note: `${firstLen} words. The reader has to hold a lot before they know why.` })
  if (signals.length === 0)
    signals.push({ label: 'No common pattern matched', note: 'The first line does not match any of the patterns this checks for. That says nothing either way; it only means the arithmetic has no comment.' })

  return {
    words, sentences, sentLens, avgSent, longest, longestIdx, sd,
    passiveHits, passivePct, adverbs, adverbPer1k,
    paras: paraLens.length, avgPara, longestPara, paraLens,
    dialoguePct, anchorAt, anchorWord, first, firstLen, signals,
  }
}

type Result = ReturnType<typeof analyse>

function readings(r: Result) {
  const rows: { label: string; value: string; note: string }[] = []
  rows.push({
    label: 'Words',
    value: r.words.toLocaleString('en-US'),
    note:
      r.words < 400 ? 'A short sample. The numbers below will move a lot with each sentence; treat them loosely.'
      : r.words > 1500 ? 'Longer than an opening. The read covers all of it, which dilutes what the first page does.'
      : 'Enough to read the shape of an opening.',
  })
  rows.push({
    label: 'Average sentence',
    value: `${r.avgSent.toFixed(1)} words`,
    note:
      r.avgSent < 10 ? 'Brisk. Good for pace; across a whole book it can read as clipped.'
      : r.avgSent <= 22 ? 'Within the usual range for readable trade prose.'
      : 'Heavy going for an opening. Readers give the first page less patience than any other.',
  })
  rows.push({
    label: 'Sentence variety',
    value: `± ${r.sd.toFixed(1)}`,
    note:
      r.sd < 4 ? 'Sentences are similar in length. Prose like this can feel monotonous read aloud.'
      : r.sd > 14 ? 'Very uneven. Fine if deliberate; check the longest ones are earning it.'
      : 'Lengths vary, which usually reads as rhythm.',
  })
  rows.push({
    label: 'Longest sentence',
    value: `${r.longest} words`,
    note: r.longest > 45 ? 'Long enough that most readers will re-read it. Is that what you want there?' : 'Nothing unusually long.',
  })
  rows.push({
    label: 'Passive constructions',
    value: `${r.passiveHits} (${r.passivePct.toFixed(0)}% of sentences)`,
    note:
      r.passivePct > 15 ? 'Frequent. Passive voice hides who did what, which matters most where stakes are being set.'
      : 'Not frequent. Some passive is normal and often right.',
  })
  rows.push({
    label: 'Adverbs ending -ly',
    value: `${r.adverbs.length} (${r.adverbPer1k.toFixed(0)} per 1,000 words)`,
    note:
      r.adverbPer1k > 20 ? 'On the high side. Often a stronger verb is doing the work twice.'
      : 'Moderate. Not something to chase.',
  })
  rows.push({
    label: 'Paragraphs',
    value: `${r.paras}, averaging ${r.avgPara.toFixed(0)} words`,
    note:
      r.paras <= 1 ? 'One block. If that is a paste artefact, add blank lines between paragraphs and run it again.'
      : r.avgPara > 120 ? `Dense on the page. The longest runs to ${r.longestPara} words; on a phone that is several screens.`
      : 'Paragraph length is comfortable on a page or a screen.',
  })
  rows.push({
    label: 'Dialogue',
    value: `${r.dialoguePct.toFixed(0)}% of words`,
    note:
      r.dialoguePct === 0 ? 'No quoted speech. Usual for argued non-fiction; in memoir, a voice early can bring a scene alive.'
      : r.dialoguePct > 50 ? 'Mostly speech. Check the reader knows who is speaking, and where.'
      : 'Some speech in the mix.',
  })
  rows.push({
    label: 'First concrete anchor',
    value: r.anchorAt > 0 ? `word ${r.anchorAt}: “${r.anchorWord}”` : 'none found',
    note:
      r.anchorAt < 0 ? 'Nothing from the list of concrete words, no number, no name. The opening may be all abstraction.'
      : r.anchorAt > 60 ? 'A long run before anything the reader can see. Abstraction is harder to enter than a place or a person.'
      : 'Something the reader can picture arrives early.',
  })
  return rows
}

export default function OpeningPages() {
  const [text, setText] = useState('')
  const [run, setRun] = useState<string | null>(null)
  const r = useMemo(() => (run ? analyse(run) : null), [run])
  const liveWords = text.trim() ? text.trim().split(/\s+/).length : 0
  const maxLen = r && r.sentLens.length ? Math.max(...r.sentLens) : 1

  return (
    <>
      <PageHead
        n="03"
        title="Opening-pages appraisal"
        sub="Paste the first 500 to 1,000 words. This counts things: sentence length, passive constructions, adverbs, paragraphs, dialogue, how soon something concrete appears. It is arithmetic, not an editor’s judgement."
      />

      <section className="pt-10 pb-20">
        <div className="wrap max-w-[860px]">
          <div className="flex flex-col gap-5 p-6 sm:p-8" style={{ border: '2px solid var(--ink)' }}>
            <Field
              id="op-text"
              label="Your opening pages"
              value={text}
              onChange={setText}
              rows={14}
              placeholder="Paste plain text. Leave a blank line between paragraphs."
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="num text-muted text-[.82rem]">{liveWords.toLocaleString('en-US')} words</span>
              <button
                id="op-run"
                type="button"
                onClick={() => setRun(text)}
                disabled={liveWords < MIN_WORDS}
                className="btn disabled:opacity-40"
              >
                Read the numbers
              </button>
            </div>
            <p className="text-muted text-[.84rem] leading-[1.5] max-w-[62ch]">
              The text stays in this browser. Nothing is uploaded, stored or read by a person or a
              program elsewhere. {liveWords > 0 && liveWords < MIN_WORDS && `At least ${MIN_WORDS} words are needed.`}
            </p>
          </div>

          {r && (
            <div className="flex flex-col gap-10 mt-12">
              <div className="inv p-6 sm:p-8">
                <span className="lbl inv-muted block mb-4">A mechanical read</span>
                <h2 className="mb-4" style={{ fontSize: 'clamp(1.9rem, 6vw, 3rem)' }}>What the arithmetic says.</h2>
                <p className="inv-muted text-[.98rem] leading-[1.6] max-w-[58ch]">
                  These are counts and ratios, worked out by fixed rules. They cannot tell whether a
                  sentence is good, whether the voice is right, or whether the reader will care. They
                  can show where to look.
                </p>
              </div>

              <div>
                <h3 className="text-[1.3rem] mb-2">Sentence by sentence</h3>
                <p className="text-muted text-[.88rem] mb-4">Each bar is one sentence, in order. Height is length in words. The full-strength bar is the longest.</p>
                <div className="flex items-end gap-px h-28 w-full" role="img" aria-label={`${r.sentLens.length} sentences; longest ${r.longest} words`}>
                  {r.sentLens.map((n, i) => (
                    <div
                      key={i}
                      className="flex-1 min-w-0"
                      style={{
                        height: `${Math.max(4, (n / maxLen) * 100)}%`,
                        background: i === r.longestIdx ? 'var(--ink)' : 'var(--silver)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[1.3rem] mb-4">The numbers, and what they suggest</h3>
                <div className="rule-t">
                  {readings(r).map(row => (
                    <div key={row.label} className="hair-b py-4 grid grid-cols-1 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] gap-x-6 gap-y-1">
                      <div>
                        <span className="lbl text-muted block">{row.label}</span>
                        <span className="num text-[1rem]">{row.value}</span>
                      </div>
                      <p className="text-[.93rem] leading-[1.6]">{row.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[1.3rem] mb-4">The first line</h3>
                <blockquote className="panel p-5 text-[1rem] leading-[1.6] mb-4 break-words">{r.first}</blockquote>
                <div className="rule-t">
                  {r.signals.map(s => (
                    <div key={s.label} className="hair-b py-4">
                      <span className="lbl block mb-1">{s.label}</span>
                      <p className="text-muted text-[.93rem] leading-[1.6] max-w-[62ch]">{s.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel p-6 sm:p-7">
                <span className="lbl block mb-3">What this cannot do</span>
                <p className="text-[.98rem] leading-[1.6] max-w-[60ch]">
                  An editor reads for whether the opening makes a promise and keeps it, whether the
                  voice is yours, and whether the reader would turn the page. None of that can be
                  counted. If you want that read, send the pages to a person.
                </p>
                <Link to="/contact" className="btn-o mt-5">Send the pages to an editor</Link>
              </div>

              <LeadGate
                source="opening-pages-appraisal"
                result={{
                  words: r.words,
                  sentences: r.sentLens.length,
                  avgSentence: Number(r.avgSent.toFixed(1)),
                  sentenceSd: Number(r.sd.toFixed(1)),
                  longestSentence: r.longest,
                  passiveHits: r.passiveHits,
                  adverbsPer1k: Number(r.adverbPer1k.toFixed(1)),
                  paragraphs: r.paras,
                  avgParagraph: Math.round(r.avgPara),
                  dialoguePct: Math.round(r.dialoguePct),
                  firstAnchorAt: r.anchorAt,
                  openingSignals: r.signals.map(s => s.label),
                }}
                heading="Keep the read-back"
                blurb="The numbers and notes above, sent as one page. Only the numbers are sent, not your text. If you want an editor’s judgement on the pages themselves, that is a separate conversation, and a person has it."
                cta="Send the numbers"
              />
            </div>
          )}

          <BackToTools />
        </div>
      </section>
    </>
  )
}
