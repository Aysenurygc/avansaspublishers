import { Link } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const plans = [
  {
    name: 'Essentials',
    price: 1249,
    description: 'Perfect for first-time authors ready to share their story.',
    popular: false,
    features: [
      'Up to 30,000-word manuscript',
      'Professional ghostwriting',
      'One round of revisions',
      'Basic cover design',
      'eBook formatting',
      'Amazon KDP publishing',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: 3499,
    description: 'The complete package for serious authors.',
    popular: true,
    features: [
      'Up to 60,000-word manuscript',
      'Expert ghostwriting + editing',
      'Unlimited revisions',
      'Premium cover design',
      'Print & eBook formatting',
      'Multi-platform publishing',
      'Author website (5 pages)',
      'Launch marketing kit',
      'Priority support',
    ],
  },
  {
    name: 'Premier',
    price: 8849,
    description: 'White-glove service for bestseller-level ambitions.',
    popular: false,
    features: [
      'Unlimited word count',
      'Elite ghostwriter + full editorial',
      'Unlimited revisions',
      'Award-winning cover design',
      'All format types',
      'Global distribution (150+ retailers)',
      'Full author website',
      'Audiobook production',
      '6-month marketing campaign',
      'Dedicated account manager',
      'PR & media outreach',
    ],
  },
]

export default function PricingSection() {
  return (
    <section className="section-padding bg-dark-800">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">Pricing</p>
          <h2 className="section-title mb-4">Transparent Pricing. <br />Zero Surprises.</h2>
          <p className="section-subtitle mx-auto">
            Every package includes a written scope before work begins. You know exactly what you're getting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map(plan => (
            <div key={plan.name} className={`relative rounded-2xl p-8 flex flex-col ${
              plan.popular
                ? 'bg-gradient-to-b from-primary-900/60 to-dark-800 border-2 border-primary-500 shadow-2xl shadow-primary-900/30 scale-105'
                : 'bg-dark-800 border border-dark-600'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5" /> MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="font-serif text-2xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-serif font-bold text-white">{formatCurrency(plan.price)}</span>
                <span className="text-gray-500 text-sm ml-1">starting from</span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/consultation"
                className={plan.popular ? 'btn-primary text-center' : 'btn-outline text-center'}>
                Get Started
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          All packages include a free consultation, written scope, and our{' '}
          <span className="text-primary-400">100% satisfaction guarantee</span>.{' '}
          <Link to="/pricing" className="underline hover:text-white">View full pricing details →</Link>
        </p>
      </div>
    </section>
  )
}
