import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // allow assets and APIs
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Password gate middleware
  // cookie that unlocks site after correct password
  const hasAccess = request.cookies.get('talentix_access')?.value === 'authenticated'

  // allow the coming-soon page and legal pages always
  if (pathname === '/coming-soon' || pathname === '/privacy') {
    return NextResponse.next()
  }

  // gate everything else until access cookie set
  if (!hasAccess) {
    const url = new URL('/coming-soon', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


