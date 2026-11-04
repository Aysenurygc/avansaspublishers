import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Field from '@/components/ui/Field'
import Colophon from '@/components/ui/Colophon'
import { auth } from '@/lib/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('The two passwords do not match.'); return }
    if (form.password.length < 8) { toast.error('Use at least eight characters.'); return }

    setBusy(true)
    try {
      const { token } = await auth.register({ name: form.name, email: form.email, password: form.password })
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'That did not go through.')
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
          <h1>Create an account</h1>
          <p className="sub">For tracking a book already with us.</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5 p-6 sm:p-7" style={{ border: '2px solid var(--ink)' }}>
          <Field id="r-name"     label="Name"             value={form.name}     onChange={v => setForm({ ...form, name: v })}     required placeholder="Your name" />
          <Field id="r-email"    label="Email"            type="email"    value={form.email}    onChange={v => setForm({ ...form, email: v })}    required placeholder="you@example.com" />
          <Field id="r-password" label="Password"         type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} required placeholder="Eight characters or more" />
          <Field id="r-confirm"  label="Confirm password" type="password" value={form.confirm}  onChange={v => setForm({ ...form, confirm: v })}  required placeholder="Again" />
          <button type="submit" disabled={busy} className="btn disabled:opacity-50">
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="text-muted text-[.88rem] mt-6">
          Already have one? <Link to="/login" className="underline underline-offset-4 text-ink">Sign in</Link>
        </p>
      </div>
    </section>
  )
}
