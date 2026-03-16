function splitCsv(value: string | undefined) {
  return (value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export function getServerConfig() {
  return {
    serviceRoleConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
    emailConfigured: Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST),
    calendarConfigured: Boolean(
      process.env.GOOGLE_CALENDAR_CREDENTIALS || process.env.GOOGLE_CALENDAR_ID
    ),
    adminEmails: splitCsv(process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'kimoalsalah@gmail.com'),
  }
}

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false
  }

  const config = getServerConfig()
  return config.adminEmails.includes(email.toLowerCase())
}
