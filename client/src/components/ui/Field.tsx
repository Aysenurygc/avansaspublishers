type Props = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  /** Needed wherever the surrounding form must still submit without JavaScript. */
  name?: string
  autoComplete?: string
}

export default function Field({
  id, label, type = 'text', value, onChange, placeholder, required, rows, name, autoComplete,
}: Props) {
  const shared = {
    id,
    name: name ?? id,
    autoComplete,
    value,
    required,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    // 1rem, not less: iOS Safari zooms the page into any input set below 16px.
    className: 'w-full px-3.5 py-3 text-[1rem] bg-transparent outline-none transition-colors focus:border-ink',
    style: { border: '2px solid var(--hairline)', color: 'var(--ink)' },
  }

  return (
    <div>
      <label htmlFor={id} className="lbl block mb-2 text-muted">{label}</label>
      {rows ? <textarea {...shared} rows={rows} className={shared.className + ' resize-none'} /> : <input {...shared} type={type} />}
    </div>
  )
}
