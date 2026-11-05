import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import { hq, type HQLead } from '@/lib/api'

type Tab = 'today' | 'inbox' | 'insights'

const STATUSES = ['NEW', 'CONTACTED', 'BOOKED', 'WON', 'LOST', 'JUNK'] as const

/** How long someone has been waiting, in the words a person would use. */
function waited(minutes: number | null): string {
  if (minutes == null) return ''
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  if (h < 24) return `${h}h ${minutes % 60}m`
  const d = Math.floor(h / 24)
  return `${d}d ${h % 24}h`
}

/**
 * Speed-to-lead, shown as a word rather than a colour alone: the row says
 * "cold" next to the timer so it reads the same to someone who cannot
 * distinguish the two shades.
 */
function temperature(minutes: number | null): string | null {
  if (minutes == null) return null
  if (minutes < 15) return 'fresh'
  if (minutes < 120) return 'cooling'
  return 'cold'
}

function LeadRow({ lead }: { lead: HQLead }) {
  const temp = temperature(lead.waitingMinutes)
  return (
    <div className="hair-b py-4 grid gap-x-5 gap-y-2 grid-cols-1 md:grid-cols-[3.5rem_minmax(0,1fr)_auto] items-baseline">
      <span className="num text-muted">{lead.score}</span>
      <div className="min-w-0">
        <h3 className="text-[1.1rem] mb-1">
          <Link to={`/hq/lead/${lead.id}`} className="hover:opacity-80">
            {lead.name || lead.email || lead.phoneDisplay || 'No name given'}
          </Link>
          {lead.hot && (
            <span className="lbl ml-3 px-1.5 py-0.5 align-middle" style={{ background: 'var(--ink)', color: 'var(--ground)', fontSize: '.6rem' }}>
              Hot
            </span>
          )}
        </h3>
        <p className="text-muted text-[.88rem] leading-[1.5] break-words">{lead.summary}</p>
        <p className="text-muted mt-1" style={{ fontSize: '.76rem' }}>
          {lead.sourceLine}
          {lead.phoneDisplay && ` · ${lead.phoneDisplay}`}
          {!lead.consent && ' · no marketing opt-in'}
        </p>
      </div>
      <div className="md:text-right">
        <span className="lbl text-muted block" style={{ fontSize: '.66rem' }}>{lead.status}</span>
        {temp && (
          <span className="lbl block mt-1" style={{ fontSize: '.66rem' }}>
            {waited(lead.waitingMinutes)} · {temp}
          </span>
        )}
      </div>
    </div>
  )
}

export default function LeadHQ() {
  const [tab, setTab] = useState<Tab>('today')
  const [denied, setDenied] = useState(false)

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

  if (denied) {
    return (
      <>
        <PageHead n="—" title="Lead HQ" sub="Only the house can open this." />
        <section className="pb-20">
          <div className="wrap">
            <div className="p-6" style={{ border: '2px solid var(--ink)' }}>
              <h2 className="text-[1.3rem] mb-2">Sign in as an administrator</h2>
              <p className="text-muted text-[.93rem] mb-5">
                These rows are other people's names, numbers and unpublished books.
              </p>
              <Link to="/login" className="btn">Sign in</Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHead
        n="HQ"
        title="Lead HQ"
        sub="Who is waiting, what they told us, and which tools bring the calls."
      />

      <section className="pb-20">
        <div className="wrap">
          <div className="flex gap-6 mb-8 rule-t pt-5" role="tablist" aria-label="Lead HQ sections">
            {(['today', 'inbox', 'insights'] as Tab[]).map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className="lbl pb-0.5 border-b-2"
                style={{
                  fontSize: '.74rem',
                  borderColor: tab === t ? 'var(--ink)' : 'transparent',
                  opacity: tab === t ? 1 : 0.6,
                }}
              >
                {t === 'today' ? 'Today' : t === 'inbox' ? 'Inbox' : 'Insights'}
              </button>
            ))}
          </div>

          {tab === 'today' && (
            today === null ? <p className="lbl text-muted">Loading…</p> : (
              <>
                <p className="text-muted text-[.9rem] mb-7 max-w-[60ch]">
                  {today.waiting === 0
                    ? 'Nobody is waiting.'
                    : `${today.waiting} ${today.waiting === 1 ? 'person has' : 'people have'} asked for something and not been called yet. The oldest is first — it is the one about to go cold.`}
                </p>

                <h2 className="lbl text-muted mb-1" style={{ fontSize: '.7rem' }}>Call these first</h2>
                <div className="rule-t mb-10">
                  {today.hot.length === 0
                    ? <p className="text-muted text-[.9rem] py-5">Nothing hot is waiting.</p>
                    : today.hot.map(l => <LeadRow key={l.id} lead={l} />)}
                </div>

                <h2 className="lbl text-muted mb-1" style={{ fontSize: '.7rem' }}>Follow-ups due</h2>
                <div className="rule-t">
                  {today.dueFollowUps.length === 0
                    ? <p className="text-muted text-[.9rem] py-5">None due.</p>
                    : today.dueFollowUps.map(l => <LeadRow key={l.id} lead={l} />)}
                </div>
              </>
            )
          )}

          {tab === 'inbox' && (
            <>
              <div className="flex flex-wrap gap-4 items-end mb-7">
                <div>
                  <label htmlFor="hq-status" className="lbl block mb-2 text-muted">Status</label>
                  <select
                    id="hq-status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="px-3 py-2.5 text-[.9rem] bg-transparent outline-none"
                    style={{ border: '2px solid var(--hairline)', color: 'var(--ink)' }}
                  >
                    <option value="">All</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[12rem]">
                  <label htmlFor="hq-q" className="lbl block mb-2 text-muted">Search</label>
                  <input
                    id="hq-q"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Name, email, number, what they said"
                    className="w-full px-3 py-2.5 text-[.9rem] bg-transparent outline-none"
                    style={{ border: '2px solid var(--hairline)', color: 'var(--ink)' }}
                  />
                </div>
              </div>

              {inbox === null ? <p className="lbl text-muted">Loading…</p> : (
                <>
                  <p className="lbl text-muted mb-1" style={{ fontSize: '.7rem' }}>
                    {inbox.total} {inbox.total === 1 ? 'lead' : 'leads'}
                  </p>
                  <div className="rule-t">
                    {inbox.leads.length === 0
                      ? <p className="text-muted text-[.9rem] py-5">Nothing matches.</p>
                      : inbox.leads.map(l => <LeadRow key={l.id} lead={l} />)}
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'insights' && (
            insights === null ? <p className="lbl text-muted">Loading…</p> : (
              <>
                <p className="text-muted text-[.9rem] mb-8 max-w-[62ch]">
                  Counts of what has actually arrived. Nothing here is a rate or a projection — with
                  this few leads a percentage would read as a finding when it is noise.
                </p>

                <h2 className="lbl text-muted mb-1" style={{ fontSize: '.7rem' }}>By tool</h2>
                <div className="rule-t mb-10">
                  {insights.byTool.length === 0
                    ? <p className="text-muted text-[.9rem] py-5">No leads yet.</p>
                    : insights.byTool.map(t => (
                      <div key={t.formType} className="hair-b py-3.5 flex flex-wrap items-baseline justify-between gap-3">
                        <span className="text-[1rem]">{t.label}</span>
                        <span className="lbl text-muted" style={{ fontSize: '.7rem' }}>
                          {t.leads} {t.leads === 1 ? 'lead' : 'leads'}
                          {t.won > 0 && ` · ${t.won} won`}
                        </span>
                      </div>
                    ))}
                </div>

                <h2 className="lbl text-muted mb-1" style={{ fontSize: '.7rem' }}>By channel</h2>
                <div className="rule-t mb-10">
                  {insights.byChannel.length === 0
                    ? <p className="text-muted text-[.9rem] py-5">No leads yet.</p>
                    : insights.byChannel.map(c => (
                      <div key={c.channel} className="hair-b py-3.5 flex items-baseline justify-between gap-3">
                        <span className="text-[1rem]">{c.channel}</span>
                        <span className="lbl text-muted" style={{ fontSize: '.7rem' }}>{c.leads}</span>
                      </div>
                    ))}
                </div>

                <h2 className="lbl text-muted mb-1" style={{ fontSize: '.7rem' }}>By campaign</h2>
                <div className="rule-t">
                  {insights.byCampaign.length === 0
                    ? <p className="text-muted text-[.9rem] py-5">Nothing tagged yet.</p>
                    : insights.byCampaign.map(c => (
                      <div key={c.campaign} className="hair-b py-3.5 flex items-baseline justify-between gap-3">
                        <span className="text-[1rem]">{c.campaign}</span>
                        <span className="lbl text-muted" style={{ fontSize: '.7rem' }}>{c.leads}</span>
                      </div>
                    ))}
                </div>
              </>
            )
          )}
        </div>
      </section>
    </>
  )
}
