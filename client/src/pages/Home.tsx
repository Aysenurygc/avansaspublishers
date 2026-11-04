import Hero from '@/components/sections/Hero'
import Press from '@/components/sections/Stats'
import Services from '@/components/sections/ServicesSection'
import Process from '@/components/sections/Process'
import Portfolio from '@/components/sections/PortfolioSection'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/PricingSection'
import FAQ from '@/components/sections/FAQ'
import Blog from '@/components/sections/BlogSection'
import CTA from '@/components/sections/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Press />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Blog />
      <CTA />
    </>
  )
}
