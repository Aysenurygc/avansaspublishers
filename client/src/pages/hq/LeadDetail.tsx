import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageHead from '@/components/layout/PageHead'
import Colophon from '@/components/ui/Colophon'
import { hq, type HQEvent, type HQLead } from '@/lib/api'
import { Denied, HotMark, STATUSES, Wait, areaClass, display, dueDay, when } from './shared'

type Full = HQLead & { answers: { label: string; value: string }[]; events: HQEvent[] }

/** The event kinds the server writes, in words. Anything new falls through as-is. */
const KIND: Record<string, string> = {
  created: 'Arrived',
  repeat: 'Came back',
  alert_sent: 'Alert sent',
  alert_skipped: 'Alert not sent',
  status: 'Updated',
  note: 'Note',
}

/**
 * Whether `said` really is the person's own writing.
 *
 * A callback's message is written by the site, not the person: either the
 * tool's HOT reason or "Asked for a call from …" (CallMe.tsx). Printing either
 * as a quotation would put words in their mouth on the call, so neither is.
 */
function ownWords(lead: Full): string | null {
  if (!lead.said) return null
  if (lead.source === 'call-me') return null
  if (lead.hotReason && lead.said.trim() === lead.hotReason) return null
  return lead.said
}

/** How to reach them. Drawn once per layout: under their words on a phone, atop the call sheet on a desk. */
function Reach({ lead }: { lead: Full }) {
  const tel = lead.phone ?? ''
  const waText = tel.replace(/\D/g, '')
  return (
    <div>
      <h2 className="lbl text-muted text-[.7rem] mb-3">Reach them</h2>
      {lead.phone ? (
        <>
          <p className="num text-[1.5rem] sm:text-[1.7rem] leading-tight mb-4 [overflow-wrap:anywhere]">{lead.phoneDisplay}</p>
          <a href={`tel:${tel}`} className="btn block w-full text-center">Call</a>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <a href={`sms:${tel}`} className="btn-o block text-center px-2">Text</a>
            <a href={`https://wa.me/${waText}`} target="_blank" rel="noopener noreferrer" className="btn-o block text-center px-2">
              WhatsApp
            </a>
          </div>
        </>
      ) : (
        <p className="text-muted text-[.93rem]">No number given.</p>
      )}
      {lead.email && <p className="text-[.95rem] mt-4 [overflow-wrap:anywhere]">{lead.email}</p>}

      {lead.consent ? (
        <p className="text-muted text-[.8rem] leading-[1.5] mt-4">
          <span className="lbl text-[.62rem] mr-2">Consent</span>
          Ticked the marketing opt-in.
        </p>
      ) : (
        <p className="inv mt-4 px-3.5 py-3 text-[.9rem] leading-[1.45]">
          <span className="lbl inv-muted block text-[.62rem] mb-1">Consent</span>
          No marketing opt-in — reply about this request only.
        </p>
      )}
    </div>
  )
}

function Fact({ k, children, wide = false }: { k: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'min-w-0 col-span-2' : 'min-w-0'}>
      <dt className="lbl text-muted text-[.62rem] mb-1">{k}</dt>
      <dd className="text-[.93rem] leading-[1.45] [overflow-wrap:anywhere]">{children}</dd>
    </div>
  )
}

/**
 * One lead, written for whoever is about to phone them.
 *
 * The order is deliberate: what they said comes before the controls, because
 * the point of the page is that the call opens with their own words rather
 * than with ours. The controls are one call sheet in the order of a call:
 * reach them, record what happened, leave word for the next person.
 */
export default function LeadDetail() {
  const { id = '' } = useParams()
  const [lead, setLead] = useState<Full | null>(null)
  const [denied, setDenied] = useState(false)
  const [missing, setMissing] = useState(false)
  const [note, setNote] = useState('')
  const [outcome, setOutcome] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () =>
    hq
      .lead(id)
      .then(l => {
        setLead(l)
        setOutcome(l.outcome ?? '')
        setFollowUp(l.followUpAt ? l.followUpAt.slice(0, 10) : '')
      })
      .catch((err: unknown) => {
        const code = (err as { response?: { status?: number } })?.response?.status
        if (code === 401 || code === 403) setDenied(true)
        else if (code === 404) setMissing(true)
        else toast.error('Could not load that lead.')
      })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const patch = async (data: Record<string, unknown>, said: string) => {
    setBusy(true)
    try {
      await hq.update(id, data)
      await load()
      toast.success(said)
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'That did not save.'
      )
    } finally {
      setBusy(false)
    }
  }

  const addNote = async () => {
    const text = note.trim()
    if (!text) return
    setBusy(true)
    try {
      await hq.note(id, text)
      setNote('')
      await load()
    } catch {
      toast.error('The note did not save.')
    } finally {
      setBusy(false)
    }
  }

  if (denied) return <Denied />

  if (missing) {
    return (
      <>
        <PageHead n="—" title="No such lead" sub="It may have been removed." />
        <section className="pb-20"><div className="wrap"><Link to="/hq" className="btn">Back to HQ</Link></div></section>
      </>
    )
  }

  if (!lead) {
    return (
      <section className="py-20"><div className="wrap"><p className="lbl text-muted" role="status">Loading…</p></div></section>
    )
  }

  const words = ownWords(lead)
  const answersLead = !words && lead.answers.length > 0

  return (
    <>
      <div className="wrap pt-8">
        <Link to="/hq" className="lbl text-muted hover:text-ink">← Lead HQ</Link>
      </div>

      <PageHead n="HQ" title={display(lead)} sub={lead.summary}>
        <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-5 pt-5 border-t border-hairline">
          <Fact k="Status">
            <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="lbl text-[.78rem]">{lead.status}</span>
              {lead.hot && <HotMark />}
            </span>
          </Fact>
          <Fact k={lead.waitingMinutes != null ? 'Waiting' : 'Contacted'}>
            {lead.waitingMinutes != null
              ? <Wait minutes={lead.waitingMinutes} />
              : lead.contactedAt ? when(lead.contactedAt) : '—'}
          </Fact>
          <Fact k="Arrived">{when(lead.createdAt)}</Fact>
          <Fact k="Follow up">{lead.followUpAt ? dueDay(lead.followUpAt) : 'None set'}</Fact>
          <Fact k="Score"><span className="num">{lead.score}</span></Fact>
          {lead.segment && <Fact k="Segment">{lead.segment}</Fact>}
          <Fact k="Came from" wide>{lead.sourceLine}</Fact>
          {lead.assignedTo && <Fact k="Assigned to">{lead.assignedTo}</Fact>}
        </dl>
      </PageHead>

      <section className="pb-20">
        <div className="wrap grid gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] items-start">
          {/* ------------------------------------------------ what they told us */}
          <div className="min-w-0">
            {lead.hot && (
              <div className="flex border-2 border-ink mb-10">
                <div aria-hidden="true" className="spine spine-dark w-[34px] sm:w-[42px] min-h-[120px]">
                  <span className="st">Hot</span>
                  <Colophon className="cx mt-auto" />
                </div>
                <div className="min-w-0 flex-1 p-5 sm:p-6">
                  <span className="lbl text-muted block mb-2 text-[.64rem]">Why this is hot</span>
                  <p className="text-[1.15rem] sm:text-[1.3rem] leading-[1.4] [overflow-wrap:anywhere]">
                    {lead.hotReason ?? 'Marked hot. No reason was recorded with it.'}
                  </p>
                </div>
              </div>
            )}

            {words ? (
              <figure className="mb-12">
                <figcaption className="lbl text-muted text-[.7rem] mb-4">In their own words</figcaption>
                <blockquote className="relative border-l-2 border-ink pl-5 sm:pl-8 max-w-[40em]">
                  <span aria-hidden="true" className="d block text-[3.4rem] leading-[.6] mb-1 text-muted">“</span>
                  <p className="text-[1.2rem] sm:text-[1.4rem] leading-[1.5] whitespace-pre-wrap [overflow-wrap:anywhere]">{words}</p>
                </blockquote>
              </figure>
            ) : (
              <p className="text-muted text-[.93rem] leading-[1.6] mb-10 max-w-[56ch] border-l-2 border-hairline pl-5">
                {lead.answers.length > 0
                  ? 'They wrote nothing in their own words. Their answers to the tool are below — open with those.'
                  : 'They wrote nothing in their own words and left no answers. Open by asking what the book is.'}
              </p>
            )}

            {/* On a phone, the way to reach them sits right under what they said. */}
            <div className="lg:hidden mb-12 pt-5 rule-t">
              <Reach lead={lead} />
            </div>

            {lead.answers.length > 0 && (
              <div className="mb-12">
                <h2 className="lbl text-muted text-[.7rem] mb-1">What they told the tool</h2>
                <dl className="rule-t">
                  {lead.answers.map((a, i) => (
                    <div key={i} className="hair-b py-3.5 grid grid-cols-[2rem_minmax(0,1fr)] sm:grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 items-baseline">
                      <span aria-hidden="true" className="num text-muted text-[.75rem]">{String(i + 1).padStart(2, '0')}</span>
                      <div className="min-w-0">
                        <dt className="text-muted text-[.86rem] leading-[1.5] [overflow-wrap:anywhere]">{a.label}</dt>
                        <dd
                          className={
                            a.value === 'skipped'
                              ? 'lbl text-muted text-[.66rem] mt-1'
                              : answersLead
                                ? 'text-[1.12rem] sm:text-[1.2rem] leading-[1.45] mt-1 [overflow-wrap:anywhere]'
                                : 'text-[1rem] leading-[1.5] mt-0.5 [overflow-wrap:anywhere]'
                          }
                        >
                          {a.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <h2 className="lbl text-muted text-[.7rem] mb-1">Timeline · newest first</h2>
            <ol className="rule-t">
              {lead.events.map(e => (
                <li key={e.id} className="hair-b py-3 grid grid-cols-1 sm:grid-cols-[10rem_minmax(0,1fr)] gap-x-6 gap-y-1 items-baseline">
                  <span className="num text-muted text-[.72rem]">{when(e.createdAt)}</span>
                  <div className="min-w-0">
                    <span className={e.kind === 'note' ? 'lbl text-ink text-[.66rem]' : 'lbl text-muted text-[.66rem]'}>
                      {KIND[e.kind] ?? e.kind}
                    </span>
                    {e.detail && (
                      <p
                        className={
                          e.kind === 'note'
                            ? 'text-[.98rem] leading-[1.55] mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]'
                            : 'text-muted text-[.86rem] leading-[1.5] mt-1 [overflow-wrap:anywhere]'
                        }
                      >
                        {e.detail}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ------------------------------------------------------ call sheet */}
          <aside aria-label="Call sheet" aria-busy={busy} className="min-w-0 border-2 border-ink">
            <div className="hidden lg:block p-5 sm:p-6">
              <Reach lead={lead} />
            </div>

            <div className="p-5 sm:p-6 lg:border-t lg:border-hairline">
              <h2 className="lbl text-[.7rem] mb-5">After the call</h2>

              <div role="group" aria-labelledby="hq-status-label" className="mb-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 mb-2.5">
                  <span id="hq-status-label" className="lbl text-muted text-[.66rem]">Status</span>
                  <span className="lbl text-[.66rem]">Now {lead.status}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STATUSES.map(s =>
                    s === lead.status ? (
                      <button key={s} type="button" aria-pressed="true" disabled className="btn block text-center px-2 py-2.5 text-[.68rem] cursor-default">
                        {s}
                      </button>
                    ) : (
                      <button
                        key={s}
                        type="button"
                        aria-pressed="false"
                        disabled={busy}
                        onClick={() => patch({ status: s }, `Marked ${s}.`)}
                        className="btn-o block text-center px-2 py-2 text-[.68rem] disabled:opacity-50"
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mb-7">
                <label htmlFor="hq-outcome" className="lbl block mb-2 text-muted text-[.66rem]">Outcome</label>
                <textarea
                  id="hq-outcome"
                  rows={3}
                  value={outcome}
                  onChange={e => setOutcome(e.target.value)}
                  placeholder="What came of the call"
                  className={areaClass}
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => patch({ outcome }, 'Outcome saved.')}
                  className="btn-o btn-sm mt-2 disabled:opacity-50"
                >
                  Save outcome
                </button>
              </div>

              <div>
                <label htmlFor="hq-followup" className="lbl block mb-2 text-muted text-[.66rem]">Follow up on</label>
                <div className="flex flex-wrap gap-2">
                  <input
                    id="hq-followup"
                    type="date"
                    value={followUp}
                    onChange={e => setFollowUp(e.target.value)}
                    className="flex-1 min-w-[9.5rem] px-3 py-2.5 text-[.95rem] bg-transparent text-ink outline-none border-2 border-hairline transition-colors focus:border-ink"
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => patch({ followUpAt: followUp || null }, followUp ? 'Follow-up set.' : 'Follow-up cleared.')}
                    className="btn-o btn-sm disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
                <p className="text-muted text-[.78rem] mt-2">
                  {lead.followUpAt ? `Set for ${dueDay(lead.followUpAt)}. Empty the date and save to clear it.` : 'None set.'}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 border-t border-hairline">
              <label htmlFor="hq-note" className="lbl block mb-2 text-[.7rem]">For the next person</label>
              <textarea
                id="hq-note"
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Anything the next person should know"
                className={areaClass}
              />
              <button type="button" disabled={busy || !note.trim()} onClick={addNote} className="btn btn-sm mt-2 disabled:opacity-50">
                Add note
              </button>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
