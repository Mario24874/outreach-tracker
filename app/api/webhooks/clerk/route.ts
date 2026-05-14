import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import type { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'No webhook secret configured' }, { status: 500 })
  }

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await req.text()
  const wh = new Webhook(secret)

  let event: WebhookEvent
  try {
    event = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('[Clerk webhook]', event.type, (event.data as { id?: string }).id)

  return NextResponse.json({ ok: true })
}
