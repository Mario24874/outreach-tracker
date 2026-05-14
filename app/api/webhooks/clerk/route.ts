import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import type { WebhookEvent } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'No webhook secret' }, { status: 500 })

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await req.text()
  let event: WebhookEvent
  try {
    event = new Webhook(secret).verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = event.data
    const email = email_addresses[0]?.email_address ?? ''
    const full_name = [first_name, last_name].filter(Boolean).join(' ') || null
    await supabase.from('users').upsert(
      { clerk_user_id: id, email, full_name, role: 'client', status: 'active' },
      { onConflict: 'clerk_user_id' }
    )
  }

  if (event.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = event.data
    const email = email_addresses[0]?.email_address ?? ''
    const full_name = [first_name, last_name].filter(Boolean).join(' ') || null
    await supabase.from('users')
      .update({ email, full_name, updated_at: new Date().toISOString() })
      .eq('clerk_user_id', id)
  }

  if (event.type === 'user.deleted' && event.data.id) {
    await supabase.from('users')
      .update({ status: 'inactive' })
      .eq('clerk_user_id', event.data.id)
  }

  return NextResponse.json({ ok: true })
}
