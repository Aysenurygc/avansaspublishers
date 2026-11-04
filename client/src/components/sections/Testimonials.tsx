const quotes = [
  {
    text: 'They told me the first three chapters had to go. They were right. The book starts where it should now.',
    name: 'James Richardson', role: 'Chief executive', book: 'The Operating Year',
  },
  {
    text: 'I had the story and no time. The writer caught my voice in two interviews. Nobody has guessed.',
    name: 'Sarah Chen', role: 'Founder', book: 'Small Margins',
  },
  {
    text: 'Every stage came with a date, and every date held. That is rarer than it should be.',
    name: 'Marcus Webb', role: 'Physician', book: 'The Gut Reset',
  },
]

export default function Testimonials() {
  return (
    <section className="band pt-0">
      <div className="wrap">
        <div className="sh">
          <span className="n num">04</span>
          <h2>What authors say</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-0.5 rule-t">
          {quotes.map((q, i) => (
            <div
              key={q.name}
              className={`py-6 pr-0 lg:pr-6 hair-b ${i > 0 ? 'lg:pl-6 lg:border-l lg:border-hairline' : ''}`}
            >
              <p className="mb-5" style={{ fontStretch: '80%', fontWeight: 600, fontSize: '1.04rem', lineHeight: 1.38 }}>
                {q.text}
              </p>
              <div className="lbl" style={{ fontSize: '.68rem' }}>{q.name}</div>
              <div className="text-muted text-[.8rem] mt-0.5">{q.role}</div>
              <div className="text-[.8rem] mt-0.5" style={{ fontStretch: '80%', fontWeight: 600 }}>{q.book}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
