import { Link } from 'react-router-dom'
import { Users, Award, Globe, Heart, ArrowRight } from 'lucide-react'

const team = [
  { name: 'Eleanor Voss',   role: 'Founder & CEO',           bio: '25 years in Big Five publishing. Former VP at Penguin Random House.' },
  { name: 'Marcus Adeyemi', role: 'Head of Ghostwriting',    bio: 'NYT bestselling ghostwriter. 200+ books. Author coach and mentor.' },
  { name: 'Priya Sharma',   role: 'Editorial Director',      bio: 'Former HarperCollins editor. Specializes in memoir and business.' },
  { name: 'Daniel O\'Brien', role: 'Creative Director',      bio: 'Award-winning book cover designer. 1,000+ covers published globally.' },
]

const values = [
  { icon: Users, title: 'Author First',    desc: "Your book, your credit, your royalties. Always. We exist to serve your vision, not shape it." },
  { icon: Award, title: 'Uncompromising Quality', desc: 'Every project is handled by professionals with verifiable publishing credentials.' },
  { icon: Globe, title: 'Radical Transparency', desc: 'Written scopes before work begins. Itemized pricing. No surprises, ever.' },
  { icon: Heart, title: 'Genuine Care',   desc: 'We celebrate every launch and treat every book as if it were our own story.' },
]

export default function About() {
  return (
    <div className="pt-24">
      <section className="section-padding bg-dark-800 border-b border-dark-600">
        <div className="container-max max-w-4xl mx-auto text-center">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
          <h1 className="section-title mb-6">We Built Avansas Because Authors Deserved Better</h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Founded in 2010, Avansas Publishers was born from frustration. Our founder Eleanor Voss spent 25 years in traditional publishing and watched brilliant stories get buried under corporate gatekeeping. She built Avansas to give every author access to the same elite team — without giving up ownership, credit, or control.
          </p>
        </div>
      </section>

      <section className="section-padding bg-dark-900">
        <div className="container-max">
          <h2 className="text-3xl font-serif font-bold text-white text-center mb-12">What We Believe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="card-dark text-center">
                <div className="w-12 h-12 bg-primary-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-800">
        <div className="container-max">
          <h2 className="text-3xl font-serif font-bold text-white text-center mb-12">Meet the Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="card-dark text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-serif font-bold text-white">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-white mb-0.5">{member.name}</h3>
                <div className="text-primary-400 text-sm mb-2">{member.role}</div>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-900">
        <div className="container-max text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Write Your Story?</h2>
          <p className="text-gray-400 mb-8">Join 2,400+ authors who trusted us with their most important work.</p>
          <Link to="/consultation" className="btn-primary inline-flex">
            Book Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
