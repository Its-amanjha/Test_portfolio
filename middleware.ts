import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const CONSOLE_PATH = '/console'
const API_ADMIN_PATH = '/api/admin'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect console sub-routes and administrative API routes (both in dev and prod)
  if (pathname.startsWith(CONSOLE_PATH + '/') || pathname.startsWith(API_ADMIN_PATH)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token || !token?.email) {
      // Redirect unauthenticated console visits to the main login console
      if (pathname.startsWith(CONSOLE_PATH + '/')) {
        const url = req.nextUrl.clone()
        url.pathname = CONSOLE_PATH
        return NextResponse.redirect(url)
      }
      
      // Return 404 for unauthenticated API requests
      return new Response('Not Found', { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/console/:path*', '/api/admin/:path*']
}
