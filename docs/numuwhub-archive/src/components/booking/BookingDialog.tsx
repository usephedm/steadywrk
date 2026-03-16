'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Calendar, Clock, Globe2, Info, Mail, Phone, Store, User, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/components/i18n/Translated'
import { publicConfig } from '@/lib/public-config'
import { BookingFormPayload, PackageType, Service, TimeSlot } from '@/types'
import { BookingSuccess } from './BookingSuccess'

interface BookingDialogProps {
  service: Service
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type FieldErrors = Partial<Record<keyof BookingFormPayload, string>> & {
  general?: string
}

const businessDays = new Set([0, 1, 2, 3, 4])

function generateBusinessDates() {
  const dates = []
  const today = new Date()
  let offset = 0

  while (dates.length < 10) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)
    offset += 1

    if (!businessDays.has(date.getDay())) {
      continue
    }

    dates.push({
      full: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })
  }

  return dates
}

export function BookingDialog({ service, isOpen, onClose, onSuccess }: BookingDialogProps) {
  const { t } = useTranslation()
  const dates = useMemo(() => generateBusinessDates(), [])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    preferredLanguage: 'en' as 'en' | 'ar',
    notes: '',
    requestLaunchOffer: service.id !== 'demo',
  })
  const [offerAvailable, setOfferAvailable] = useState<boolean | null>(null)
  const [offerRemaining, setOfferRemaining] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleDismissSuccess = useCallback(() => {
    setShowSuccess(false)
    onSuccess()
    onClose()
  }, [onSuccess, onClose])

  // Fetch offer availability on mount
  useEffect(() => {
    async function checkOfferAvailability() {
      try {
        const response = await fetch('/api/offer/check')
        const data = await response.json()
        if (response.ok) {
          setOfferAvailable(data.available)
          setOfferRemaining(data.remaining)
        } else {
          setOfferAvailable(false)
        }
      } catch (error) {
        console.error('Failed to check offer availability:', error)
        setOfferAvailable(false)
      }
    }

    if (isOpen) {
      checkOfferAvailability()
    }
  }, [isOpen])

  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].full)
    }
  }, [dates, selectedDate])

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    let cancelled = false

    async function loadAvailability() {
      setLoadingTimes(true)
      setSelectedTime('')
      setFieldErrors((current) => ({ ...current, general: undefined }))

      try {
        const response = await fetch(`/api/availability?date=${selectedDate}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Could not load availability')
        }

        if (!cancelled) {
          setAvailableTimes(data.slots || [])
        }
      } catch (error) {
        if (!cancelled) {
          setAvailableTimes([])
          setFieldErrors((current) => ({
            ...current,
            general: error instanceof Error ? error.message : 'Could not load availability',
          }))
        }
      } finally {
        if (!cancelled) {
          setLoadingTimes(false)
        }
      }
    }

    loadAvailability()

    return () => {
      cancelled = true
    }
  }, [selectedDate])

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setFieldErrors({})

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || publicConfig.timezone

      const payload: BookingFormPayload = {
        serviceId: service.id,
        packageType: service.id as PackageType,
        fullName: formData.fullName,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        preferredLanguage: formData.preferredLanguage,
        date: selectedDate,
        time: selectedTime,
        timezone,
        notes: formData.notes || undefined,
        requestLaunchOffer: formData.requestLaunchOffer,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        const nextErrors: FieldErrors = {}

        if (Array.isArray(data.details)) {
          data.details.forEach((detail: { field?: keyof BookingFormPayload; message?: string }) => {
            if (detail.field && detail.message) {
              nextErrors[detail.field] = detail.message
            }
          })
        }

        nextErrors.general = data.error || 'Could not submit booking'
        setFieldErrors(nextErrors)
        return
      }

      setShowSuccess(true)
    } catch (error) {
      setFieldErrors({
        general: error instanceof Error ? error.message : 'Could not submit booking',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
    <BookingSuccess isVisible={showSuccess} onDismiss={handleDismissSuccess} customerName={formData.fullName} />
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/60" onClick={onClose} />

      {/* Mobile: bottom sheet  |  Desktop: centered modal */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-t-[2rem] sm:rounded-[2rem] border border-blue-500/20 bg-[#030a1c]/90 backdrop-blur-2xl shadow-2xl max-h-[92dvh] overflow-y-auto" style={{ animation: 'slideUp 0.35s ease-out' }}>
          {/* Mobile drag indicator */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="h-1.5 w-12 rounded-full bg-white/20" />
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid gap-0 lg:grid-cols-[1.1fr_1.5fr]">
            <div className="bg-slate-950 px-6 py-8 text-white lg:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">numuw.hub</p>
              <h2 className="mt-4 text-3xl font-semibold">{service.name}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">{service.description}</p>

              <div className="mt-8 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5">
                <p className="text-sm text-blue-300">{t('booking.engagementProtocol')}</p>
                <p className="mt-2 text-xl font-semibold">{t('booking.realSession')}</p>
                <p className="mt-2 text-sm text-slate-300">{service.price_label}</p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center">
                  <Clock className="mr-3 h-4 w-4 text-blue-400" />
                  {t('booking.ammanTime')}
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-4 w-4 text-blue-400" />
                  {publicConfig.supportEmail}
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-emerald-300" />
                  {publicConfig.supportPhone}
                </div>
              </div>
            </div>

            <form className="space-y-6 px-6 py-8 lg:px-8 bg-[#0a1428]/50" onSubmit={handleSubmit}>
              <div>
                <h3 className="text-2xl font-semibold text-white">{t('booking.initializeArchitecture')}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  {t('booking.requestQueueDesc')}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label={t('booking.fields.fullName')}
                  value={formData.fullName}
                  onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                  error={fieldErrors.fullName}
                  icon={<User className="h-4 w-4" />}
                  placeholder={t('booking.fields.fullName')}
                />
                <Input
                  label={t('booking.fields.businessName')}
                  value={formData.businessName}
                  onChange={(event) => setFormData((current) => ({ ...current, businessName: event.target.value }))}
                  error={fieldErrors.businessName}
                  icon={<Store className="h-4 w-4" />}
                  placeholder={t('booking.fields.businessName')}
                />
                <Input
                  label={t('booking.fields.email')}
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  error={fieldErrors.email}
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="you@business.com"
                />
                <Input
                  label={t('booking.fields.phone')}
                  value={formData.phone}
                  onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                  error={fieldErrors.phone}
                  icon={<Phone className="h-4 w-4" />}
                  placeholder="+962..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">{t('booking.operationalLanguage')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'en', label: t('booking.english') },
                      { value: 'ar', label: t('booking.arabic') },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, preferredLanguage: option.value as 'en' | 'ar' }))}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                          formData.preferredLanguage === option.value
                            ? 'border-blue-500 bg-blue-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <Globe2 className="mr-2 inline h-4 w-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">{t('booking.targetArchitecture')}</label>
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-slate-300">
                    <span className="font-semibold text-white">{service.name}</span>
                    <span className="ml-2 text-blue-400">{service.price_label}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  <Calendar className="mr-2 inline h-4 w-4" />
                  {t('booking.selectDeploymentDate')}
                </label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                  {dates.map((date) => (
                    <button
                      key={date.full}
                      type="button"
                      onClick={() => setSelectedDate(date.full)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        selectedDate === date.full
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide">{date.day}</div>
                      <div className="mt-1 text-sm">{date.date}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  <Clock className="mr-2 inline h-4 w-4" />
                  {t('booking.selectSyncWindow')}
                </label>
                {loadingTimes ? (
                  <div className="rounded-2xl border border-dashed border-blue-500/20 px-4 py-8 text-center text-sm text-blue-400">
                    {t('booking.checkingSlots')}
                  </div>
                ) : availableTimes.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-red-500/20 px-4 py-8 text-center text-sm text-red-400">
                    {t('booking.noSlots')}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                    {availableTimes.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                          !slot.available
                            ? 'cursor-not-allowed border-white/5 bg-white/5 text-slate-600 line-through'
                            : selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">{t('booking.operationalContext')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))}
                  rows={4}
                  maxLength={500}
                  className="w-full rounded-2xl border border-white/10 bg-[#030a1c]/50 backdrop-blur-md px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20"
                  placeholder={t('booking.contextPlaceholder')}
                />
                <p className="mt-2 text-xs text-slate-500">{formData.notes.length}/500</p>
              </div>

              {/* Launch Offer Checkbox */}
              <div className={`rounded-2xl border px-4 py-4 ${
                offerAvailable === false
                  ? 'border-white/10 bg-[#030a1c]/30'
                  : formData.requestLaunchOffer
                  ? 'border-blue-500/30 bg-blue-500/10'
                  : 'border-white/10 bg-[#030a1c]/50'
              }`}>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.requestLaunchOffer}
                    onChange={(event) => setFormData((current) => ({ ...current, requestLaunchOffer: event.target.checked }))}
                    disabled={offerAvailable === false}
                    className="mt-1 h-4 w-4 rounded border-blue-500/20 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white/5"
                  />
                  <span className={`text-sm ${offerAvailable === false ? 'text-slate-500' : 'text-blue-100'}`}>
                    {offerAvailable === false ? (
                      <>
                        <strong className="text-white">{t('booking.growthSubsidyExhausted')}</strong>
                        <p className="mt-1 text-slate-400">
                          The first 2 approved client profiles have consumed the initial launch grant.
                        </p>
                      </>
                    ) : (
                      <>
                        <strong>{t('booking.subsidizeGrowthNode')}:</strong> first {offerRemaining !== null ? offerRemaining : 2} approved client{offerRemaining !== 1 ? 's' : ''} get month 1 fully subsidized. 
                        <span className="block mt-1 text-blue-300">{t('booking.requiresManualApproval')}</span>
                      </>
                    )}
                  </span>
                </label>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-4 text-sm text-blue-200">
                <Info className="mr-2 inline h-4 w-4 text-blue-400" />
                {t('booking.supportFollowup', { supportEmail: publicConfig.supportEmail })}
              </div>

              {fieldErrors.general && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {fieldErrors.general}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row">
                <Button type="button" variant="outline" className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10" onClick={onClose}>
                  {t('booking.abort')}
                </Button>
                <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" isLoading={submitting} disabled={!selectedDate || !selectedTime}>
                  {t('booking.initializeRequest')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `}} />
    </>
  )
}
