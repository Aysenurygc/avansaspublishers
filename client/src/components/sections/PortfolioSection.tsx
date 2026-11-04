import { Link } from 'react-router-dom'
import Spine from '@/components/ui/Spine'

export const books = [
  { title: 'The Quiet Hours',  author: 'Ruth Abara',      genre: 'Memoir',     width: 48, height: 300, tone: 'dark'  as const },
  { title: 'The Hard Part',    author: 'Leo Vanterpool',  genre: 'Business',   width: 44, height: 286, tone: 'light' as const },
  { title: 'Hire Slowly',      author: 'Ines Calder',     genre: 'Business',   width: 40, height: 268, tone: 'dark'  as const },
  { title: 'Operating Year',   author: 'Dana Whitcombe',  genre: 'Business',   width: 46, height: 294, tone: 'dark'  as const },
  { title: 'Small Margins',    author: 'Marcus Oyelaran', genre: 'Business',   width: 42, height: 262, tone: 'light' as const },
  { title: "My Father's War",  author: 'Grace Nguyen',    genre: 'Memoir',     width: 44, height: 278, tone: 'dark'  as const },
  { title: 'Code & Culture',   author: 'Priya Mehta',     genre: 'Technology', width: 38, height: 250, tone: 'light' as const },
  { title: 'The Gut Reset',    author: 'Kelly Barnes',    genre: 'Health',     width: 42, height: 272, tone: 'dark'  as const },
  { title: 'Fearless Founder', author: 'Darnell Lewis',   genre: 'Business',   width: 40, height: 256, tone: 'light' as const },
]

export default function PortfolioSection() {
  return (
    <section className="band">
      <div className="wrap">
        <div className="sh">
          <span className="n num">03</span>
          <h2>On the shelf</h2>
          <p className="sub">
            A book shows one thing in a shop: its spine. Sample titles and authors below are placeholders.
          </p>
        </div>

        <div className="flex items-end gap-[5px] overflow-x-auto pb-1.5" aria-label="Spine wall">
          <Spine width={48} height={300} tone="dark"  title={books[0].title} author={books[0].author} />
          <Spine width={44} height={286} tone="light" title={books[1].title} author={books[1].author} />
          <Spine width={40} height={268} tone="dark"  title={books[2].title} author={books[2].author} />
          <Spine width={20} height={240} tone="light" />
          <Spine width={46} height={294} tone="dark"  title={books[3].title} author={books[3].author} />
          <Spine width={42} height={262} tone="light" title={books[4].title} author={books[4].author} />
          <Spine width={18} height={228} tone="light" />
          <Spine width={44} height={278} tone="dark"  title={books[5].title} author={books[5].author} />
          <Spine width={38} height={250} tone="light" title={books[6].title} author={books[6].author} />
          <Spine width={42} height={272} tone="dark"  title={books[7].title} author={books[7].author} />
          <Spine width={40} height={256} tone="light" title={books[8].title} author={books[8].author} />
        </div>

        <div className="mt-9">
          <Link to="/portfolio" className="btn-o">See every book</Link>
        </div>
      </div>
    </section>
  )
}
