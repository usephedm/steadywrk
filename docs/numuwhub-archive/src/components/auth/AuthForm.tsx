'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Lock, Mail, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/components/i18n/Translated'

type AuthMode = 'login' | 'signup'

interface AuthFormProps {
  mode?: AuthMode
}

interface AuthFormData {
  email: string
  password: string
  full_name: string
}

interface FormErrors {
  email?: string
  password?: string
  full_name?: string
  general?: string
}

export function AuthForm({ mode = 'login' }: AuthFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    full_name: '',
  })

  const validateForm = () => {
    const nextErrors: FormErrors = {}

    if (!formData.email) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (mode === 'signup' && !formData.full_name.trim()) {
      nextErrors.full_name = 'Full name is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      if (mode === 'signup') {
        router.push('/auth/login?created=1')
        return
      }

      router.refresh()
      router.push('/admin')
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-[2rem] border border-blue-500/20 bg-[#030a1c]/80 backdrop-blur-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">
            {mode === 'login' ? t('auth.adminAccess') : t('auth.createIdentity')}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {mode === 'login'
              ? t('auth.adminAccessSubtitle')
              : t('auth.createIdentitySubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              label={t('auth.fullNameLabel')}
              type="text"
              placeholder={t('auth.fullNameLabel')}
              value={formData.full_name}
              onChange={(event) => setFormData({ ...formData, full_name: event.target.value })}
              error={errors.full_name}
              icon={<User className="h-5 w-5" />}
            />
          )}

          <Input
            label={t('auth.emailLabel')}
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            error={errors.email}
            icon={<Mail className="h-5 w-5" />}
          />

          <Input
            label={t('auth.passwordLabel')}
            type="password"
            placeholder={t('auth.passwordLabel')}
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            error={errors.password}
            icon={<Lock className="h-5 w-5" />}
            minLength={6}
          />

          {errors.general && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.general}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            {mode === 'login' ? t('auth.loginButton') : t('auth.signupButton')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? t('auth.noIdentity') : t('auth.hasIdentity')}{' '}
          <a
            href={mode === 'login' ? '/auth/signup' : '/auth/login'}
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {mode === 'login' ? t('auth.establishOne') : t('auth.initializeSession')}
          </a>
        </div>
      </div>
    </div>
  )
}
