import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Routes that require authentication
  const protectedRoutes = [
    /^\/college\/[^/]+\/fees$/,
    /^\/college\/[^/]+\/placement$/
  ]

  const isProtected = protectedRoutes.some(regex => regex.test(path))

  if (isProtected) {
    // Check for session/token in cookies
    const session = request.cookies.get('supabase-auth-token')
    
    if (!session) {
      // Redirect to login or append a query param to trigger the modal
      const url = request.nextUrl.clone()
      url.pathname = '/' // Redirect to home or keep on page but add query
      url.searchParams.set('auth_required', 'true')
      url.searchParams.set('redirect_to', path)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/college/:slug/fees',
    '/college/:slug/placement',
  ],
}
