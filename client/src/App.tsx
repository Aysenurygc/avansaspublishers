import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Rail from '@/components/layout/Rail'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const Home          = lazy(() => import('@/pages/Home'))
const Services      = lazy(() => import('@/pages/Services'))
const ServiceDetail  = lazy(() => import('@/pages/ServiceDetail'))
const Pricing       = lazy(() => import('@/pages/Pricing'))
const Portfolio     = lazy(() => import('@/pages/Portfolio'))
const About         = lazy(() => import('@/pages/About'))
const Blog          = lazy(() => import('@/pages/Blog'))
const BlogPost      = lazy(() => import('@/pages/BlogPost'))
const Contact       = lazy(() => import('@/pages/Contact'))
const Consultation  = lazy(() => import('@/pages/Consultation'))
const Dashboard     = lazy(() => import('@/pages/Dashboard'))
const Login         = lazy(() => import('@/pages/Login'))
const Register      = lazy(() => import('@/pages/Register'))
const NotFound      = lazy(() => import('@/pages/NotFound'))
const ToolsIndex    = lazy(() => import('@/pages/tools/ToolsIndex'))
const Readiness     = lazy(() => import('@/pages/tools/ReadinessScorecard'))
const IsItABook     = lazy(() => import('@/pages/tools/IsItABook'))
const OpeningPages  = lazy(() => import('@/pages/tools/OpeningPages'))
const MemoirMapper  = lazy(() => import('@/pages/tools/MemoirMapper'))

export default function App() {
  return (
    <>
      <Rail />
      <div
        className="min-h-screen flex flex-col"
        style={{ marginLeft: 'var(--shell-offset, 0px)' }}
      >
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/services"       element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/pricing"        element={<Pricing />} />
              <Route path="/portfolio"      element={<Portfolio />} />
              <Route path="/about"          element={<About />} />
              <Route path="/blog"           element={<Blog />} />
              <Route path="/blog/:slug"     element={<BlogPost />} />
              <Route path="/contact"        element={<Contact />} />
              <Route path="/consultation"   element={<Consultation />} />
              <Route path="/dashboard"      element={<Dashboard />} />
              <Route path="/login"          element={<Login />} />
              <Route path="/register"       element={<Register />} />
              <Route path="/tools"               element={<ToolsIndex />} />
              <Route path="/tools/readiness"     element={<Readiness />} />
              <Route path="/tools/is-it-a-book"  element={<IsItABook />} />
              <Route path="/tools/opening-pages" element={<OpeningPages />} />
              <Route path="/tools/memoir-map"    element={<MemoirMapper />} />
              <Route path="*"               element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  )
}
