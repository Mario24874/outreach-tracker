import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://mariomoreno.work',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  let body: { session_id?: string; page?: string; referrer?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS_HEADERS })
  }

  if (!body.session_id) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400, headers: CORS_HEADERS })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('portfolio_visits').insert({
    session_id: body.session_id,
    page: body.page ?? 'home',
    referrer: body.referrer ?? null,
    user_agent: req.headers.get('user-agent') ?? null,
  })

  if (error) {
    console.error('[analytics/visit]', error.message)
    return NextResponse.json({ error: 'DB error' }, { status: 500, headers: CORS_HEADERS })
  }

  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
}
