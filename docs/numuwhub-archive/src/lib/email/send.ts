import { Resend } from 'resend'
import { render } from '@react-email/render'
import { AdminNotificationTemplate } from './templates/admin-notification'
import { BookingConfirmationTemplate, getIcsAttachment } from './templates/confirmation'

let resendClient: Resend | null = null

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }

  return resendClient
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'bookings@numuwhub.biz'
const EMAIL_TO = process.env.EMAIL_TO || 'support@numuwhub.biz'
const ADMIN_DASHBOARD_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/admin'

export interface BookingEmailPayload {
  bookingId: string
  packageLabel: string
  packageType: string
  priceLabel?: string
  date: string
  time: string
  timezone: string
  durationMinutes: number
  notes?: string | null
  fullName: string
  businessName?: string | null
  email: string
  phone?: string | null
}

interface EmailResult {
  success: boolean
  skipped?: boolean
  messageId?: string
  error?: string
}

export async function sendBookingConfirmation(payload: BookingEmailPayload): Promise<EmailResult> {
  const resend = getResendClient()

  if (!resend) {
    return {
      success: false,
      skipped: true,
      error: 'Email provider not configured.',
    }
  }

  try {
    const html = await render(
      BookingConfirmationTemplate({
        bookingId: payload.bookingId,
        packageLabel: payload.packageLabel,
        priceLabel: payload.priceLabel,
        date: payload.date,
        time: payload.time,
        timezone: payload.timezone,
        durationMinutes: payload.durationMinutes,
        notes: payload.notes,
        customerName: payload.fullName,
        businessName: payload.businessName,
        supportEmail: EMAIL_FROM,
        supportPhone: process.env.SUPPORT_PHONE || undefined,
      })
    )

    const icsAttachment = getIcsAttachment({
      bookingId: payload.bookingId,
      packageLabel: payload.packageLabel,
      date: payload.date,
      time: payload.time,
      timezone: payload.timezone,
      durationMinutes: payload.durationMinutes,
      customerName: payload.fullName,
      customerEmail: payload.email,
    })

    const result = await resend.emails.send({
      from: `numuw.hub <${EMAIL_FROM}>`,
      to: [payload.email],
      subject: `numuw.hub demo request received for ${payload.date} at ${payload.time}`,
      html,
      attachments: [
        {
          filename: icsAttachment.filename,
          content: icsAttachment.content,
          contentType: 'text/calendar; method=PUBLISH',
        },
      ],
    })

    if (result.error) {
      throw new Error(result.error.message || 'Failed to send confirmation email')
    }

    return {
      success: true,
      messageId: result.data?.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    }
  }
}

export async function sendAdminNotification(payload: BookingEmailPayload): Promise<EmailResult> {
  const resend = getResendClient()

  if (!resend) {
    return {
      success: false,
      skipped: true,
      error: 'Email provider not configured.',
    }
  }

  try {
    const html = await render(
      AdminNotificationTemplate({
        bookingId: payload.bookingId,
        packageLabel: payload.packageLabel,
        priceLabel: payload.priceLabel,
        date: payload.date,
        time: payload.time,
        timezone: payload.timezone,
        durationMinutes: payload.durationMinutes,
        notes: payload.notes,
        customerName: payload.fullName,
        businessName: payload.businessName,
        customerEmail: payload.email,
        customerPhone: payload.phone,
        adminDashboardUrl: ADMIN_DASHBOARD_URL,
      })
    )

    const result = await resend.emails.send({
      from: `numuw.hub Alerts <${EMAIL_FROM}>`,
      to: [EMAIL_TO],
      subject: `New numuw.hub booking: ${payload.businessName || payload.fullName}`,
      html,
    })

    if (result.error) {
      throw new Error(result.error.message || 'Failed to send admin notification')
    }

    return {
      success: true,
      messageId: result.data?.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    }
  }
}

export async function sendBookingEmails(payload: BookingEmailPayload): Promise<{
  skipped: boolean
  confirmationResult: EmailResult
  adminResult: EmailResult
}> {
  const [confirmationResult, adminResult] = await Promise.all([
    sendBookingConfirmation(payload),
    sendAdminNotification(payload),
  ])

  return {
    skipped: Boolean(confirmationResult.skipped && adminResult.skipped),
    confirmationResult,
    adminResult,
  }
}
