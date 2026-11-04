const papers = ['The New York Times', 'Forbes', 'USA Today', 'Wall Street Journal', 'Fast Company']

export default function Stats() {
  return (
    <section
      className="panel"
      style={{ paddingBlock: 30, borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)' }}
    >
      <div className="wrap">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <span className="lbl text-muted">Our authors have appeared in</span>
          {papers.map(p => (
            <span
              key={p}
              style={{ fontStretch: '75%', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', fontSize: '.84rem' }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
