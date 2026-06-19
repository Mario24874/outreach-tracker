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

    // Observability: log every received event (field + counts) so webhook
    // delivery can be confirmed in the service logs.
    console.log(
      '[webhook] received',
      JSON.stringify(
        (body.entry ?? []).flatMap((e: any) =>
          (e.changes ?? []).map((c: any) => ({
            field: c.field,
            statuses: c.value?.statuses?.length ?? 0,
            messages: c.value?.messages?.length ?? 0,
          }))
        )
      )
    );

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'messages') continue;
        const value = change.value;

        // Detailed delivery/matching diagnostics
        for (const m of value.messages ?? [])
          console.log('[webhook] inbound from=', m.from, 'type=', m.type);
        for (const s of value.statuses ?? [])
          console.log('[webhook] status=', s.status, 'to=', s.recipient_id);

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
          // Meta sends `from` as digits only (no +). Match contacts tolerant of
          // formatting (+, spaces, dashes) by comparing the digit string.
          const digits = (phoneFrom ?? '').replace(/\D/g, '');

          // The WhatsApp business number is shared across all tenants, so an
          // inbound from this person may belong to any tenant that has them as
          // a contact. Deliver a copy to EACH matching contact (attributed to
          // that contact's owner) so no tenant misses a reply.
          const { data: candidates } = await supabase
            .from('contacts')
            .select('id, user_id, phone');
          const matches = (candidates ?? []).filter(
            (c: any) => (c.phone ?? '').replace(/\D/g, '') === digits
          );

          for (const contact of matches) {
            // Idempotency: skip if this message was already stored for this
            // contact (Meta can redeliver the same wamid).
            const { data: dup } = await supabase
              .from('wa_messages')
              .select('id')
              .eq('wamid', message.id)
              .eq('contact_id', contact.id)
              .maybeSingle();
            if (dup) continue;

            await supabase.from('wa_messages').insert({
              user_id: contact.user_id,
              contact_id: contact.id,
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
          // If no contact matched, skip (keep MVP simple — no unlinked rows).
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
