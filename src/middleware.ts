import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow these paths without any checks
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check for coming soon access cookie
  const hasAccess = request.cookies.get('talentix_access')?.value === 'authenticated'
  
  // If trying to access coming-soon page
  if (pathname === '/coming-soon') {
    // If already has access, redirect to home
    if (hasAccess) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Otherwise, allow access to coming-soon page
    return NextResponse.next()
  }

  // If no access cookie and not on coming-soon page, redirect to coming-soon
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  // If has access, continue with normal auth logic for protected routes
  if (
    pathname === '/' ||
    pathname === '/our-story' ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next()
  }

  // Protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/cv-reviewer', 
    '/interview-prep',
    '/talentix-points',
    '/settings',
    '/career-guidance',
    '/search',
    '/account'
  ]

  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedRoute) {
    // Check for authentication
    const hasAuthCookie = request.cookies.get('talentix-session')?.value
    const hasOAuthUser = request.nextUrl.searchParams.get('oauth_user')
    const directLogin = request.nextUrl.searchParams.get('direct_login')
    
    // Allow OAuth flow and direct login flow to proceed
    if (hasOAuthUser || directLogin || hasAuthCookie) {
      return NextResponse.next()
    }
    
    // If no authentication found, redirect to homepage
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}


