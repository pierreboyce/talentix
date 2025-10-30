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

  // Password gate middleware - ENABLED
  // cookie that unlocks site after correct password
  const hasAccess = request.cookies.get('talentix_access')?.value === 'authenticated'

  // allow the coming-soon page and legal pages always
  if (pathname === '/coming-soon' || pathname === '/privacy') {
    return NextResponse.next()
  }

  // 📱 Mobile device handling - redirect mobile users to mobile coming soon cutscene unless they have access cookie
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const hasMobileAccess = request.cookies.get('talentix_mobile_access')?.value === 'authenticated'
  
  if (isMobile && !hasMobileAccess) {
    // Allow the mobile coming soon route and privacy page to render normally
    if (pathname.startsWith('/mobile-coming-soon') || pathname === '/privacy') {
    return NextResponse.next()
    }
    // Redirect all other mobile requests to the cutscene/coming-soon experience
    const url = request.nextUrl.clone()
    url.pathname = '/mobile-coming-soon'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


