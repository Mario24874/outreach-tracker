import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { to, message } = await req.json() as { to: string; message: string }

  if (!to || !message) {
    return NextResponse.json({ error: 'to and message required' }, { status: 400 })
  }

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    return NextResponse.json({ error: 'WhatsApp not configured' }, { status: 503 })
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: message },
      }),
    }
  )

  const data = await res.json() as { messages?: { id: string }[]; error?: unknown }

  if (!res.ok) {
    return NextResponse.json({ error: data.error }, { status: res.status })
  }

  const wamid = data.messages?.[0]?.id
  const myNumber = process.env.WHATSAPP_PHONE_NUMBER ?? ''

  const supabase = await createClient()
  await supabase.from('whatsapp_messages').insert({
    id: wamid ?? crypto.randomUUID(),
    direction: 'outbound',
    from_number: myNumber,
    to_number: to,
    contact_name: null,
    message_type: 'text',
    body: message,
    wamid: wamid ?? null,
    status: 'sent',
    raw_payload: data as Record<string, unknown>,
  })

  return NextResponse.json({ ok: true, wamid })
}
