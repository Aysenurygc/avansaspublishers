import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

const stats = [
  { value: 2400,  suffix: '+', label: 'Authors Served',      desc: 'Across 40+ countries' },
  { value: 5000,  suffix: '+', label: 'Books Published',     desc: 'In every genre imaginable' },
  { value: 98,    suffix: '%', label: 'Satisfaction Rate',   desc: 'Verified client reviews' },
  { value: 15,    suffix: '+', label: 'Years of Excellence', desc: 'Industry-leading expertise' },
]

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-16 bg-dark-800 border-y border-dark-600">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-1">
                {inView ? (
                  <CountUp end={stat.value} duration={2.5} separator="," />
                ) : '0'}
                <span className="text-primary-400">{stat.suffix}</span>
              </div>
              <div className="font-semibold text-gray-200 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
