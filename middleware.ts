import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'marioivanmorenopineda@gmail.com').split(',')

const isPublic = createRouteMatcher([
  '/login(.*)',
  '/unauthorized(.*)',
  '/api/webhooks(.*)',
  '/api/webhook(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublic(request)) {
    const { userId } = await auth.protect()
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress ?? ''
    if (!ADMIN_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
