import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const Home        = lazy(() => import('@/pages/Home'))
const Services    = lazy(() => import('@/pages/Services'))
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'))
const Pricing     = lazy(() => import('@/pages/Pricing'))
const Portfolio   = lazy(() => import('@/pages/Portfolio'))
const About       = lazy(() => import('@/pages/About'))
const Blog        = lazy(() => import('@/pages/Blog'))
const BlogPost    = lazy(() => import('@/pages/BlogPost'))
const Contact     = lazy(() => import('@/pages/Contact'))
const Consultation = lazy(() => import('@/pages/Consultation'))
const Dashboard   = lazy(() => import('@/pages/Dashboard'))
const Login       = lazy(() => import('@/pages/Login'))
const Register    = lazy(() => import('@/pages/Register'))
const NotFound    = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/services"          element={<Services />} />
            <Route path="/services/:slug"    element={<ServiceDetail />} />
            <Route path="/pricing"           element={<Pricing />} />
            <Route path="/portfolio"         element={<Portfolio />} />
            <Route path="/about"             element={<About />} />
            <Route path="/blog"              element={<Blog />} />
            <Route path="/blog/:slug"        element={<BlogPost />} />
            <Route path="/contact"           element={<Contact />} />
            <Route path="/consultation"      element={<Consultation />} />
            <Route path="/dashboard"         element={<Dashboard />} />
            <Route path="/login"             element={<Login />} />
            <Route path="/register"          element={<Register />} />
            <Route path="*"                  element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
