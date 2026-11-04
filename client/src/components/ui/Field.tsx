type Props = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
}

export default function Field({ id, label, type = 'text', value, onChange, placeholder, required, rows }: Props) {
  const shared = {
    id,
    value,
    required,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className: 'w-full px-3.5 py-3 text-[.95rem] bg-transparent outline-none transition-colors focus:border-ink',
    style: { border: '2px solid var(--hairline)', color: 'var(--ink)' },
  }

  return (
    <div>
      <label htmlFor={id} className="lbl block mb-2 text-muted">{label}</label>
      {rows ? <textarea {...shared} rows={rows} className={shared.className + ' resize-none'} /> : <input {...shared} type={type} />}
    </div>
  )
}
