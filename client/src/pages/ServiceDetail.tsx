import { useParams, Link } from 'react-router-dom'
import CTA from '@/components/sections/CTA'
import { services } from '@/components/sections/ServicesSection'

type Detail = { tagline: string; body: string; process: string[]; includes: string[] }

const detail: Record<string, Detail> = {
  ghostwriting: {
    tagline: 'We write it. You own it.',
    body: "You talk, we write, you approve. Our writers have book-length work behind them and no interest in seeing their own name on your cover. You keep the copyright, the credit and every royalty, and the contract says so before we start.",
    process: ['Discovery call and voice interview', 'Writer shortlist, you choose', 'Chapter map approved by you', 'Drafts in batches', 'Revisions until it reads right', 'Final manuscript delivered'],
    includes: ['Full manuscript', 'Voice interviews', 'Chapter-by-chapter review', 'Unlimited revisions', 'Plagiarism check', 'NDA and IP assignment', 'You keep 100% of royalties'],
  },
  'book-publishing': {
    tagline: 'From file to shelf.',
    body: 'The technical half of publishing: ISBNs, metadata, category research, file validation and upload. Done badly it costs you sales for years. Done once, properly, it stops being your problem.',
    process: ['ISBN assignment', 'Metadata and keywords', 'Category selection', 'File preparation and QC', 'Platform upload', 'Sales dashboard handover'],
    includes: ['ISBNs for every format', 'Amazon KDP and IngramSpark', 'Print and digital editions', '150+ retailer distribution', 'Author copies', 'Royalty setup', 'Sales reporting access'],
  },
  editing: {
    tagline: 'The book you meant to write.',
    body: "An editor's first job is to find the book inside the draft and protect your voice while everything around it gets sharper. Structural first, then line, then copy, then a proofread nobody rushes.",
    process: ['Manuscript assessment', 'Structural report', 'Line and copy edit', 'Your revisions', 'Final proofread', 'Clean file delivered'],
    includes: ['Structural editing', 'Line editing', 'Copyediting', 'Proofreading', 'Style sheet', 'Two full passes', 'Tracked changes'],
  },
  'cover-design': {
    tagline: 'It has to work at thumbnail size.',
    body: 'We research what sells in your category, then design against it — not away from it. Five routes, then one refined until it holds up as a 60-pixel thumbnail and as a printed object in a hand.',
    process: ['Category research', 'Five concepts', 'Your feedback', 'Refinement', 'Approval', 'All files delivered'],
    includes: ['Front cover', 'Back cover and spine', 'eBook cover', 'Social media crops', 'Five initial concepts', 'Unlimited revisions', 'Print-ready at 300 DPI'],
  },
  formatting: {
    tagline: 'Invisible when right.',
    body: 'Readers never notice good formatting and always notice bad. Proper margins, a real baseline grid, running heads that make sense, and a spine width calculated from your actual page count and paper stock.',
    process: ['Manuscript review', 'Template selection', 'Interior layout', 'Images and tables placed', 'Proofing pass', 'Final files'],
    includes: ['Print-ready PDF', 'EPUB 3', 'Kindle format', 'Custom chapter openers', 'Image placement', 'Front and back matter', 'Spine width calculated'],
  },
  audiobook: {
    tagline: 'Read aloud, properly.',
    body: 'Narrator casting is the whole job. We shortlist voices against your book, record in a treated studio, then master to retail specification and handle distribution.',
    process: ['Narrator casting', 'Recording schedule', 'Studio recording', 'Quality control', 'Mastering', 'Distribution'],
    includes: ['Professional narrator', 'Studio recording', 'Retail spec compliance', 'Audible and Apple', 'Spotify and Findaway', 'Chapter markers', 'Retail-ready masters'],
  },
  marketing: {
    tagline: 'Found, then read.',
    body: 'Listing optimisation first, because that is where the money is. Then advance readers, a launch sequence and press outreach, measured against sales rather than impressions.',
    process: ['Positioning research', 'Listing optimisation', 'Advance reader programme', 'Launch sequence built', 'Campaign run', 'Monthly reporting'],
    includes: ['Keyword optimisation', 'Enhanced listing content', 'Advance reader distribution', 'Social campaign', 'Email launch sequence', 'Press release', 'Monthly reports'],
  },
  'author-website': {
    tagline: 'One page that does the work.',
    body: 'A fast, plain site that sells the book and grows a mailing list. No sliders, no stock photography, no page that takes four seconds to show a sentence.',
    process: ['Brand consultation', 'Wireframe', 'Design approval', 'Build', 'Content loaded', 'Launch and handover'],
    includes: ['Custom design', 'Five to ten pages', 'Mobile first', 'Search optimisation', 'Mailing list integration', 'Book store built in', 'Analytics'],
  },
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const d = slug ? detail[slug] : undefined
  const meta = services.find(s => s.slug === slug)

  if (!d || !meta) {
    return (
      <section className="band">
        <div className="wrap">
          <div className="sh">
            <span className="n num">—</span>
            <h1>No such service</h1>
            <p className="sub">That page does not exist. The eight we do offer are all here.</p>
          </div>
          <Link to="/services" className="btn">All services</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="band-tight pt-14">
        <div className="wrap">
          <Link to="/services" className="lbl text-muted hover:text-ink inline-block mb-8">← All services</Link>
          <div className="sh">
            <span className="n num">{meta.n}</span>
            <h1>{meta.title}</h1>
            <p className="sub">{d.tagline}</p>
          </div>
          <p className="text-[1.04rem] leading-[1.6] max-w-[62ch] text-muted mb-8">{d.body}</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/consultation" className="btn">Start your book</Link>
            <span className="num" style={{ fontSize: '.9rem' }}>from ${meta.from.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="band panel">
        <div className="wrap grid gap-12 grid-cols-1 lg:grid-cols-2">
          <div>
            <h2 className="text-[1.5rem] mb-5">What's included</h2>
            <ul role="list" style={{ borderTop: '1px solid var(--hairline)' }}>
              {d.includes.map(i => (
                <li key={i} className="py-3 hair-b text-[.93rem]">{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[1.5rem] mb-5">How it runs</h2>
            <div style={{ borderTop: '1px solid var(--hairline)' }}>
              {d.process.map((p, i) => (
                <div key={p} className="grid grid-cols-[46px_1fr] gap-4 py-3 hair-b items-baseline">
                  <span className="num text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[.93rem]">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
