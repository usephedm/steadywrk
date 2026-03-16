'use client'

import React from 'react'
import { useI18n } from '@/lib/i18n'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  /** Compact = icon only (mobile), full = icon + label */
  variant?: 'compact' | 'full'
  className?: string
}

/**
 * Toggle between English ↔ Arabic.
 * Shows the *other* language name so users see what they'll switch to.
 */
export function LanguageSwitcher({
  variant = 'full',
  className = '',
}: LanguageSwitcherProps) {
  const { locale, toggleLocale, t, isHydrated } = useI18n()

  // Prevent flash of wrong locale during hydration
  if (!isHydrated) return null

  const label =
    locale === 'en'
      ? t('language.switchToArabic')
      : t('language.switchToEnglish')

  return (
    <button
      onClick={toggleLocale}
      className={`inline-flex items-center gap-2 rounded-full border border-slate-200
        px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors
        hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 ${className}`}
      aria-label={label}
      title={label}
    >
      <Globe className="h-4 w-4" />
      {variant === 'full' && (
        <span>{locale === 'en' ? 'العربية' : 'English'}</span>
      )}
    </button>
  )
}
