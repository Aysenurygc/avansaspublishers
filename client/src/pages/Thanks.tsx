import { Link, useSearchParams } from 'react-router-dom'
import PageHead from '@/components/layout/PageHead'
import Colophon from '@/components/ui/Colophon'
import { useWording } from '@/components/ui/PhoneField'

/**
 * Where the server sends a browser that posted a form without JavaScript.
 *
 * With JavaScript working nobody ever sees this page — the form replaces
 * itself in place. It exists so that the no-JS path ends somewhere that says
 * what happened, rather than on a raw JSON response.
 *
 * It repeats the in-place confirmation, sentence for sentence: the callback
 * wording for a callback, the address wording for everything else, both read
 * from the server like the forms read them. The spine is the same one that
 * stands beside the callback form.
 */
/**
 * The reasons a submission can be refused, in the page's own words.
 *
 * The server sends a short code and this maps it. It deliberately does NOT
 * print the server's sentence: this page renders whatever it is handed, so
 * reflecting free text would let anyone put their own sentence on the
 * house's own domain, in the house's own design, by sending a crafted link.
 * An unrecognised code falls back to the generic line.
 */
const REASONS: Record<string, string> = {
  'unknown-source': 'That form did not say what it was for, so we could not file it.',
  'bad-email': 'That email address does not look right. Check it and send again.',
  'bad-phone': 'That phone number does not look right for the country code chosen.',
  'no-contact': 'We need an email address or a phone number to reply to.',
  'call-needs-phone': 'A callback needs a phone number.',
  server: 'Something went wrong on our side, not yours.',
}

const GENERIC = 'That did not go through. Nothing was changed.'

export default function Thanks() {
  const w = useWording()
  const [params] = useSearchParams()
  const error = params.get('error')
  const from = params.get('for')
  const isCall = from === 'call-me'

  if (error) {
    return (
      <>
        <PageHead n="—" title="That did not go through">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 sm:gap-x-10">
            <div aria-hidden="true" className="spine spine-light self-start w-[42px] sm:w-[52px] h-[200px] sm:h-[240px]">
              <span className="st">Not sent</span>
              <Colophon className="cx mt-auto" />
            </div>
            <div className="min-w-0">
              <span className="lbl text-muted block mb-3">The reason</span>
              <p className="text-[1.1rem] sm:text-[1.25rem] leading-[1.45] max-w-[44ch]">{REASONS[error] ?? GENERIC}</p>
            </div>
          </div>
        </PageHead>
        <section className="pb-20">
          <div className="wrap">
            <div className="rule-t pt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link to={from === 'call-me' ? '/contact' : '/tools'} className="btn text-center">Try again</Link>
              <Link to="/contact" className="btn-o text-center">Email us instead</Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHead n="—" title="Noted">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 sm:gap-x-10">
          <div aria-hidden="true" className="spine spine-dark self-start w-[42px] sm:w-[52px] h-[200px] sm:h-[240px]">
            <span className="st">{isCall ? 'An editor calls' : 'Received'}</span>
            <Colophon className="cx mt-auto" />
          </div>
          <div className="min-w-0">
            <span className="lbl text-muted block mb-3">{isCall ? 'By phone' : 'By email'}</span>
            <p className="text-[1.1rem] sm:text-[1.25rem] leading-[1.45] max-w-[44ch]">
              {isCall
                ? w?.callbackConfirmation ??
                  'Your number is with us. A real person from the house will call as soon as one is free.'
                : w?.emailConfirmation ??
                  'We have it. An editor reads these — if there is something here, you will hear from a person, not a sequence.'}
            </p>
            <p className="text-muted text-[.95rem] leading-[1.6] max-w-[52ch] mt-5">
              Nothing else is needed from you now. In the meantime the other tools are free and ask
              for nothing before they answer.
            </p>
          </div>
        </div>
      </PageHead>

      <section className="pb-20">
        <div className="wrap">
          <nav aria-label="Where next" className="rule-t">
            <Link to="/tools" className="hair-b py-5 grid grid-cols-[2.5rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)] gap-x-6 items-baseline hover:opacity-80">
              <span className="num text-muted">01</span>
              <span className="d text-[1.5rem] sm:text-[1.8rem]">The tools</span>
            </Link>
            <Link to="/portfolio" className="hair-b py-5 grid grid-cols-[2.5rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)] gap-x-6 items-baseline hover:opacity-80">
              <span className="num text-muted">02</span>
              <span className="d text-[1.5rem] sm:text-[1.8rem]">Books from the house</span>
            </Link>
          </nav>
        </div>
      </section>
    </>
  )
}
