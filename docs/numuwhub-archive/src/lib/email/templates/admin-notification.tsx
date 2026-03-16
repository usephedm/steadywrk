import React from 'react'

interface AdminNotificationProps {
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
  customerEmail: string
  customerPhone?: string | null
  adminDashboardUrl: string
}

export function AdminNotificationTemplate({
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
  customerEmail,
  customerPhone,
  adminDashboardUrl,
}: AdminNotificationProps) {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#0f172a', lineHeight: 1.6 }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px' }}>New numuw.hub booking request</h1>
        <p style={{ marginTop: 0, color: '#475569' }}>
          A new request has been captured and should now be visible in the admin queue.
        </p>

        <div style={{ marginTop: '24px', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px', background: '#f8fafc' }}>
          <h2 style={{ marginTop: 0, fontSize: '18px' }}>Booking summary</h2>
          <p><strong>Booking ID:</strong> {bookingId}</p>
          <p><strong>Customer:</strong> {customerName}</p>
          {businessName && <p><strong>Business:</strong> {businessName}</p>}
          <p><strong>Email:</strong> {customerEmail}</p>
          {customerPhone && <p><strong>Phone:</strong> {customerPhone}</p>}
          <p><strong>Package:</strong> {packageLabel}</p>
          {priceLabel && <p><strong>Offer:</strong> {priceLabel}</p>}
          <p><strong>Date:</strong> {formattedDate}</p>
          <p><strong>Time:</strong> {time} ({timezone})</p>
          <p><strong>Duration:</strong> {durationMinutes} minutes</p>
          {notes && <p><strong>Notes:</strong> {notes}</p>}
        </div>

        <div style={{ marginTop: '24px' }}>
          <a
            href={adminDashboardUrl}
            style={{
              display: 'inline-block',
              padding: '12px 18px',
              background: '#0f172a',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 600,
            }}
          >
            Open admin dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
