import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Services from '@/components/sections/ServicesSection'
import Process from '@/components/sections/Process'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/PricingSection'
import Portfolio from '@/components/sections/PortfolioSection'
import Blog from '@/components/sections/BlogSection'
import CTA from '@/components/sections/CTA'
import FAQ from '@/components/sections/FAQ'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
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
