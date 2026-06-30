import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { verifyWebhookSecret, clamp } from '@/lib/webhooks';

export const dynamic = 'force-dynamic';

/**
 * Recibe respuestas entrantes desde el flujo n8n "Outreach Gmail Reply Tracker".
 * Tolerante a la forma del payload (varios alias por campo).
 * SIEMPRE responde 200 para no romper el workflow; los errores se loguean.
 */
export async function POST(req: NextRequest) {
  if (!verifyWebhookSecret(req)) {
    console.warn('[webhook/email] invalid secret');
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true, skipped: 'invalid json' });
  }

  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = body[k];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  };

  const row = {
    direction: 'inbound_reply',
    from_email: clamp(get('from_email', 'from', 'email', 'sender'), 320),
    from_name: clamp(get('from_name', 'name', 'sender_name'), 200),
    subject: clamp(get('subject', 'title'), 500),
    body_preview: clamp(get('body_preview', 'snippet', 'body', 'text', 'message')),
    outreach_log_id: clamp(get('outreach_log_id', 'id', 'log_id'), 100),
  };

  try {
    const supabase = await createServiceClient();
    const { error } = await supabase.from('email_events').insert(row);
    if (error) {
      console.error('[webhook/email] insert', error.message);
      return NextResponse.json({ ok: false, error: 'db' });
    }
  } catch (err) {
    console.error('[webhook/email]', (err as Error).message);
    return NextResponse.json({ ok: false, error: 'server' });
  }

  return NextResponse.json({ ok: true });
}
