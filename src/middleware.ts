import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is signed in and trying to access auth pages, redirect them based on role
  if (session && (req.nextUrl.pathname.startsWith('/auth') || req.nextUrl.pathname === '/')) {
    const role = session.user?.user_metadata?.role || 'staff'
    const dashboardPath = role === 'manager' ? '/dashboard/manager' : '/dashboard/staff'
    return NextResponse.redirect(new URL(dashboardPath, req.url))
  }

  // If user is not signed in and trying to access protected pages, redirect them to login
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}