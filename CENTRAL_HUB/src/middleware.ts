import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing admin routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Not authenticated - redirect to home with error
    if (!token) {
      const url = new URL('/', request.url)
      url.searchParams.set('callbackUrl', pathname)
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }

    // Authenticated but not admin - redirect to unauthorized page
    if (token.role !== 'ADMIN') {
      const url = new URL('/unauthorized', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
