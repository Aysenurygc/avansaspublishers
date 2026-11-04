import { Link } from 'react-router-dom'

/** The fixed black spine down the left edge. Hidden below 900px, where Topbar takes over. */
export default function Rail() {
  return (
    <Link
      to="/"
      aria-label="Avansas Publishers home"
      className="hidden lg:flex fixed left-0 top-0 bottom-0 z-[60] flex-col items-center justify-between"
      style={{
        width: 'var(--rail-w)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'var(--rail)',
        color: 'var(--rail-ink)',
      }}
    >
      <span
        className="whitespace-nowrap mt-7"
        style={{
          writingMode: 'vertical-rl',
          fontStretch: '62%',
          fontWeight: 850,
          textTransform: 'uppercase',
          fontSize: '2.05rem',
          lineHeight: 1,
          letterSpacing: '.02em',
        }}
      >
        Avansas
      </span>
      <span
        className="whitespace-nowrap mb-6 opacity-55"
        style={{
          writingMode: 'vertical-rl',
          fontStretch: '75%',
          fontWeight: 650,
          textTransform: 'uppercase',
          fontSize: '.62rem',
          letterSpacing: '.16em',
        }}
      >
        Publishing House
      </span>
    </Link>
  )
}
