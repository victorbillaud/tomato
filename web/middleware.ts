import { createClient } from '@/utils/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request)

    try {
      await supabase.auth.getSession()
    } catch (e) {
      throw new Error('Impossible to get session')
    }

    const privatePathsPrefix = ['/dashboard', '/chat', '/user'];

    const isPrivatePath = privatePathsPrefix.some(prefix => request.nextUrl.pathname.startsWith(prefix))

    if (isPrivatePath) {
      const { data: session } = await supabase.auth.getSession()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user || !session) {
        return NextResponse.redirect(buildRedirectUrl(request, '/auth/login', {
          next: request.nextUrl.pathname,
        }))
      }
    }

    return response
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

const buildRedirectUrl = (request: NextRequest, redirectPath: string, redirectQuery: Record<string, string>) => {
  const redirectUrl = new URL(redirectPath, request.nextUrl.origin)
  Object.entries(redirectQuery).forEach(([key, value]) => redirectUrl.searchParams.append(key, value))
  return redirectUrl.href
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};