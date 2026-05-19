import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const YCLOUD_API = 'https://api.ycloud.com/v2/whatsapp/messages/sendDirectly'

export async function POST(req: NextRequest) {
  const { to, message } = await req.json() as { to: string; message: string }

  if (!to || !message) {
    return NextResponse.json({ error: 'to and message required' }, { status: 400 })
  }

  const apiKey = process.env.YCLOUD_API_KEY
  const from = process.env.YCLOUD_WHATSAPP_NUMBER

  if (!apiKey || !from) {
    return NextResponse.json({ error: 'WhatsApp not configured' }, { status: 503 })
  }

  const res = await fetch(YCLOUD_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ from, to, type: 'text', text: { body: message } }),
  })

  const data = await res.json() as { id?: string; status?: string; error?: unknown }

  if (!res.ok) {
    return NextResponse.json({ error: data.error }, { status: res.status })
  }

  const supabase = await createClient()
  await supabase.from('whatsapp_messages').insert({
    id: data.id ?? crypto.randomUUID(),
    direction: 'outbound',
    from_number: from,
    to_number: to,
    contact_name: null,
    message_type: 'text',
    body: message,
    wamid: data.id ?? null,
    status: data.status ?? 'sent',
    raw_payload: data as Record<string, unknown>,
  })

  return NextResponse.json({ ok: true, id: data.id })
}
