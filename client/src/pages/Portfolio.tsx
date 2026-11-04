import { useState } from 'react'
import PageHead from '@/components/layout/PageHead'
import Spine from '@/components/ui/Spine'
import CTA from '@/components/sections/CTA'
import { books } from '@/components/sections/PortfolioSection'

const genres = ['All', 'Business', 'Memoir', 'Technology', 'Health']

export default function Portfolio() {
  const [genre, setGenre] = useState('All')
  const shown = genre === 'All' ? books : books.filter(b => b.genre === genre)

  return (
    <>
      <PageHead
        n="03"
        title="On the shelf"
        sub="A book shows one thing in a shop: its spine. Titles and authors below are placeholders while the real list is cleared for publication."
      />

      <section className="pb-20">
        <div className="wrap">
          <div className="flex flex-wrap gap-0.5 mb-10">
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className="lbl px-4 py-2.5 border-2 transition-colors"
                style={
                  genre === g
                    ? { background: 'var(--ink)', color: 'var(--ground)', borderColor: 'var(--ink)', fontSize: '.7rem' }
                    : { borderColor: 'var(--hairline)', color: 'var(--muted)', fontSize: '.7rem' }
                }
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-[5px] overflow-x-auto pb-2" aria-label="Spine wall">
            {shown.map(b => (
              <Spine key={b.title} title={b.title} author={b.author} width={b.width} height={b.height} tone={b.tone} />
            ))}
          </div>

          <div className="mt-10" style={{ borderTop: '2px solid var(--ink)' }}>
            {shown.map(b => (
              <div
                key={b.title}
                className="grid gap-x-5 gap-y-1 py-4 hair-b grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] items-baseline"
              >
                <h3 className="text-[1.1rem]">{b.title}</h3>
                <span className="text-muted text-[.9rem]">{b.author}</span>
                <span className="lbl text-muted" style={{ fontSize: '.66rem' }}>{b.genre}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  )
}
