import { Link } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import CTA from '@/components/sections/CTA'
import { posts } from '@/components/sections/BlogSection'

export default function Blog() {
  return (
    <>
      <PageHead
        n="07"
        title="From the desk"
        sub="What we have learned making books, written down without the marketing."
      />

      <section className="pb-20">
        <div className="wrap">
          <div style={{ borderTop: '2px solid var(--ink)' }}>
            {posts.map(p => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="grid gap-y-2 gap-x-4 py-6 hair-b transition-colors hover:bg-panel
                           grid-cols-[44px_minmax(0,1fr)] items-start
                           md:grid-cols-[62px_minmax(0,1.3fr)_minmax(0,2fr)_auto] md:gap-x-[22px] md:items-center"
              >
                <span className="num text-muted">{p.n}</span>
                <h3 className="text-[1.25rem]">{p.title}</h3>
                <p className="col-start-2 md:col-start-auto text-muted text-[.92rem] leading-[1.5]">{p.excerpt}</p>
                <span className="col-start-2 md:col-start-auto lbl text-muted whitespace-nowrap" style={{ fontSize: '.66rem' }}>
                  {p.cat} · {p.read}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
