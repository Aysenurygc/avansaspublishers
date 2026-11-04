import { Link } from 'react-router-dom'
import Colophon from '@/components/ui/Colophon'

const services = [
  { label: 'Ghostwriting',  slug: 'ghostwriting' },
  { label: 'Editing',       slug: 'editing' },
  { label: 'Cover design',  slug: 'cover-design' },
  { label: 'Publishing',    slug: 'book-publishing' },
  { label: 'Audiobook',     slug: 'audiobook' },
  { label: 'Marketing',     slug: 'marketing' },
]

const house = [
  { label: 'Books',   to: '/portfolio' },
  { label: 'Process', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Journal', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--ground)', paddingBlock: '56px 26px' }}>
      <div className="wrap">
        <div className="grid gap-9 mb-11 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-block mb-3.5">
              <Colophon className="text-[1.9rem]" />
            </Link>
            <p className="text-[.88rem] opacity-70 leading-relaxed max-w-[30ch]">
              A publishing house for authors with something to say.
            </p>
          </div>

          <div>
            <h4 className="lbl mb-4 opacity-55" style={{ fontSize: '.72rem' }}>Services</h4>
            <ul className="flex flex-col gap-2.5" role="list">
              {services.map(s => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-[.88rem] opacity-80 hover:opacity-100 hover:underline underline-offset-4">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="lbl mb-4 opacity-55" style={{ fontSize: '.72rem' }}>House</h4>
            <ul className="flex flex-col gap-2.5" role="list">
              {house.map(h => (
                <li key={h.to}>
                  <Link to={h.to} className="text-[.88rem] opacity-80 hover:opacity-100 hover:underline underline-offset-4">
                    {h.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="lbl mb-4 opacity-55" style={{ fontSize: '.72rem' }}>Contact</h4>
            <div className="text-[.88rem] opacity-80 leading-[1.75]">
              <span className="select-all">hello@avansaspublishers.com</span><br />
              <span className="select-all">+1 (800) 555-1234</span><br />
              Mon–Fri, 9–19 EST
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap justify-between gap-3.5 pt-5 lbl opacity-55"
          style={{ borderTop: '1px solid rgba(255,255,255,.16)', fontSize: '.74rem' }}
        >
          <span>© {new Date().getFullYear()} Avansas Publishers</span>
          <span className="flex gap-5 flex-wrap">
            <Link to="/contact">Privacy</Link>
            <Link to="/contact">Terms</Link>
            <Link to="/contact">Refunds</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
