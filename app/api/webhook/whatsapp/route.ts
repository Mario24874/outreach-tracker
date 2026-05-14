import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — Meta webhook verification
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// POST — receive inbound messages
export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>

  if (body.object !== 'whatsapp_business_account') {
    return NextResponse.json({ status: 'ignored' })
  }

  const supabase = await createClient()

  const entries = (body.entry as Record<string, unknown>[]) ?? []
  for (const entry of entries) {
    const changes = (entry.changes as Record<string, unknown>[]) ?? []
    for (const change of changes) {
      if (change.field !== 'messages') continue
      const value = change.value as Record<string, unknown>
      const messages = (value.messages as Record<string, unknown>[]) ?? []
      const contacts = (value.contacts as Record<string, unknown>[]) ?? []
      const metadata = value.metadata as Record<string, unknown>

      for (const msg of messages) {
        const contactName = contacts.find(
          (c) => (c as Record<string,unknown>).wa_id === msg.from
        ) as Record<string, unknown> | undefined
        const name = (contactName?.profile as Record<string,unknown>)?.name as string | undefined

        const textBody = msg.type === 'text'
          ? ((msg.text as Record<string,unknown>)?.body as string)
          : null

        await supabase.from('whatsapp_messages').upsert({
          id: msg.id as string,
          direction: 'inbound',
          from_number: msg.from as string,
          to_number: metadata?.display_phone_number as string ?? '',
          contact_name: name ?? null,
          message_type: msg.type as string ?? 'text',
          body: textBody,
          wamid: msg.id as string,
          status: 'received',
          raw_payload: msg as Record<string, unknown>,
        })
      }

      // Mark status updates (delivered, read, failed)
      const statuses = (value.statuses as Record<string, unknown>[]) ?? []
      for (const st of statuses) {
        await supabase
          .from('whatsapp_messages')
          .update({ status: st.status as string })
          .eq('wamid', st.id as string)
      }
    }
  }

  return NextResponse.json({ status: 'ok' })
}
