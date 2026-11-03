import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Check, ArrowLeft } from 'lucide-react'

const serviceData: Record<string, {
  title: string
  tagline: string
  description: string
  process: string[]
  includes: string[]
  startingAt: number
}> = {
  ghostwriting: {
    title: 'Ghostwriting',
    tagline: 'Your Story, Told Perfectly',
    description: "Our elite ghostwriters have collectively written over 3,000 books across every genre. We match you with a writer who understands your voice, your audience, and your vision. You receive a polished, publication-ready manuscript — and you keep every right and every royalty.",
    process: ['Discovery call & voice interview', 'Writer matching & approval', 'Outline & chapter-by-chapter approval', 'Draft delivery in phases', 'Revisions until perfect', 'Final manuscript delivery'],
    includes: ['Full manuscript (any length)', 'Voice matching interview', 'Chapter-by-chapter review', 'Unlimited revisions', 'Plagiarism check', 'Strict NDA & IP transfer', 'Author retains 100% credit & royalties'],
    startingAt: 1249,
  },
  'book-publishing': {
    title: 'Book Publishing',
    tagline: 'From Manuscript to Global Bookshelf',
    description: 'We handle every technical step of the publishing process — ISBNs, metadata, category research, platform setup, and distribution. Your book reaches 150+ retailers worldwide.',
    process: ['ISBN assignment', 'Metadata & keyword optimization', 'Category & BISAC selection', 'File preparation & QC', 'Platform submission', 'Sales dashboard access'],
    includes: ['ISBNs for all formats', 'Amazon KDP & IngramSpark', 'eBook & print publishing', '150+ retailer distribution', 'Author copies (print)', 'Royalty setup', 'Sales tracking access'],
    startingAt: 499,
  },
  editing: {
    title: 'Editing & Proofreading',
    tagline: 'Make Every Word Count',
    description: 'Our editorial team brings decades of Big Five publishing experience. Whether you need high-level developmental feedback or a final polish before launch, we have the editor for your book.',
    process: ['Manuscript assessment', 'Developmental feedback', 'Line & copy editing', 'Author revisions', 'Final proofreading', 'Clean manuscript delivery'],
    includes: ['Developmental editing', 'Line editing', 'Copyediting', 'Proofreading', 'Style guide creation', 'Two-pass editing', 'Tracked changes (Word)'],
    startingAt: 299,
  },
  'cover-design': {
    title: 'Cover Design',
    tagline: 'Judge a Book by Its Cover',
    description: 'We research the best-selling titles in your genre and design covers that both fit the market and stand out on the shelf. Five unique concepts, unlimited revisions.',
    process: ['Genre & competitor research', '5 initial concepts', 'Client feedback round', 'Refinement', 'Final approval', 'All file formats delivered'],
    includes: ['Front cover', 'Back cover & spine', 'eBook cover', 'Social media kit', '5 initial concepts', 'Unlimited revisions', 'Print-ready files (300 DPI)'],
    startingAt: 349,
  },
  formatting: {
    title: 'Interior Formatting',
    tagline: 'Professional Layout, Every Format',
    description: 'Proper formatting is invisible — readers never notice it, but they immediately notice when it\'s wrong. Our formatters ensure your book meets all platform standards.',
    process: ['Manuscript review', 'Style template selection', 'Interior layout', 'Image & chart placement', 'Proofing', 'Final file delivery'],
    includes: ['Print-ready PDF', 'EPUB 3.0', 'MOBI (Kindle)', 'Custom chapter headers', 'Image placement', 'Front & back matter', 'Platform submission files'],
    startingAt: 199,
  },
  audiobook: {
    title: 'Audiobook Production',
    tagline: 'Bring Your Book to Life',
    description: 'The audiobook market is booming. We handle everything from narrator casting to final mastering and distribution on Audible, Apple Books, Spotify, and more.',
    process: ['Narrator casting & selection', 'Recording schedule', 'Studio recording', 'Quality control', 'Mastering & post-production', 'Platform distribution'],
    includes: ['Professional narrator', 'Studio-quality recording', 'ACX standards compliance', 'Audible & iTunes distribution', 'Findaway Voices distribution', 'Chapter markers', 'Retail-ready files'],
    startingAt: 799,
  },
  marketing: {
    title: 'Book Marketing',
    tagline: 'Get Found. Get Read. Get Ranked.',
    description: 'Our marketing team combines Amazon algorithm expertise, social media strategy, and traditional PR to put your book in front of the right readers at the right time.',
    process: ['Market research & positioning', 'Amazon listing optimization', 'ARC reader program', 'Launch campaign setup', 'Campaign execution', 'Performance reporting'],
    includes: ['Amazon keyword optimization', 'A+ content (Amazon)', 'ARC reader distribution', 'Social media campaign', 'Email launch sequence', 'Press release writing', 'Monthly reporting'],
    startingAt: 599,
  },
  'author-website': {
    title: 'Author Website Design',
    tagline: 'Your Home Base Online',
    description: 'A professional author website that sells your books, grows your mailing list, and establishes your brand. Built on modern tech with SEO and speed built in.',
    process: ['Brand & style consultation', 'Wireframe & mockup', 'Design approval', 'Development', 'Content population', 'Launch & training'],
    includes: ['Custom design', '5–10 pages', 'Mobile responsive', 'SEO optimization', 'Email list integration', 'Built-in bookstore', 'Blog functionality', 'Analytics setup'],
    startingAt: 999,
  },
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? serviceData[slug] : null

  if (!service) {
    return (
      <div className="pt-32 text-center section-padding">
        <h1 className="section-title mb-4">Service Not Found</h1>
        <Link to="/services" className="btn-primary">Back to Services</Link>
      </div>
    )
  }

  return (
    <div className="pt-24">
      <section className="section-padding bg-dark-800 border-b border-dark-600">
        <div className="container-max">
          <Link to="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="max-w-3xl">
            <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-3">{service.tagline}</p>
            <h1 className="section-title mb-4">{service.title}</h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">{service.description}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/consultation" className="btn-primary">
                Get Started – Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="inline-flex items-center text-gray-400 text-sm">
                Starting from <span className="text-white font-bold text-xl ml-2">${service.startingAt.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-900">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white mb-6">What's Included</h2>
            <ul className="space-y-3">
              {service.includes.map(item => (
                <li key={item} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-white mb-6">Our Process</h2>
            <div className="space-y-4">
              {service.process.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{i + 1}</span>
                  <span className="text-gray-300 pt-1">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
