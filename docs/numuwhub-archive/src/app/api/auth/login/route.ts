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
    const validation = authSchema.omit({ full_name: true }).safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Email or password is incorrect' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
