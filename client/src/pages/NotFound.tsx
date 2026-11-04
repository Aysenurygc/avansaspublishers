import { Link } from 'react-router-dom'
import Spine from '@/components/ui/Spine'

export default function NotFound() {
  return (
    <section className="band">
      <div className="wrap grid gap-12 items-end grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <div>
          <div className="sh">
            <span className="n num">404</span>
            <h1>This one is not on the shelf.</h1>
            <p className="sub">The page does not exist, or it moved. Everything else is where you left it.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="btn">Back to the house</Link>
            <Link to="/portfolio" className="btn-o">See the books</Link>
          </div>
        </div>

        <div className="flex items-end gap-[5px]" aria-hidden="true">
          <Spine width={34} height={210} tone="light" />
          <Spine width={26} height={172} tone="dark" />
          <Spine width={40} height={238} tone="light" />
        </div>
      </div>
    </section>
  )
}
