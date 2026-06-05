import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Uses service role key — no user session needed
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: Meta sends this to verify the webhook during setup
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// POST: Meta sends message events here
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceClient();

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'messages') continue;
        const value = change.value;

        // Status updates (sent → delivered → read)
        for (const status of value.statuses ?? []) {
          await supabase
            .from('wa_messages')
            .update({
              status: status.status,
              updated_at: new Date().toISOString(),
              ...(status.errors?.[0] && {
                error_code: status.errors[0].code?.toString(),
                error_message: status.errors[0].title,
              }),
            })
            .eq('wamid', status.id);
        }

        // Inbound messages
        for (const message of value.messages ?? []) {
          const phoneFrom = message.from;

          // Find existing contact by phone
          const { data: existingContact } = await supabase
            .from('contacts')
            .select('id, user_id')
            .eq('phone', phoneFrom)
            .maybeSingle();

          if (existingContact) {
            await supabase.from('wa_messages').insert({
              user_id: existingContact.user_id,
              contact_id: existingContact.id,
              wamid: message.id,
              direction: 'inbound',
              type: message.type ?? 'text',
              body: message.text?.body ?? message.caption ?? '[media]',
              phone_from: phoneFrom,
              phone_to: value.metadata?.display_phone_number,
              status: 'delivered',
              meta_timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
            });
          }
          // If no contact found, skip (could create an unlinked contact but keep it simple for MVP)
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('[webhook]', err);
    // Always return 200 to Meta (otherwise it retries)
    return NextResponse.json({ status: 'ok' });
  }
}
