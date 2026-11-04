import { useState, useEffect } from 'react'

type Mode = 'auto' | 'light' | 'dark'
const modes: Mode[] = ['auto', 'light', 'dark']

const read = (): Mode => {
  try {
    const saved = localStorage.getItem('avansas-theme')
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved
  } catch { /* private window or blocked storage */ }
  return 'auto'
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>(read)

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', mode)
    try { localStorage.setItem('avansas-theme', mode) } catch { /* ignore */ }
  }, [mode])

  return (
    <button
      onClick={() => setMode(modes[(modes.indexOf(mode) + 1) % modes.length])}
      aria-label="Switch colour theme"
      className="lbl px-2.5 py-2 border-2 transition-colors hover:bg-ink hover:text-ground"
      style={{ borderColor: 'var(--ink)', fontSize: '.68rem' }}
    >
      Theme: {mode.charAt(0).toUpperCase() + mode.slice(1)}
    </button>
  )
}
