import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { corsHeaders, clamp } from '@/lib/webhooks';

export const dynamic = 'force-dynamic';

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/** Registra que un visitante probó un demo/agente de IA del portfolio. */
export async function POST(req: NextRequest) {
  const cors = corsHeaders(req);
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400, headers: cors });
  }

  const demo = clamp(body.demo, 60);
  if (!demo) {
    return NextResponse.json({ error: 'demo required' }, { status: 400, headers: cors });
  }

  try {
    const supabase = await createServiceClient();
    await supabase.from('demo_runs').insert({
      anon_id: clamp(body.anon_id, 64),
      demo,
      input_preview: clamp(body.input_preview, 280),
    });
    return NextResponse.json({ ok: true }, { headers: cors });
  } catch (err) {
    console.error('[analytics/demo]', (err as Error).message);
    return NextResponse.json({ error: 'server' }, { status: 500, headers: cors });
  }
}
