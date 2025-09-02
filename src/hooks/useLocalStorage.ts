// src/hooks/useLocalStorage.ts
'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key)
      if (saved) {
        try {
          setValue(JSON.parse(saved))
        } catch {
          setValue(defaultValue)
        }
      }
    }
  }, [key, defaultValue])

  const updateValue = (newValue: T) => {
    setValue(newValue)
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }

  return [value, updateValue] as const
}