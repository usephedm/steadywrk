'use client'

import { useState, useEffect, useCallback } from 'react'

export type Locale = 'en' | 'ar'

const STORAGE_KEY = 'numuw_locale'
const DEFAULT_LOCALE: Locale = 'en'

/**
 * Hook for managing locale state with localStorage persistence
 */
export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored && (stored === 'en' || stored === 'ar')) {
        setLocaleState(stored)
      }
    } catch {
      // SSR or localStorage not available
    }
    setIsHydrated(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // ignore localStorage errors
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en')
  }, [locale, setLocale])

  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr'

  return {
    locale,
    dir,
    setLocale,
    toggleLocale,
    isHydrated,
  }
}

/**
 * Get locale from localStorage (for SSR/hydration)
 */
export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && (stored === 'en' || stored === 'ar')) {
      return stored
    }
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE
}
