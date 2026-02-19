import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'pkn_session'
const SESSION_VALUE = 'authenticated'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require auth
  if (
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/fonts') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check authentication
  const session = request.cookies.get(SESSION_COOKIE)
  const isAuthenticated = session?.value === SESSION_VALUE

  if (!isAuthenticated) {
    // Redirect to login
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts/).*)',
  ],
}
