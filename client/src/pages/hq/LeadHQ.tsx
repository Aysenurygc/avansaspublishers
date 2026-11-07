import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import Colophon from '@/components/ui/Colophon'
import { hq, type HQLead } from '@/lib/api'
import { Denied, HotMark, STATUSES, Wait, display, dueDay, fieldClass } from './shared'

type Tab = 'today' | 'inbox' | 'insights'

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'insights', label: 'Insights' },
]

/** What the server returns at most (routes/leads.js `take`). A full list may be longer. */
const HOT_CAP = 100
const FOLLOW_UP_CAP = 50

/** The small line under every lead: where from, the number, and the consent flag. */
function Provenance({ lead }: { lead: HQLead }) {
  return (
    <p className="text-muted text-[.76rem] leading-[1.5] mt-1.5 [overflow-wrap:anywhere]">
      {lead.sourceLine}
      {lead.phoneDisplay && (
        <>
          {' · '}
          <span className="num">{lead.phoneDisplay}</span>
        </>
      )}
      {!lead.consent && <span className="text-ink"> · no marketing opt-in</span>}
    </p>
  )
}

/**
 * One lead in a list. The left figure is its place in the list, not its
 * score: in a queue the number that matters is "who is next".
 */
function LeadRow({ lead, n, due = false }: { lead: HQLead; n: number; due?: boolean }) {
  return (
    <div className="hair-b py-4 grid gap-x-4 sm:gap-x-6 gap-y-2 grid-cols-[2rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)_10.5rem] items-baseline">
      <span className="num text-muted text-[.82rem]">{String(n).padStart(2, '0')}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
          <h3 className="min-w-0 text-[1.3rem] sm:text-[1.45rem] [overflow-wrap:anywhere]">
            <Link to={`/hq/lead/${lead.id}`} className="hover:opacity-80">{display(lead)}</Link>
          </h3>
          {lead.hot && <HotMark />}
        </div>
        <p className="text-[.9rem] leading-[1.5] [overflow-wrap:anywhere]">{lead.summary}</p>
        <Provenance lead={lead} />
      </div>
      <div className="col-start-2 md:col-start-auto flex flex-wrap md:flex-col md:items-end gap-x-3 gap-y-1 items-baseline">
        <span className="lbl text-muted text-[.66rem]">{lead.status}</span>
        {due && lead.followUpAt && (
          <span className="lbl text-ink text-[.66rem]">Due {dueDay(lead.followUpAt)}</span>
        )}
        <Wait minutes={lead.waitingMinutes} />
        <span className="lbl text-muted text-[.66rem]">
          Score <span className="num">{lead.score}</span>
        </span>
      </div>
    </div>
  )
}

/** The oldest hot lead, drawn as a book on the desk: a dark spine and an open page. */
function NextCall({ lead }: { lead: HQLead }) {
  return (
    <article aria-labelledby="hq-next-name" className="flex border-2 border-ink mb-12">
      <div aria-hidden="true" className="spine spine-dark w-[38px] sm:w-[48px]">
        <span className="st">Call next</span>
        <Colophon className="cx mt-auto" />
      </div>
      <div className="min-w-0 flex-1 p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-4">
          <span className="lbl text-muted">Call next · waiting longest</span>
          <Wait minutes={lead.waitingMinutes} big />
        </div>
        <h3 id="hq-next-name" className="text-[2rem] sm:text-[2.7rem] mb-4 [overflow-wrap:anywhere]">
          <Link to={`/hq/lead/${lead.id}`} className="hover:opacity-80">{display(lead)}</Link>
        </h3>
        {lead.hotReason && (
          <div className="mb-4 max-w-[56ch]">
            <span className="lbl text-muted block mb-1.5 text-[.64rem]">Why this is hot</span>
            <p className="text-[1.08rem] sm:text-[1.2rem] leading-[1.45] [overflow-wrap:anywhere]">{lead.hotReason}</p>
          </div>
        )}
        <p className="text-muted text-[.9rem] leading-[1.5] [overflow-wrap:anywhere]">{lead.summary}</p>
        <Provenance lead={lead} />
        <div className="mt-6 pt-5 border-t border-hairline flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link to={`/hq/lead/${lead.id}`} className="btn text-center">Read them, then call</Link>
          <span className="lbl text-muted text-[.66rem]">
            Score <span className="num">{lead.score}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

/** One figure in the shift ledger. `cap` marks a list the server cut short. */
function Figure({ value, label, cap }: { value: number; label: string; cap?: number }) {
  return (
    <div className="min-w-0 pt-3 border-t-2 border-ink">
      <span className="num block text-[2rem] sm:text-[2.8rem] leading-none">
        {value}
        {cap != null && value >= cap && <span className="lbl text-muted text-[.62rem] ml-1.5">or more</span>}
      </span>
      <span className="lbl text-muted block mt-2 text-[.64rem] leading-[1.35]">{label}</span>
    </div>
  )
}

function SectionHead({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
      <h2 className="lbl text-muted text-[.7rem]">{children}</h2>
      {aside}
    </div>
  )
}

function Loading() {
  return <p className="lbl text-muted py-6" role="status">Loading…</p>
}

/**
 * A count with a bar drawn from the same count, against the largest row in
 * its own list. Counts only: no rate, no trend, nothing the data cannot carry.
 */
function CountRow({ label, value, max, extra }: { label: string; value: number; max: number; extra?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="hair-b py-3.5 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 items-baseline">
      <span className="text-[1rem] [overflow-wrap:anywhere]">{label}</span>
      <span className="num text-[1.05rem] text-right">
        {value}
        {extra && <span className="lbl text-muted text-[.62rem] ml-2">{extra}</span>}
      </span>
      <div aria-hidden="true" className="col-span-2 mt-2 h-[5px] bg-hairline">
        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function LeadHQ() {
  const [tab, setTab] = useState<Tab>('today')
  const [denied, setDenied] = useState(false)
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({})

  const [today, setToday] = useState<{ hot: HQLead[]; dueFollowUps: HQLead[]; waiting: number } | null>(null)
  const [inbox, setInbox] = useState<{ leads: HQLead[]; total: number } | null>(null)
  const [insights, setInsights] = useState<Awaited<ReturnType<typeof hq.insights>> | null>(null)

  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')

  const fail = (err: unknown) => {
    const code = (err as { response?: { status?: number } })?.response?.status
    if (code === 401 || code === 403) setDenied(true)
  }

  useEffect(() => {
    if (tab === 'today') hq.today().then(setToday).catch(fail)
    if (tab === 'insights') hq.insights().then(setInsights).catch(fail)
  }, [tab])

  useEffect(() => {
    if (tab !== 'inbox') return
    const params: Record<string, string> = {}
    if (status) params.status = status
    if (q.trim()) params.q = q.trim()
    const t = setTimeout(() => hq.inbox(params).then(setInbox).catch(fail), 250)
    return () => clearTimeout(t)
  }, [tab, status, q])

  /** Arrow keys move between tabs and select them; Home and End jump to the ends. */
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    let j: number
    if (e.key === 'ArrowRight') j = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') j = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') j = 0
    else if (e.key === 'End') j = TABS.length - 1
    else return
    e.preventDefault()
    const next = TABS[j].id
    setTab(next)
    tabRefs.current[next]?.focus()
  }

  if (denied) return <Denied />

  const shiftDate = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <>
      <PageHead
        n="HQ"
        title="Lead HQ"
        sub="Who is waiting, what they told us, and which tools bring the calls."
      />

      <section className="pb-20">
        <div className="wrap">
          <div className="flex gap-7 sm:gap-10 mb-10 rule-t pt-4" role="tablist" aria-label="Lead HQ sections">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={el => { tabRefs.current[t.id] = el }}
                id={`hq-tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                aria-controls={`hq-panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={e => onTabKey(e, i)}
                className={
                  tab === t.id
                    ? 'd text-[1.35rem] sm:text-[1.6rem] pb-1.5 border-b-[3px] border-ink text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'
                    : 'd text-[1.35rem] sm:text-[1.6rem] pb-1.5 border-b-[3px] border-transparent text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink'
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ------------------------------------------------------------ today */}
          <div id="hq-panel-today" role="tabpanel" aria-labelledby="hq-tab-today" tabIndex={0} hidden={tab !== 'today'}>
            {tab === 'today' && (today === null ? <Loading /> : (
              <>
                <div className="mb-10">
                  <span className="lbl text-muted block mb-4">The shift · {shiftDate}</span>
                  <div className="grid grid-cols-3 gap-x-4 sm:gap-x-8 mb-6 max-w-[44rem]">
                    <Figure value={today.hot.length} label="Hot, not yet called" cap={HOT_CAP} />
                    <Figure value={today.dueFollowUps.length} label="Follow-ups due" cap={FOLLOW_UP_CAP} />
                    <Figure value={today.waiting} label="New, all waiting" />
                  </div>
                  <p className="text-muted text-[.93rem] leading-[1.6] max-w-[60ch]">
                    {today.waiting === 0
                      ? 'Nobody is waiting.'
                      : `${today.waiting} ${today.waiting === 1 ? 'person has' : 'people have'} asked for something and not been called yet. The oldest is first — it is the one about to go cold.`}
                  </p>
                </div>

                {today.hot.length === 0 ? (
                  <div className="rule-t py-6 mb-12">
                    <p className="text-[1.05rem] mb-1">Nothing hot is waiting.</p>
                    {today.waiting > 0 && (
                      <button
                        type="button"
                        onClick={() => { setStatus('NEW'); setTab('inbox') }}
                        className="lbl text-muted underline decoration-1 underline-offset-4 hover:text-ink mt-2"
                      >
                        See the new leads in the inbox
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <NextCall lead={today.hot[0]} />
                    {today.hot.length > 1 && (
                      <div className="mb-12">
                        <SectionHead>Then, in order</SectionHead>
                        <div className="rule-t">
                          {today.hot.slice(1).map((l, i) => <LeadRow key={l.id} lead={l} n={i + 2} />)}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <SectionHead>Follow-ups due</SectionHead>
                <div className="rule-t">
                  {today.dueFollowUps.length === 0
                    ? <p className="text-muted text-[.93rem] py-5">None due.</p>
                    : today.dueFollowUps.map((l, i) => <LeadRow key={l.id} lead={l} n={i + 1} due />)}
                </div>
              </>
            ))}
          </div>

          {/* ------------------------------------------------------------ inbox */}
          <div id="hq-panel-inbox" role="tabpanel" aria-labelledby="hq-tab-inbox" tabIndex={0} hidden={tab !== 'inbox'}>
            {tab === 'inbox' && (
              <>
                <div className="panel p-4 sm:p-5 mb-8 grid gap-4 grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)] items-end">
                  <div className="min-w-0">
                    <label htmlFor="hq-status" className="lbl block mb-2 text-muted">Status</label>
                    <select id="hq-status" value={status} onChange={e => setStatus(e.target.value)} className={fieldClass}>
                      <option value="">All</option>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="hq-q" className="lbl block mb-2 text-muted">Search</label>
                    <input
                      id="hq-q"
                      type="search"
                      value={q}
                      onChange={e => setQ(e.target.value)}
                      placeholder="Name, email, number, what they said"
                      className={fieldClass}
                    />
                  </div>
                </div>

                {inbox === null ? <Loading /> : (
                  <>
                    <SectionHead
                      aside={
                        inbox.total > inbox.leads.length && (
                          <span className="lbl text-muted text-[.64rem]">
                            Showing the first <span className="num">{inbox.leads.length}</span>
                          </span>
                        )
                      }
                    >
                      <span className="num">{inbox.total}</span> {inbox.total === 1 ? 'lead' : 'leads'} · hot first, then newest
                    </SectionHead>
                    <div className="rule-t" aria-live="polite">
                      {inbox.leads.length === 0
                        ? <p className="text-muted text-[.93rem] py-5">Nothing matches.</p>
                        : inbox.leads.map((l, i) => <LeadRow key={l.id} lead={l} n={i + 1} />)}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* --------------------------------------------------------- insights */}
          <div id="hq-panel-insights" role="tabpanel" aria-labelledby="hq-tab-insights" tabIndex={0} hidden={tab !== 'insights'}>
            {tab === 'insights' && (insights === null ? <Loading /> : (
              <>
                <p className="text-muted text-[.93rem] leading-[1.6] mb-10 max-w-[62ch]">
                  Counts of what has actually arrived. Nothing here is a rate or a projection — with
                  this few leads a percentage would read as a finding when it is noise. Junk is left
                  out. Each bar is drawn against the largest row in its own list.
                </p>

                <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-14">
                  <div className="min-w-0 lg:col-span-2">
                    <SectionHead>By tool</SectionHead>
                    <div className="rule-t">
                      {insights.byTool.length === 0
                        ? <p className="text-muted text-[.93rem] py-5">No leads yet.</p>
                        : insights.byTool.map(t => (
                          <CountRow
                            key={t.formType}
                            label={t.label}
                            value={t.leads}
                            max={Math.max(...insights.byTool.map(x => x.leads))}
                            extra={t.won > 0 ? `${t.won} won` : undefined}
                          />
                        ))}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <SectionHead>By channel</SectionHead>
                    <div className="rule-t">
                      {insights.byChannel.length === 0
                        ? <p className="text-muted text-[.93rem] py-5">No leads yet.</p>
                        : insights.byChannel.map(c => (
                          <CountRow key={c.channel} label={c.channel} value={c.leads} max={Math.max(...insights.byChannel.map(x => x.leads))} />
                        ))}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <SectionHead>By campaign</SectionHead>
                    <div className="rule-t">
                      {insights.byCampaign.length === 0
                        ? <p className="text-muted text-[.93rem] py-5">Nothing tagged yet.</p>
                        : insights.byCampaign.map(c => (
                          <CountRow key={c.campaign} label={c.campaign} value={c.leads} max={Math.max(...insights.byCampaign.map(x => x.leads))} />
                        ))}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
