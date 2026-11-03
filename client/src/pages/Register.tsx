import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Account created! Welcome to Avansas.')
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-gold-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-white">Avansas<span className="text-primary-400">Publishers</span></span>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Start your publishing journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="card-dark space-y-4">
          {[
            { label: 'Full Name',        key: 'name',     type: 'text',     ph: 'Your full name' },
            { label: 'Email Address',    key: 'email',    type: 'email',    ph: 'your@email.com' },
            { label: 'Password',         key: 'password', type: 'password', ph: 'Create a password' },
            { label: 'Confirm Password', key: 'confirm',  type: 'password', ph: 'Confirm your password' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
              <input required type={field.type} value={form[field.key as keyof typeof form]}
                onChange={e => setForm({...form, [field.key]: e.target.value})}
                className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                placeholder={field.ph} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
