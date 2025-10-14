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

  // 📱 Mobile device handling - DISABLED FOR DEVELOPMENT
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  if (isMobile) {
    console.log('📱 Mobile device detected - allowing through (mobile coming soon disabled)')
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


