import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import { projects } from '@/lib/api'

type Project = {
  id: string
  title: string
  service: string
  status: string
  progress: number
  dueDate: string | null
  updatedAt: string
}

const statusLabel: Record<string, string> = {
  PENDING: 'Not started', ACTIVE: 'In progress', REVIEW: 'With you',
  REVISION: 'In revision', COMPLETED: 'Done', PAUSED: 'Paused',
}

export default function Dashboard() {
  const [list, setList] = useState<Project[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    projects.list().then(setList).catch(() => setError(true))
  }, [])

  return (
    <>
      <PageHead n="—" title="Your books" sub="Where each book stands, updated as we work." />

      <section className="pb-20">
        <div className="wrap">
          {error && (
            <div className="p-6" style={{ border: '2px solid var(--ink)' }}>
              <h2 className="text-[1.3rem] mb-2">Sign in to see this</h2>
              <p className="text-muted text-[.93rem] mb-5">Your projects load once you are signed in.</p>
              <Link to="/login" className="btn">Sign in</Link>
            </div>
          )}

          {!error && list === null && (
            <p className="lbl text-muted">Loading…</p>
          )}

          {!error && list !== null && list.length === 0 && (
            <div className="p-6" style={{ border: '2px solid var(--ink)' }}>
              <h2 className="text-[1.3rem] mb-2">Nothing here yet</h2>
              <p className="text-muted text-[.93rem] mb-5">
                When a book is commissioned it appears here with its stage, its progress and its date.
              </p>
              <Link to="/consultation" className="btn">Start your book</Link>
            </div>
          )}

          {!error && list !== null && list.length > 0 && (
            <div style={{ borderTop: '2px solid var(--ink)' }}>
              {list.map(p => (
                <div key={p.id} className="py-6 hair-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-[1.3rem] mb-1">{p.title}</h3>
                      <span className="lbl text-muted" style={{ fontSize: '.66rem' }}>
                        {p.service}
                        {p.dueDate && ` · due ${new Date(p.dueDate).toLocaleDateString()}`}
                      </span>
                    </div>
                    <span className="lbl px-2.5 py-1.5" style={{ background: 'var(--ink)', color: 'var(--ground)', fontSize: '.62rem' }}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2.5" style={{ background: 'var(--hairline)' }}>
                      <div className="h-full" style={{ width: `${p.progress}%`, background: 'var(--ink)' }} />
                    </div>
                    <span className="num" style={{ fontSize: '.84rem' }}>{p.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
