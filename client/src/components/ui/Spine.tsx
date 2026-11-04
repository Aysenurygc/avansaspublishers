import Colophon from './Colophon'

type Props = {
  title?: string
  author?: string
  width: number
  height: number
  tone?: 'dark' | 'light'
}

/** A book spine: vertical title, vertical author, colophon at the foot. */
export default function Spine({ title, author, width, height, tone = 'dark' }: Props) {
  const blank = !title
  // Written out in full: Tailwind only keeps classes it can see as literals.
  const toneClass = tone === 'dark' ? 'spine-dark' : 'spine-light'
  return (
    <div
      className={`spine ${toneClass}${blank ? ' spine-blank' : ''}`}
      style={{ width, height }}
      {...(blank
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': author ? `${title} by ${author}` : title })}
    >
      {!blank && (
        <>
          <span className="st">{title}</span>
          {author && <span className="sa">{author}</span>}
          <Colophon className="cx" />
        </>
      )}
    </div>
  )
}
