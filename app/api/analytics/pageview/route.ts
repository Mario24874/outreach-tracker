import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { corsHeaders, clamp } from '@/lib/webhooks';

export const dynamic = 'force-dynamic';

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/** Registra una visita anónima. Devuelve el id para luego enviar la duración. */
export async function POST(req: NextRequest) {
  const cors = corsHeaders(req);
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400, headers: cors });
  }

  const anon_id = clamp(body.anon_id, 64);
  const path = clamp(body.path, 512);
  if (!anon_id || !path) {
    return NextResponse.json({ error: 'anon_id and path required' }, { status: 400, headers: cors });
  }
  if (path.startsWith('/admin')) {
    return NextResponse.json({ ok: true, skipped: true }, { headers: cors });
  }

  const area = body.area === 'app' ? 'app' : 'portfolio';
  const row = {
    anon_id,
    area,
    path,
    section: clamp(body.section, 120),
    referrer: clamp(body.referrer, 512),
    user_agent: req.headers.get('user-agent')?.slice(0, 512) ?? null,
    country: req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || null,
  };

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from('page_views').insert(row).select('id').single();
    if (error) {
      console.error('[analytics/pageview] insert', error.message);
      return NextResponse.json({ error: 'db' }, { status: 500, headers: cors });
    }
    return NextResponse.json({ id: data.id }, { headers: cors });
  } catch (err) {
    console.error('[analytics/pageview]', (err as Error).message);
    return NextResponse.json({ error: 'server' }, { status: 500, headers: cors });
  }
}

/** Actualiza la duración (segundos) de una visita al salir de la página. */
export async function PATCH(req: NextRequest) {
  const cors = corsHeaders(req);
  let body: { id?: string; duration?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400, headers: cors });
  }
  const { id, duration } = body;
  if (!id || typeof duration !== 'number' || duration < 0 || duration > 86400) {
    return NextResponse.json({ error: 'id and valid duration required' }, { status: 400, headers: cors });
  }
  try {
    const supabase = await createServiceClient();
    await supabase.from('page_views').update({ duration_seconds: Math.round(duration) }).eq('id', id);
    return NextResponse.json({ ok: true }, { headers: cors });
  } catch (err) {
    console.error('[analytics/pageview] patch', (err as Error).message);
    return NextResponse.json({ error: 'server' }, { status: 500, headers: cors });
  }
}
