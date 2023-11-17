import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(requestUrl.searchParams.get('redirectTo') || '/', requestUrl.origin).toString(), { status: 302 })
    }

    const url = new URL(request.url)
    url.pathname = '/auth/login'
    url.searchParams.set('error', error.message)

    return NextResponse.redirect(url.toString(), { status: 302 })
  }


  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
