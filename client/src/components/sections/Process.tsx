const steps = [
  {
    number: '01',
    title: 'Free Consultation',
    description: 'Book a free 30-minute strategy call. We learn about your book, goals, and vision — no commitment required.',
  },
  {
    number: '02',
    title: 'Custom Proposal',
    description: 'Within 24 hours, you receive a detailed scope, timeline, and pricing. Everything in writing before we begin.',
  },
  {
    number: '03',
    title: 'Expert Matching',
    description: "We match you with the perfect writer, editor, or designer from our elite team based on your genre and style.",
  },
  {
    number: '04',
    title: 'Collaborative Creation',
    description: 'Track progress in real time through your client portal. Unlimited revisions until you\'re 100% satisfied.',
  },
  {
    number: '05',
    title: 'Launch & Beyond',
    description: 'We publish your book to all major platforms, execute your marketing strategy, and celebrate your success.',
  },
]

export default function Process() {
  return (
    <section className="section-padding bg-dark-800">
      <div className="container-max">
        <div className="text-center mb-16">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">How It Works</p>
          <h2 className="section-title mb-4">Your Journey from <br />Idea to Bestseller</h2>
          <p className="section-subtitle mx-auto">
            A proven process refined over 15 years and 5,000+ successful books.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-700 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center lg:text-left">
                <div className="relative inline-flex lg:flex w-16 h-16 bg-primary-600 rounded-2xl items-center justify-center mb-4 mx-auto lg:mx-0 shadow-lg shadow-primary-900/50">
                  <span className="font-serif text-2xl font-bold text-white">{i + 1}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
