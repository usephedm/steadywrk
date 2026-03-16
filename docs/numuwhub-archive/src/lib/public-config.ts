import { siteContent } from '@/lib/content'

export const publicConfig = {
  supportEmail: siteContent.supportEmail,
  supportPhone: siteContent.supportPhone,
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timezone: 'Asia/Amman',
  supabaseConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
}
