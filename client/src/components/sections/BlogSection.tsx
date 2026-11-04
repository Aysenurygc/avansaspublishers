import { Link } from 'react-router-dom'

export const posts = [
  { slug: 'what-a-spine-has-to-do',    n: '01', title: 'What a spine has to do',           cat: 'Design',      read: '6 min', excerpt: 'Be read from two metres away. Survive a thumbnail. Carry the title, the author and the house in a strip the width of a finger.' },
  { slug: 'ghostwriting-plainly',      n: '02', title: 'Ghostwriting, explained plainly',  cat: 'Writing',     read: '7 min', excerpt: 'Who writes it, whose name goes on it, and what you actually own at the end. No euphemisms.' },
  { slug: 'self-publishing-numbers',   n: '03', title: 'Self-publishing: the real numbers', cat: 'Publishing', read: '9 min', excerpt: 'Royalty rates, timelines and what a launch costs when nobody is rounding in their own favour.' },
]

export default function BlogSection() {
  return (
    <section className="band panel">
      <div className="wrap">
        <div className="sh">
          <span className="n num">07</span>
          <h2>From the desk</h2>
          <p className="sub">What we have learned making books, written down without the marketing.</p>
        </div>

        <div style={{ borderTop: '1px solid var(--hairline)' }}>
          {posts.map(p => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="grid gap-y-2 gap-x-4 py-5 hair-b transition-opacity hover:opacity-70
                         grid-cols-[44px_minmax(0,1fr)] items-start
                         md:grid-cols-[62px_minmax(0,1.3fr)_minmax(0,2fr)_auto] md:gap-x-[22px] md:items-center"
            >
              <span className="num text-muted">{p.n}</span>
              <h3 className="text-[1.2rem]">{p.title}</h3>
              <p className="col-start-2 md:col-start-auto text-muted text-[.92rem] leading-[1.5]">{p.excerpt}</p>
              <span className="col-start-2 md:col-start-auto lbl text-muted whitespace-nowrap" style={{ fontSize: '.66rem' }}>
                {p.cat} · {p.read}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
