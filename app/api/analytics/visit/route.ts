import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ALLOWED_ORIGINS = [
  'https://mariomoreno.work',
  'https://italianto.com',
]

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') ?? ''
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(req) })
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req)
  let body: { session_id?: string; page?: string; referrer?: string; source?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers })
  }

  if (!body.session_id) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400, headers })
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
    return NextResponse.json({ error: 'DB error' }, { status: 500, headers })
  }

  return NextResponse.json({ ok: true }, { headers })
}
