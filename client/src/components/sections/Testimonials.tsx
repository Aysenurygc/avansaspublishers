import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'James Richardson',
    role: 'CEO & Author',
    book: '"The Leadership Code"',
    stars: 5,
    text: "Avansas Publishers transformed my rough notes into a Wall Street Journal bestseller. The team's professionalism and attention to detail is unmatched. Worth every penny.",
  },
  {
    name: 'Sarah Chen',
    role: 'Entrepreneur',
    book: '"Digital Disruption"',
    stars: 5,
    text: "I had a story but no time to write it. Avansas assigned me the perfect ghostwriter who captured my voice perfectly. The book launched my speaking career.",
  },
  {
    name: 'Dr. Marcus Webb',
    role: 'Physician & Author',
    book: '"Healing Beyond Medicine"',
    stars: 5,
    text: "The editing team completely transformed my manuscript. Complex medical concepts became accessible to general readers. My book is now used in universities nationwide.",
  },
  {
    name: 'Lisa Fontaine',
    role: 'Life Coach',
    book: '"Unlocking Your Potential"',
    stars: 5,
    text: "From cover design to marketing — everything was handled brilliantly. Six months after launch, my book hit #1 in Self-Help on Amazon. Avansas made it happen.",
  },
  {
    name: 'Robert Tanner',
    role: 'Retired Military Officer',
    book: '"Beyond the Front Line"',
    stars: 5,
    text: "I was skeptical about ghostwriting but the team made me feel like I wrote every word myself. My memoir has helped thousands of veterans. Incredibly meaningful.",
  },
  {
    name: 'Amanda Kozlowski',
    role: 'Business Coach',
    book: '"The Profitable Mind"',
    stars: 5,
    text: "The client portal was a game-changer. I could see exactly where my project stood at every stage. The communication and transparency are what set Avansas apart.",
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-dark-900">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">Success Stories</p>
          <h2 className="section-title mb-4">Thousands of Authors. <br />One Common Story: Success.</h2>
          <p className="section-subtitle mx-auto">
            Don't take our word for it — hear from the authors who trusted us with their vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="card-dark flex flex-col">
              <Quote className="w-8 h-8 text-primary-600 mb-4" />
              <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-4">"{t.text}"</p>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <div className="border-t border-dark-600 pt-4">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
                <div className="text-sm text-primary-400 font-medium mt-0.5">{t.book}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
