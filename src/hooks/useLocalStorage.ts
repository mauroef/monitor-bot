import { useState } from 'react'

export function useLocalStorage(key: string, defaultValue: boolean): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (stored === 'true') : defaultValue
    } catch {
      return defaultValue
    }
  })

  const set = (v: boolean) => {
    setValue(v)
    try { localStorage.setItem(key, String(v)) } catch {}
  }

  return [value, set]
}
