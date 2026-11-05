import { Link, useSearchParams } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'

/**
 * Where the server sends a browser that posted a form without JavaScript.
 *
 * With JavaScript working nobody ever sees this page — the form replaces
 * itself in place. It exists so that the no-JS path ends somewhere that says
 * what happened, rather than on a raw JSON response.
 */
export default function Thanks() {
  const [params] = useSearchParams()
  const error = params.get('error')
  const from = params.get('for')

  if (error) {
    return (
      <>
        <PageHead n="—" title="That did not go through" sub={error} />
        <section className="pb-20">
          <div className="wrap flex flex-wrap gap-4">
            <Link to={from === 'call-me' ? '/contact' : '/tools'} className="btn">Try again</Link>
            <Link to="/contact" className="btn-o">Email us instead</Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHead
        n="—"
        title="Noted"
        sub="We have it. An editor reads these — if there is something here, you will hear from a person, not a sequence."
      />
      <section className="pb-20">
        <div className="wrap">
          <p className="text-muted text-[.95rem] leading-[1.6] max-w-[60ch] mb-8">
            Nothing else is needed from you now. In the meantime the other tools are free and ask
            for nothing before they answer.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/tools" className="btn">The tools</Link>
            <Link to="/portfolio" className="btn-o">Books from the house</Link>
          </div>
        </div>
      </section>
    </>
  )
}
