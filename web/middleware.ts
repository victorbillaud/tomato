import { createClient } from '@/utils/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession()

    const pathnameThatRequireAuth = [
      '/dashboard',
      '/dashboard/*',
    ]

    const isProtectedPath = pathnameThatRequireAuth.includes(request.nextUrl.pathname)

    if (isProtectedPath) {
      const { data: session } = await supabase.auth.getSession()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user || !session) {
        return NextResponse.redirect(buildRedirectUrl(request, '/auth/login', {
          redirectTo: request.nextUrl.pathname,
        }))
      }
    }

    middlewareAfterLogin(request)

    return response
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

// Create middleware to redirect to a the path after login
const middlewareAfterLogin = (request: NextRequest) => {
  const redirectTo = request.nextUrl.searchParams.get('redirectTo')

  console.log("redirectTo", redirectTo)

  if (redirectTo) {
    return NextResponse.redirect(buildRedirectUrl(request, redirectTo, {}))
  }

  return NextResponse.redirect(buildRedirectUrl(request, '/', {}))
}

const buildRedirectUrl = (request: NextRequest, redirectPath: string, redirectQuery: Record<string, string>) => {
  const redirectUrl = new URL(redirectPath, request.nextUrl.origin)
  Object.entries(redirectQuery).forEach(([key, value]) => redirectUrl.searchParams.append(key, value))
  return redirectUrl.href
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};