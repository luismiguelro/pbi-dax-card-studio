export type ThemeMode = 'dark' | 'light'

const storageKey = 'pbi-kit:theme'

export function getStoredTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return 'light'
    return raw === 'light' ? 'light' : 'dark'
  } catch {
    return 'light'
  }
}

export function storeTheme(mode: ThemeMode) {
  try {
    localStorage.setItem(storageKey, mode)
  } catch {
    return
  }
}

export function applyThemeToDom(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
}
