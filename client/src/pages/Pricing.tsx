import { Link } from 'react-router-dom'
import { Check, Zap, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const plans = [
  {
    name: 'Essentials',
    price: 1249,
    description: 'Perfect for first-time authors with a clear idea and a modest budget.',
    popular: false,
    features: [
      'Up to 30,000-word ghostwritten manuscript',
      'Professional ghostwriting',
      'One full round of revisions',
      'Basic cover design (2 concepts)',
      'eBook formatting (EPUB & MOBI)',
      'Amazon KDP publishing setup',
      'ISBN assignment (1)',
      'Email support',
      '30-day post-launch support',
    ],
  },
  {
    name: 'Professional',
    price: 3499,
    description: 'The complete package for authors ready to launch a serious book.',
    popular: true,
    features: [
      'Up to 60,000-word ghostwritten manuscript',
      'Expert ghostwriting + copyediting',
      'Unlimited revisions',
      'Premium cover design (5 concepts)',
      'Print & eBook formatting',
      'Multi-platform publishing (Amazon, B&N, Apple)',
      'ISBNs (2)',
      'Author website (5 pages)',
      'Launch marketing kit',
      '90-day post-launch support',
      'Priority email & phone support',
    ],
  },
  {
    name: 'Premier',
    price: 8849,
    description: 'White-glove service for authors with bestseller ambitions.',
    popular: false,
    features: [
      'Unlimited word count manuscript',
      'Elite ghostwriter + full editorial suite',
      'Unlimited revisions (all drafts)',
      'Award-winning cover design',
      'All print & digital formats',
      'Global distribution (150+ retailers)',
      'ISBNs (all formats)',
      'Full author website (10+ pages)',
      'Audiobook production',
      '6-month marketing campaign',
      'ARC reader program',
      'PR & media outreach',
      'Dedicated account manager',
      '12-month post-launch support',
    ],
  },
]

const addons = [
  { name: 'Developmental Editing',   price: 599 },
  { name: 'Audiobook Production',    price: 799 },
  { name: 'Author Website',          price: 999 },
  { name: 'Press Release',           price: 249 },
  { name: 'ARC Reader Program',      price: 349 },
  { name: 'Social Media Kit',        price: 199 },
  { name: 'Amazon A+ Content',       price: 299 },
  { name: 'Hardcover Formatting',    price: 149 },
]

export default function Pricing() {
  return (
    <div className="pt-24">
      <section className="section-padding bg-dark-800 border-b border-dark-600">
        <div className="container-max text-center">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">Transparent Pricing</p>
          <h1 className="section-title mb-4">No Hidden Fees. Ever.</h1>
          <p className="section-subtitle mx-auto">
            Every package includes a written scope of work before we begin. Split payment plans available on all packages.
          </p>
        </div>
      </section>

      <section className="section-padding bg-dark-900">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-20">
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
                      <Check className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/consultation" className={plan.popular ? 'btn-primary text-center' : 'btn-outline text-center'}>
                  Get Started <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-white mb-2 text-center">Add-On Services</h2>
            <p className="text-gray-400 text-center mb-8">Customize any package with individual services.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {addons.map(a => (
                <div key={a.name} className="card-dark text-center">
                  <div className="font-semibold text-white text-sm mb-1">{a.name}</div>
                  <div className="text-primary-400 font-bold">{formatCurrency(a.price)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
