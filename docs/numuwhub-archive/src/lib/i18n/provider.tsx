'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import enMessages from '@/locales/en.json'
import arMessages from '@/locales/ar.json'
import { useLocale, Locale } from './useLocale'

// ─── Types ───────────────────────────────────────────────────────────

type Messages = typeof enMessages

interface I18nContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: string, params?: Record<string, string | number>) => string
  isHydrated: boolean
}

// ─── Context ─────────────────────────────────────────────────────────

const I18nContext = createContext<I18nContextValue | null>(null)

// ─── Translation helpers ─────────────────────────────────────────────

const LOCALES: Record<Locale, Messages> = { en: enMessages, ar: arMessages }

function resolve(messages: Messages, key: string): string | undefined {
  const parts = key.split('.')
  let current: unknown = messages
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : undefined
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`
  })
}

// ─── Provider ────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale, dir, setLocale, toggleLocale, isHydrated } = useLocale()

  // Apply document-level attributes when locale changes
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir

    // Swap font class on body
    document.body.classList.remove('font-arabic', 'font-sans')
    document.body.classList.add(locale === 'ar' ? 'font-arabic' : 'font-sans')
  }, [locale, dir])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      // Try current locale first, fall back to English
      const value = resolve(LOCALES[locale], key) ?? resolve(LOCALES.en, key)
      if (value === undefined) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[i18n] Missing translation key: "${key}" (locale: ${locale})`)
        }
        return key
      }
      return interpolate(value, params)
    },
    [locale]
  )

  const contextValue = useMemo(
    () => ({
      locale,
      dir,
      setLocale,
      toggleLocale,
      t,
      isHydrated,
    }),
    [locale, dir, setLocale, toggleLocale, t, isHydrated]
  )

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an <I18nProvider>')
  }
  return ctx
}
