import { useParams, Link } from 'react-router-dom'
import CTA from '@/components/sections/CTA'
import { posts } from '@/components/sections/BlogSection'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <section className="band">
        <div className="wrap">
          <div className="sh">
            <span className="n num">—</span>
            <h1>No such piece</h1>
            <p className="sub">That page does not exist.</p>
          </div>
          <Link to="/blog" className="btn">Everything from the desk</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <article className="band-tight pt-14 pb-20">
        <div className="wrap max-w-[760px]">
          <Link to="/blog" className="lbl text-muted hover:text-ink inline-block mb-8">← From the desk</Link>

          <div className="sh">
            <span className="n num">{post.n}</span>
            <h1>{post.title}</h1>
          </div>

          <p className="lbl text-muted mb-8">{post.cat} · {post.read} read</p>

          <div className="flex flex-col gap-5 text-[1.02rem] leading-[1.65]">
            <p>{post.excerpt}</p>

            <h2 className="text-[1.5rem] mt-4">It is seen sideways</h2>
            <p>
              A spine is the hardest piece of design in a book. It is narrow, it is read at an angle,
              and in a shop it is often the only part a reader ever sees. If a design works there, it
              works anywhere.
            </p>

            <h2 className="text-[1.5rem] mt-4">It has a real width</h2>
            <p>
              Spine width is not a design choice. It comes out of your page count and the paper stock,
              and it changes if the book runs long. Getting it wrong means the type wraps onto the
              covers, which is why we calculate it from the final interior rather than the estimate.
            </p>

            <h2 className="text-[1.5rem] mt-4">It carries three things</h2>
            <p>
              Title, author, house. In that order, at that priority. Anything else — a rule, a device,
              a strapline — earns its place or comes off.
            </p>
          </div>

          <div className="mt-12 pt-8" style={{ borderTop: '2px solid var(--ink)' }}>
            <Link to="/consultation" className="btn">Start your book</Link>
          </div>
        </div>
      </article>

      <CTA />
    </>
  )
}
