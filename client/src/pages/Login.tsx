import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Field from '@/components/ui/Field'
import Colophon from '@/components/ui/Colophon'
import { auth } from '@/lib/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const { token } = await auth.login(form)
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch {
      toast.error('Those details did not match an account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="band">
      <div className="wrap max-w-[440px]">
        <Link to="/" className="inline-block mb-9">
          <Colophon className="text-[2.2rem]" />
        </Link>

        <div className="sh">
          <span className="n num">—</span>
          <h1>Sign in</h1>
          <p className="sub">Track where your book stands.</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5 p-6 sm:p-7" style={{ border: '2px solid var(--ink)' }}>
          <Field id="l-email"    label="Email"    type="email"    value={form.email}    onChange={v => setForm({ ...form, email: v })}    required placeholder="you@example.com" />
          <Field id="l-password" label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} required placeholder="Your password" />
          <button type="submit" disabled={busy} className="btn disabled:opacity-50">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-muted text-[.88rem] mt-6">
          No account yet? <Link to="/register" className="underline underline-offset-4 text-ink">Create one</Link>
        </p>
      </div>
    </section>
  )
}
