import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHmac, timingSafeEqual } from 'crypto'

// YCloud signature: "t=<timestamp>,s=<hmac_sha256>"
// Signed payload: "<timestamp>.<raw_body>"
function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.YCLOUD_WEBHOOK_SECRET
  if (!secret || !header) return false

  try {
    const parts = Object.fromEntries(
      header.split(',').map((p) => p.split('=') as [string, string])
    )
    const { t, s } = parts
    if (!t || !s) return false

    const computed = createHmac('sha256', secret)
      .update(`${t}.${rawBody}`)
      .digest('hex')

    return timingSafeEqual(Buffer.from(computed), Buffer.from(s))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!verifySignature(rawBody, req.headers.get('ycloud-signature'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody) as Record<string, unknown>
  const supabase = await createClient()

  if (event.type === 'whatsapp.inbound_message.received') {
    const msg = event.whatsappInboundMessage as Record<string, unknown>
    const textObj = msg.text as Record<string, unknown> | undefined
    const profile = msg.customerProfile as Record<string, unknown> | undefined

    await supabase.from('whatsapp_messages').upsert({
      id: msg.id as string,
      direction: 'inbound',
      from_number: msg.from as string,
      to_number: msg.to as string,
      contact_name: (profile?.name as string) ?? null,
      message_type: (msg.type as string) ?? 'text',
      body: (textObj?.body as string) ?? null,
      wamid: msg.id as string,
      status: 'received',
      raw_payload: msg,
    })
  }

  if (event.type === 'whatsapp.message.updated') {
    const msg = event.whatsappMessage as Record<string, unknown>
    await supabase
      .from('whatsapp_messages')
      .update({ status: msg.status as string })
      .eq('wamid', msg.id as string)
  }

  return NextResponse.json({ ok: true })
}
