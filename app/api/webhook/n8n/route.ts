import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { verifyWebhookSecret, clamp } from '@/lib/webhooks';

export const dynamic = 'force-dynamic';

/**
 * Recibe notificaciones de los flujos de scraping de n8n (saas_webhook_url:
 * "Outreach Google Maps v4/VE1" → nodo "Notificar SaaS"). Registra cada evento
 * (lead scrapeado / email enviado / lote) en scrape_events para el embudo del admin.
 * Acepta un objeto o un array de eventos. SIEMPRE responde 200.
 */
export async function POST(req: NextRequest) {
  if (!verifyWebhookSecret(req)) {
    console.warn('[webhook/n8n] invalid secret');
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: true, skipped: 'invalid json' });
  }

  const items: Record<string, unknown>[] = Array.isArray(payload)
    ? (payload as Record<string, unknown>[])
    : [payload as Record<string, unknown>];

  const get = (b: Record<string, unknown>, ...keys: string[]) => {
    for (const k of keys) {
      const v = b?.[k];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  };

  const rows = items.map((b) => ({
    workflow: clamp(get(b, 'workflow', 'workflow_name', 'source'), 200),
    event: clamp(get(b, 'event', 'type', 'status'), 100),
    query: clamp(get(b, 'query', 'search', 'keyword'), 500),
    business_name: clamp(get(b, 'business_name', 'name', 'company'), 300),
    email: clamp(get(b, 'email', 'to', 'lead_email'), 320),
    payload: b ?? {},
  }));

  try {
    const supabase = await createServiceClient();
    const { error } = await supabase.from('scrape_events').insert(rows);
    if (error) {
      console.error('[webhook/n8n] insert', error.message);
      return NextResponse.json({ ok: false, error: 'db' });
    }
  } catch (err) {
    console.error('[webhook/n8n]', (err as Error).message);
    return NextResponse.json({ ok: false, error: 'server' });
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
