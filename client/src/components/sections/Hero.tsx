import { Link } from 'react-router-dom'
import Spine from '@/components/ui/Spine'

const shelf = [
  { width: 26, height: 206, tone: 'light' as const },
  { width: 46, height: 276, tone: 'dark'  as const, title: 'The Quiet Hours', author: 'Ruth Abara' },
  { width: 42, height: 254, tone: 'light' as const, title: 'The Hard Part',   author: 'Leo Vanterpool' },
  { width: 38, height: 232, tone: 'dark'  as const, title: 'Hire Slowly',     author: 'Ines Calder' },
  { width: 22, height: 190, tone: 'light' as const },
]

export default function Hero() {
  return (
    <section className="pt-[72px]">
      <div className="wrap">
        <div className="grid gap-11 items-end grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <div>
            <p className="lbl text-muted mb-5">Ghostwriting · Editing · Design · Publishing</p>
            <h1 className="mb-6" style={{ fontSize: 'clamp(3.1rem, 8.6vw, 7.4rem)' }}>
              Books that hold the shelf.
            </h1>
            <p className="text-[1.06rem] leading-[1.55] text-muted max-w-[46ch] mb-7">
              Avansas is a publishing house for authors with something to say. We write, edit,
              design, publish and market books that stand on their own — and we give the spine
              as much attention as the cover.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Link to="/consultation" className="btn">Start your book</Link>
              <Link to="/about" className="btn-o">How it works</Link>
            </div>
          </div>

          <div className="flex items-end gap-[5px] min-h-[300px]" aria-label="Sample spines">
            {shelf.map((s, i) => <Spine key={i} {...s} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
