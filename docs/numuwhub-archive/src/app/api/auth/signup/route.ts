import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication is not configured yet' },
        { status: 503 }
      )
    }

    const body = await request.json()

    const validation = authSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          details: validation.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    const { email, password, full_name } = validation.data

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    })

    if (error) {
      // Sanitize error messages
      console.error('Signup Supabase Auth Error:', error)
      let userMessage = error.message || 'Failed to create account'
      if (error.message?.includes('already registered')) {
        userMessage = 'An account with this email already exists'
      } else if (error.message?.includes('password')) {
        userMessage = 'Password must be at least 6 characters'
      }

      return NextResponse.json(
        { error: userMessage, details: error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email to confirm.',
      user: data.user,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
