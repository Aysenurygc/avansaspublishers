type Props = {
  n: string
  title: string
  sub?: string
  children?: React.ReactNode
}

/** The standard page opener: rule, number, title, optional sub. */
export default function PageHead({ n, title, sub, children }: Props) {
  return (
    <section className="band-tight pt-14">
      <div className="wrap">
        <div className="sh" style={{ marginBottom: children ? 32 : 0 }}>
          <span className="n num">{n}</span>
          <h1>{title}</h1>
          {sub && <p className="sub">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
