import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from '@/components/ui/ThemeToggle'

const links = [
  { to: '/services',  label: 'Services' },
  { to: '/pricing',   label: 'Pricing' },
  { to: '/portfolio', label: 'Books' },
  { to: '/about',     label: 'House' },
  { to: '/blog',      label: 'Journal' },
  { to: '/tools',     label: 'Tools' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location])

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="lg:hidden sticky z-[60] flex items-center justify-between"
        style={{
          top: 'env(safe-area-inset-top, 0px)',
          background: 'var(--ink)',
          color: 'var(--ground)',
          paddingBlock: 12,
          paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
        }}
      >
        <Link
          to="/"
          style={{ fontStretch: '62%', fontWeight: 850, textTransform: 'uppercase', fontSize: '1.15rem', letterSpacing: '.02em' }}
        >
          Avansas
        </Link>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex flex-col gap-1 p-1.5"
        >
          <i className="block w-[21px] h-0.5 bg-current" />
          <i className="block w-[21px] h-0.5 bg-current" />
          <i className="block w-[21px] h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="lg:hidden"
          aria-label="Menu"
          style={{
            background: 'var(--ink)',
            color: 'var(--ground)',
            borderTop: '1px solid rgba(255,255,255,.16)',
            padding: '6px max(16px, env(safe-area-inset-left, 0px)) 18px',
          }}
        >
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className="block py-3 lbl"
              style={{ borderBottom: '1px solid rgba(255,255,255,.14)', fontSize: '.86rem' }}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/consultation"
            className="block text-center mt-4 py-3.5 lbl"
            style={{ background: 'var(--ground)', color: 'var(--ink)' }}
          >
            Start your book
          </Link>
        </nav>
      )}

      {/* Desktop nav */}
      <nav
        className="hidden lg:block sticky top-0 z-40"
        aria-label="Sections"
        style={{ background: 'var(--ground)', borderBottom: '2px solid var(--ink)' }}
      >
        <div className="wrap flex items-center justify-between gap-6 py-4">
          <ul className="flex gap-6 min-w-0" role="list">
            {links.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `lbl pb-0.5 border-b-2 ${isActive ? 'border-ink' : 'border-transparent hover:border-ink'}`
                  }
                  style={{ fontSize: '.76rem' }}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 flex-shrink-0">
            <ThemeToggle />
            <Link to="/login" className="lbl" style={{ fontSize: '.72rem' }}>Sign in</Link>
            <Link to="/consultation" className="btn btn-sm">Start your book</Link>
          </div>
        </div>
      </nav>
    </>
  )
}
