import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'marioivanmorenopineda@gmail.com').split(',')

const isPublic = createRouteMatcher([
  '/',
  '/login(.*)',
  '/unauthorized(.*)',
  '/api/webhooks(.*)',
  '/api/webhook(.*)',
])

export const proxy = clerkMiddleware(async (auth, request) => {
  if (isPublic(request)) return

  const { userId } = await auth.protect()
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress ?? ''
  const isAdmin = ADMIN_EMAILS.includes(email)
  const { pathname } = request.nextUrl

  if (isAdmin) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (pathname.startsWith('/portal')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return
  }

  // Client: only /portal/* allowed
  if (!pathname.startsWith('/portal')) {
    return NextResponse.redirect(new URL('/portal', request.url))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
