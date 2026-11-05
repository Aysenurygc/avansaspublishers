import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageHead from '@/components/layout/PageHead'
import { hq, type HQEvent, type HQLead } from '@/lib/api'

type Full = HQLead & { answers: { label: string; value: string }[]; events: HQEvent[] }

const STATUSES = ['NEW', 'CONTACTED', 'BOOKED', 'WON', 'LOST', 'JUNK'] as const

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

/**
 * One lead, written for whoever is about to phone them.
 *
 * The order is deliberate: what they said comes before the controls, because
 * the point of the page is that the call opens with their own words rather
 * than with ours.
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

  if (denied) {
    return (
      <>
        <PageHead n="—" title="Lead HQ" sub="Only the house can open this." />
        <section className="pb-20">
          <div className="wrap">
            <Link to="/login" className="btn">Sign in</Link>
          </div>
        </section>
      </>
    )
  }

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
      <section className="py-20"><div className="wrap"><p className="lbl text-muted">Loading…</p></div></section>
    )
  }

  const tel = lead.phone ?? ''
  const waText = tel.replace(/\D/g, '')

  return (
    <>
      <PageHead
        n={String(lead.score)}
        title={lead.name || lead.email || lead.phoneDisplay || 'No name given'}
        sub={lead.summary}
      />

      <section className="pb-20">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
          {/* ------------------------------------------------ what they told us */}
          <div className="min-w-0">
            {lead.hot && lead.hotReason && (
              <div className="p-5 mb-8 inv">
                <span className="lbl block mb-1.5" style={{ fontSize: '.64rem' }}>Why this is hot</span>
                <p className="text-[1.05rem]">{lead.hotReason}</p>
              </div>
            )}

            {lead.said && (
              <>
                <h2 className="lbl text-muted mb-2" style={{ fontSize: '.7rem' }}>What they said</h2>
                <p className="text-[1.05rem] leading-[1.6] mb-9 max-w-[60ch] whitespace-pre-wrap break-words">
                  {lead.said}
                </p>
              </>
            )}

            {lead.answers.length > 0 && (
              <>
                <h2 className="lbl text-muted mb-1" style={{ fontSize: '.7rem' }}>Their answers</h2>
                <dl className="rule-t mb-9">
                  {lead.answers.map((a, i) => (
                    <div key={i} className="hair-b py-3">
                      <dt className="text-muted text-[.86rem] leading-[1.5]">{a.label}</dt>
                      <dd className="text-[.98rem] mt-0.5 break-words">{a.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <h2 className="lbl text-muted mb-1" style={{ fontSize: '.7rem' }}>Timeline</h2>
            <div className="rule-t">
              {lead.events.map(e => (
                <div key={e.id} className="hair-b py-3">
                  <span className="lbl text-muted" style={{ fontSize: '.64rem' }}>
                    {when(e.createdAt)} · {e.kind}
                  </span>
                  {e.detail && <p className="text-[.94rem] mt-1 break-words">{e.detail}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------- the actions */}
          <div className="min-w-0 flex flex-col gap-9">
            <div>
              <h2 className="lbl text-muted mb-3" style={{ fontSize: '.7rem' }}>Reach them</h2>
              {lead.phone ? (
                <>
                  <p className="text-[1.15rem] mb-3 break-words">{lead.phoneDisplay}</p>
                  <div className="flex flex-wrap gap-3">
                    <a href={`tel:${tel}`} className="btn">Call</a>
                    <a href={`sms:${tel}`} className="btn-o">Text</a>
                    <a
                      href={`https://wa.me/${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-o"
                    >
                      WhatsApp
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-muted text-[.9rem]">No number given.</p>
              )}
              {lead.email && (
                <p className="text-muted text-[.9rem] mt-3 break-words">{lead.email}</p>
              )}
              <p className="text-muted mt-3" style={{ fontSize: '.76rem' }}>
                {lead.consent
                  ? 'Ticked the marketing opt-in.'
                  : 'No marketing opt-in — reply about this request only.'}
              </p>
            </div>

            <div>
              <h2 className="lbl text-muted mb-3" style={{ fontSize: '.7rem' }}>Where they came from</h2>
              <p className="text-[.94rem] leading-[1.6] break-words">{lead.sourceLine}</p>
              <p className="text-muted mt-2" style={{ fontSize: '.76rem' }}>
                Arrived {when(lead.createdAt)}
              </p>
            </div>

            <div>
              <h2 className="lbl text-muted mb-3" style={{ fontSize: '.7rem' }}>
                Status — now {lead.status}
              </h2>
              <div className="flex flex-wrap gap-2">
                {STATUSES.filter(s => s !== lead.status).map(s => (
                  <button
                    key={s}
                    disabled={busy}
                    onClick={() => patch({ status: s }, `Marked ${s}.`)}
                    className="btn-o disabled:opacity-50"
                    style={{ fontSize: '.7rem' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="hq-followup" className="lbl block mb-2 text-muted" style={{ fontSize: '.7rem' }}>
                Follow up on
              </label>
              <div className="flex gap-2">
                <input
                  id="hq-followup"
                  type="date"
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  className="px-3 py-2.5 text-[.9rem] bg-transparent outline-none min-w-0"
                  style={{ border: '2px solid var(--hairline)', color: 'var(--ink)' }}
                />
                <button
                  disabled={busy}
                  onClick={() => patch({ followUpAt: followUp || null }, followUp ? 'Follow-up set.' : 'Follow-up cleared.')}
                  className="btn-o disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="hq-outcome" className="lbl block mb-2 text-muted" style={{ fontSize: '.7rem' }}>
                Outcome
              </label>
              <textarea
                id="hq-outcome"
                rows={3}
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                placeholder="What came of the call"
                className="w-full px-3 py-2.5 text-[.9rem] bg-transparent outline-none resize-none"
                style={{ border: '2px solid var(--hairline)', color: 'var(--ink)' }}
              />
              <button
                disabled={busy}
                onClick={() => patch({ outcome }, 'Outcome saved.')}
                className="btn-o mt-2 disabled:opacity-50"
              >
                Save outcome
              </button>
            </div>

            <div>
              <label htmlFor="hq-note" className="lbl block mb-2 text-muted" style={{ fontSize: '.7rem' }}>
                Add a note
              </label>
              <textarea
                id="hq-note"
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Anything the next person should know"
                className="w-full px-3 py-2.5 text-[.9rem] bg-transparent outline-none resize-none"
                style={{ border: '2px solid var(--hairline)', color: 'var(--ink)' }}
              />
              <button disabled={busy || !note.trim()} onClick={addNote} className="btn mt-2 disabled:opacity-50">
                Add note
              </button>
            </div>

            <Link to="/hq" className="lbl text-muted" style={{ fontSize: '.7rem' }}>← Back to HQ</Link>
          </div>
        </div>
      </section>
    </>
  )
}
