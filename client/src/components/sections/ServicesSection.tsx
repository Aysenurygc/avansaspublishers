import { Link } from 'react-router-dom'

export const services = [
  { n: '01', slug: 'ghostwriting',    title: 'Ghostwriting',      from: 1249, desc: 'We write the book with you. You keep the copyright, the credit and every royalty.' },
  { n: '02', slug: 'editing',         title: 'Editing',           from: 299,  desc: 'Structural, line and copy editing by editors with trade publishing on their CV.' },
  { n: '03', slug: 'cover-design',    title: 'Cover Design',      from: 349,  desc: 'Genre-researched covers built to work at thumbnail size and on a shelf.' },
  { n: '04', slug: 'formatting',      title: 'Interior & Spine',  from: 199,  desc: 'Print-ready layout for paperback and hardcover, plus EPUB. The spine gets drawn, not filled in.' },
  { n: '05', slug: 'book-publishing', title: 'Publishing',        from: 499,  desc: 'ISBNs, metadata, categories and upload to Amazon KDP, IngramSpark and Barnes & Noble.' },
  { n: '06', slug: 'audiobook',       title: 'Audiobook',         from: 799,  desc: 'Narrator casting, studio recording and distribution to Audible, Apple and Spotify.' },
  { n: '07', slug: 'marketing',       title: 'Marketing',         from: 599,  desc: 'Listing optimisation, advance readers, launch sequence and press outreach.' },
  { n: '08', slug: 'author-website',  title: 'Author Site',       from: 999,  desc: 'A site that sells the book and grows a mailing list. Fast, plain, yours.' },
]

export default function ServicesSection() {
  return (
    <section className="band">
      <div className="wrap">
        <div className="sh">
          <span className="n num">01</span>
          <h2>Everything a book needs. Nothing it doesn't.</h2>
          <p className="sub">Eight services, each run by people who have done it before. Take one or take all of them.</p>
        </div>

        <div style={{ borderTop: '1px solid var(--hairline)' }}>
          {services.map(s => (
            <Link
              key={s.slug}
              to={`/services/${s.slug}`}
              className="grid gap-y-2 gap-x-4 py-5 hair-b transition-colors hover:bg-panel
                         grid-cols-[44px_minmax(0,1fr)] items-start
                         md:grid-cols-[62px_minmax(0,1.15fr)_minmax(0,2fr)_auto] md:gap-x-[22px] md:items-center"
            >
              <span className="num text-muted">{s.n}</span>
              <h3 className="text-[1.32rem]">{s.title}</h3>
              <p className="col-start-2 md:col-start-auto text-muted text-[.93rem] leading-[1.5]">{s.desc}</p>
              <span
                className="col-start-2 md:col-start-auto num whitespace-nowrap text-muted md:text-ink"
                style={{ fontSize: '.86rem' }}
              >
                from ${s.from.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
