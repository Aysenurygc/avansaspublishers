import { useState } from 'react'

const genres = ['All', 'Business', 'Memoir', 'Self-Help', 'Technology', 'Health', 'Fiction']

const books = [
  { title: 'The Leadership Code',     author: 'James Richardson', genre: 'Business',   service: 'Ghostwriting',  color: 'from-orange-600 to-red-700',    year: 2024 },
  { title: 'Digital Disruption',      author: 'Sarah Chen',       genre: 'Technology', service: 'Ghostwriting',  color: 'from-blue-600 to-violet-700',   year: 2024 },
  { title: 'Healing Beyond Medicine', author: 'Dr. Marcus Webb',  genre: 'Health',     service: 'Full Package',  color: 'from-green-600 to-teal-700',    year: 2023 },
  { title: 'Unlocking Your Potential',author: 'Lisa Fontaine',    genre: 'Self-Help',  service: 'Ghostwriting',  color: 'from-purple-600 to-pink-700',   year: 2024 },
  { title: 'Beyond the Front Line',   author: 'Robert Tanner',    genre: 'Memoir',     service: 'Full Package',  color: 'from-amber-600 to-orange-700',  year: 2023 },
  { title: 'The Profitable Mind',     author: 'Amanda Kozlowski', genre: 'Business',   service: 'Ghostwriting',  color: 'from-cyan-600 to-blue-700',     year: 2024 },
  { title: 'Midnight Protocol',       author: 'T.K. Halliwell',   genre: 'Fiction',    service: 'Editing',       color: 'from-slate-600 to-gray-700',    year: 2023 },
  { title: 'The Millennial CEO',      author: 'Jason Park',       genre: 'Business',   service: 'Full Package',  color: 'from-emerald-600 to-green-700', year: 2022 },
  { title: 'My Father\'s War',        author: 'Grace Nguyen',     genre: 'Memoir',     service: 'Ghostwriting',  color: 'from-rose-600 to-red-700',      year: 2023 },
  { title: 'Code & Culture',          author: 'Priya Mehta',      genre: 'Technology', service: 'Full Package',  color: 'from-indigo-600 to-violet-700', year: 2024 },
  { title: 'The Gut-Brain Reset',     author: 'Dr. Kelly Barnes', genre: 'Health',     service: 'Ghostwriting',  color: 'from-lime-600 to-emerald-700',  year: 2022 },
  { title: 'Fearless Founder',        author: 'Darnell Lewis',    genre: 'Business',   service: 'Full Package',  color: 'from-yellow-600 to-amber-700',  year: 2024 },
]

export default function Portfolio() {
  const [activeGenre, setActiveGenre] = useState('All')

  const filtered = activeGenre === 'All' ? books : books.filter(b => b.genre === activeGenre)

  return (
    <div className="pt-24">
      <section className="section-padding bg-dark-800 border-b border-dark-600">
        <div className="container-max text-center">
          <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">Our Portfolio</p>
          <h1 className="section-title mb-4">5,000+ Books. Countless Bestsellers.</h1>
          <p className="section-subtitle mx-auto">A sample from our portfolio spanning every genre and publishing goal.</p>
        </div>
      </section>

      <section className="section-padding bg-dark-900">
        <div className="container-max">
          {/* Genre filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {genres.map(g => (
              <button key={g} onClick={() => setActiveGenre(g)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeGenre === g ? 'bg-primary-600 text-white' : 'bg-dark-800 border border-dark-600 text-gray-400 hover:border-primary-600'}`}>
                {g}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map(book => (
              <div key={book.title} className="group cursor-pointer">
                <div className={`aspect-[2/3] rounded-xl bg-gradient-to-b ${book.color} flex flex-col justify-end p-3 shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300`}>
                  <div className="text-xs text-white/60 uppercase tracking-wider mb-0.5">{book.genre}</div>
                  <div className="text-xs font-serif font-bold text-white leading-tight mb-0.5">{book.title}</div>
                  <div className="text-xs text-white/60">{book.author}</div>
                </div>
                <div className="mt-2 px-1">
                  <div className="text-xs text-gray-500">{book.service} · {book.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
