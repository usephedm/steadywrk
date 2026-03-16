import { NextRequest, NextResponse } from 'next/server'
import { buildTimeSlots, resolveCalendarState, resolveNotificationState } from '@/lib/bookings'
import { createCalendarEvent } from '@/lib/calendar'
import { findPackageById, siteContent } from '@/lib/content'
import { sendBookingEmails } from '@/lib/email/send'
import { createLaunchOfferApplication } from '@/lib/launch-offers'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { createBookingSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        {
          error: 'Booking is temporarily unavailable while the backend is being configured.',
          fallback: `Please contact ${siteContent.supportEmail} or ${siteContent.supportPhone}.`,
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const validation = createBookingSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid booking information',
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    const {
      serviceId,
      packageType,
      fullName,
      businessName,
      email,
      phone,
      preferredLanguage,
      date,
      time,
      timezone,
      notes,
      requestLaunchOffer,
    } = validation.data

    const packageInfo = findPackageById(serviceId) || findPackageById(packageType)

    if (!packageInfo) {
      return NextResponse.json(
        { error: 'Selected package is not available' },
        { status: 404 }
      )
    }

    const availableSlots = buildTimeSlots(date)
    if (!availableSlots.some((slot) => slot.time === time)) {
      return NextResponse.json(
        { error: 'Selected date or time is outside demo availability' },
        { status: 400 }
      )
    }

    const { data: existingBookings, error: availabilityError } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .limit(1)

    if (availabilityError) {
      console.error('Booking availability error:', availabilityError)
      return NextResponse.json(
        { error: 'Could not verify slot availability. Please try again.' },
        { status: 500 }
      )
    }

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please choose another one.' },
        { status: 409 }
      )
    }

    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user
    const notificationState = resolveNotificationState()
    const calendarState = resolveCalendarState()

    // We use a service role client strictly to bypass the SELECT policy restriction on anonymous inserts,
    // which otherwise returns a PGRST116 (0 rows returned) because anon users can't read their own inserts.
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() {},
        },
      }
    )

    const { data: booking, error: bookingError } = await adminSupabase
      .from('bookings')
      .insert({
        user_id: user?.id || null,
        service_id: null,
        full_name: fullName,
        business_name: businessName,
        email,
        phone,
        preferred_language: preferredLanguage,
        package_type: packageType,
        package_label: packageInfo.name,
        date,
        time,
        timezone,
        notes: notes || null,
        status: 'pending',
        source: 'website',
        request_launch_offer: requestLaunchOffer || false,
        notification_status: notificationState.notification_status,
        notification_error: notificationState.notification_error,
        calendar_status: calendarState.calendar_status,
        calendar_error: calendarState.calendar_error,
        calendar_event_ref: calendarState.calendar_event_ref,
      })
      .select('*')
      .single()

    if (bookingError || !booking) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json(
        { 
          error: bookingError?.message || 'Failed to save the booking request. Please try again.',
          details: bookingError?.details || bookingError?.hint 
        },
        { status: 500 }
      )
    }

    let launchOffer: {
      requested: boolean
      applicationStatus: 'created' | 'existing' | 'unavailable' | 'failed' | 'not_requested'
      message?: string
    } = {
      requested: Boolean(requestLaunchOffer),
      applicationStatus: requestLaunchOffer ? 'unavailable' : 'not_requested',
    }

    if (requestLaunchOffer) {
      const offerResult = await createLaunchOfferApplication({
        bookingId: booking.id,
        businessName,
        email,
        packageType,
      })

      launchOffer = {
        requested: true,
        applicationStatus: offerResult.status,
        message: offerResult.message,
      }
    }

    // Fire-and-forget: send emails + create calendar event in parallel
    // These don't block the response — booking is already saved
    const startDateTime = `${date}T${time}:00`
    const [emailResult, calendarResult] = await Promise.allSettled([
      sendBookingEmails(
        {
          bookingId: booking.id,
          packageLabel: packageInfo.name,
          packageType,
          priceLabel: packageInfo.price_label,
          date,
          time,
          timezone,
          durationMinutes: packageInfo.duration_minutes,
          notes: notes || null,
          fullName,
          businessName,
          email,
          phone,
        }
      ).catch((err) => {
        console.error('[Booking] Email send failed:', err)
        return {
          skipped: false,
          confirmationResult: { success: false, error: String(err) },
          adminResult: { success: false, error: String(err) },
        }
      }),
      createCalendarEvent({
        bookingId: booking.id,
        summary: `numuw.hub Demo: ${businessName}`,
        description: [
          `Booking ID: ${booking.id}`,
          `Customer: ${fullName}`,
          `Business: ${businessName}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          `Package: ${packageInfo.name}`,
          notes ? `Notes: ${notes}` : '',
        ].filter(Boolean).join('\n'),
        startDateTime,
        durationMinutes: 30,
        attendeeEmail: email,
        attendeeName: fullName,
      }).catch((err) => {
        console.error('[Booking] Calendar event failed:', err)
        return { success: false, error: String(err) } as const
      }),
    ])

    const nextUpdate: Record<string, string | null> = {}
    const settledEmailResult = emailResult.status === 'fulfilled' ? emailResult.value : null

    if (settledEmailResult) {
      if (settledEmailResult.skipped) {
        nextUpdate.notification_status = 'not_configured'
        nextUpdate.notification_error = 'Email provider not configured yet'
      } else if (
        settledEmailResult.confirmationResult.success &&
        settledEmailResult.adminResult.success
      ) {
        nextUpdate.notification_status = 'sent'
        nextUpdate.notification_error = null
      } else {
        nextUpdate.notification_status = 'failed'
        nextUpdate.notification_error = [
          settledEmailResult.confirmationResult.error,
          settledEmailResult.adminResult.error,
        ]
          .filter(Boolean)
          .join(' | ') || 'Email delivery failed'
      }
    }

    const calResult = calendarResult.status === 'fulfilled' ? calendarResult.value : null
    if (calResult && calResult.success && 'eventId' in calResult && calResult.eventId) {
      nextUpdate.calendar_event_ref = calResult.eventId
      nextUpdate.calendar_status = 'scheduled'
      nextUpdate.calendar_error = null
    } else if (calResult && 'skipped' in calResult && calResult.skipped) {
      nextUpdate.calendar_status = 'manual_required'
      nextUpdate.calendar_error = calResult.error || 'Calendar integration not configured yet'
    } else if (calResult && !calResult.success) {
      nextUpdate.calendar_status = 'failed'
      nextUpdate.calendar_error = calResult.error || 'Calendar event could not be created'
    }

    const meetLink = calResult && 'meetLink' in calResult ? calResult.meetLink : undefined

    if (Object.keys(nextUpdate).length > 0) {
      try {
        await supabase
          .from('bookings')
          .update(nextUpdate)
          .eq('id', booking.id)
      } catch (patchErr) {
        console.error('[Booking] Failed to patch provider states:', patchErr)
      }
    }

    return NextResponse.json({
      success: true,
      booking: { ...booking, ...nextUpdate, meet_link: meetLink },
      launchOffer,
      message:
        (nextUpdate.calendar_status || calendarState.calendar_status) === 'manual_required'
          ? 'Your request was saved. The team will confirm the meeting manually.'
          : 'Your request was saved. The team will confirm the meeting shortly.',
    })
  } catch (error) {
    console.error('Unexpected error in booking API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Bookings are unavailable until Supabase is configured' },
        { status: 503 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
