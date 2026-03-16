import React from 'react'

interface BookingConfirmationProps {
  bookingId: string
  packageLabel: string
  priceLabel?: string
  date: string
  time: string
  timezone: string
  durationMinutes: number
  notes?: string | null
  customerName: string
  businessName?: string | null
  supportEmail: string
  supportPhone?: string
}

export function BookingConfirmationTemplate({
  bookingId,
  packageLabel,
  priceLabel,
  date,
  time,
  timezone,
  durationMinutes,
  notes,
  customerName,
  businessName,
  supportEmail,
  supportPhone,
}: BookingConfirmationProps) {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#0f172a', lineHeight: 1.6 }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px' }}>Your numuw.hub demo request is in</h1>
        <p style={{ marginTop: 0, color: '#475569' }}>
          Hello {customerName}, we saved your request and the owner can already see it in the admin queue.
        </p>

        <div style={{ marginTop: '24px', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px', background: '#f8fafc' }}>
          <h2 style={{ marginTop: 0, fontSize: '18px' }}>Request details</h2>
          <p><strong>Booking ID:</strong> {bookingId}</p>
          {businessName && <p><strong>Business:</strong> {businessName}</p>}
          <p><strong>Package:</strong> {packageLabel}</p>
          {priceLabel && <p><strong>Offer:</strong> {priceLabel}</p>}
          <p><strong>Date:</strong> {formattedDate}</p>
          <p><strong>Time:</strong> {time} ({timezone})</p>
          <p><strong>Duration:</strong> {durationMinutes} minutes</p>
          {notes && <p><strong>Notes:</strong> {notes}</p>}
        </div>

        <div style={{ marginTop: '20px', borderRadius: '16px', padding: '20px', background: '#ecfdf5', color: '#14532d' }}>
          If email and calendar integrations are fully configured, you will receive follow-up automatically. If not, the request is still saved and handled manually.
        </div>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#475569' }}>
          <p style={{ marginBottom: '6px' }}><strong>Support:</strong> {supportEmail}</p>
          {supportPhone && <p style={{ marginTop: 0 }}><strong>Phone:</strong> {supportPhone}</p>}
        </div>
      </div>
    </div>
  )
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function buildUtcDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+03:00`)
}

function generateIcsContent({
  bookingId,
  packageLabel,
  date,
  time,
  durationMinutes,
  customerName,
  customerEmail,
}: {
  bookingId: string
  packageLabel: string
  date: string
  time: string
  durationMinutes: number
  customerName: string
  customerEmail: string
}) {
  const startDate = buildUtcDate(date, time)
  const endDate = new Date(startDate.getTime() + durationMinutes * 60_000)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//numuw.hub//Booking Flow//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${bookingId}@numuwhub.biz`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${packageLabel} - numuw.hub`,
    `DESCRIPTION:Booking ${bookingId} for ${customerName}`,
    `ORGANIZER;CN=numuw.hub:mailto:support@numuwhub.biz`,
    `ATTENDEE;CN=${customerName.replace(/,/g, '\\,')}:mailto:${customerEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function getIcsAttachment({
  bookingId,
  packageLabel,
  date,
  time,
  timezone,
  durationMinutes,
  customerName,
  customerEmail,
}: {
  bookingId: string
  packageLabel: string
  date: string
  time: string
  timezone: string
  durationMinutes: number
  customerName: string
  customerEmail: string
}) {
  return {
    filename: `numuwhub-booking-${bookingId}.ics`,
    content: generateIcsContent({
      bookingId,
      packageLabel: `${packageLabel} (${timezone})`,
      date,
      time,
      durationMinutes,
      customerName,
      customerEmail,
    }),
  }
}
