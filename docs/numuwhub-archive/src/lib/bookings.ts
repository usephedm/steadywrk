import { TimeSlot } from '@/types'
import { getServerConfig } from '@/lib/server-config'
import { isSlotBusy, type BusyPeriod } from '@/lib/calendar/availability'

const BUSINESS_DAYS = new Set([0, 1, 2, 3, 4])
const START_HOUR = 9
const END_HOUR = 17
const SLOT_MINUTES = 30

export function isBusinessDay(date: string) {
  const localDate = new Date(`${date}T12:00:00`)
  return BUSINESS_DAYS.has(localDate.getDay())
}

/**
 * Build time slots for a given date, marking slots as unavailable if they
 * are already booked in the database OR overlap with Google Calendar busy
 * periods.
 */
export function buildTimeSlots(
  date: string,
  bookedTimes: string[] = [],
  busyPeriods: BusyPeriod[] = []
): TimeSlot[] {
  if (!isBusinessDay(date)) {
    return []
  }

  const normalizedBookedTimes = new Set(
    bookedTimes
      .filter(Boolean)
      .map((time) => time.slice(0, 5))
  )

  const slots: TimeSlot[] = []

  for (let hour = START_HOUR; hour < END_HOUR; hour += 1) {
    for (let minutes = 0; minutes < 60; minutes += SLOT_MINUTES) {
      const time = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      const dbBooked = normalizedBookedTimes.has(time)
      const calendarBusy = isSlotBusy(date, time, SLOT_MINUTES, busyPeriods)

      slots.push({
        time,
        available: !dbBooked && !calendarBusy,
      })
    }
  }

  return slots
}

export function resolveNotificationState() {
  const config = getServerConfig()

  if (!config.emailConfigured) {
    return {
      notification_status: 'not_configured' as const,
      notification_error: 'Email provider not configured yet',
    }
  }

  return {
    notification_status: 'queued' as const,
    notification_error: null,
  }
}

export function resolveCalendarState() {
  const config = getServerConfig()

  if (!config.calendarConfigured) {
    return {
      calendar_status: 'manual_required' as const,
      calendar_error: 'Calendar provider not configured yet',
      calendar_event_ref: null,
    }
  }

  return {
    calendar_status: 'pending' as const,
    calendar_error: null,
    calendar_event_ref: null,
  }
}
