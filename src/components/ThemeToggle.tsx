import { useEffect, useState } from 'react'
import type { ThemeMode } from '../lib/theme'
import { applyThemeToDom, getStoredTheme, storeTheme } from '../lib/theme'

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    const initial = getStoredTheme()
    setMode(initial)
    applyThemeToDom(initial)
  }, [])

  const toggle = () => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    storeTheme(next)
    applyThemeToDom(next)
  }

  return (
    <button className="themeFab" onClick={toggle} title="Toggle theme">
      <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--text)' }}>
        {mode === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}
