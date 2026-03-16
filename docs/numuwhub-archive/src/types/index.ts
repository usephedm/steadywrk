export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export type PackageType = 'demo' | 'starter' | 'growth' | 'scale'
export type BookingLanguage = 'en' | 'ar'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type NotificationStatus = 'pending' | 'queued' | 'sent' | 'not_configured' | 'failed'
export type CalendarStatus = 'pending' | 'scheduled' | 'manual_required' | 'not_configured' | 'failed'

export interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  currency: string
  price_label?: string
  image_url?: string
  is_active: boolean
  is_featured?: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id?: string | null
  service_id?: string | null
  service?: Service
  full_name: string
  business_name?: string | null
  email: string
  phone: string
  preferred_language: BookingLanguage
  package_type: PackageType
  package_label: string
  date: string
  time: string
  timezone: string
  status: BookingStatus
  notes?: string
  admin_notes?: string | null
  source?: string
  request_launch_offer: boolean
  launch_offer_awarded?: boolean
  launch_offer_awarded_at?: string | null
  notification_status: NotificationStatus
  calendar_status: CalendarStatus
  notification_error?: string | null
  calendar_error?: string | null
  calendar_event_ref?: string | null
  created_at: string
  updated_at: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface AuthFormData {
  email: string
  password: string
  full_name?: string
}

export interface BookingFormPayload {
  serviceId: string
  packageType: PackageType
  fullName: string
  businessName: string
  email: string
  phone: string
  preferredLanguage: BookingLanguage
  date: string
  time: string
  timezone: string
  notes?: string
  requestLaunchOffer?: boolean
}
