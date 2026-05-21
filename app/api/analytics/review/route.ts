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
  let body: { rating?: number; comment?: string; reviewer_name?: string; reviewer_email?: string; source?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers })
  }

  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'rating must be 1-5' }, { status: 400, headers })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('portfolio_reviews').insert({
    rating: body.rating,
    comment: body.comment?.trim() || null,
    reviewer_name: body.reviewer_name?.trim() || null,
    reviewer_email: body.reviewer_email?.trim() || null,
    status: 'pending',
  })

  if (error) {
    console.error('[analytics/review]', error.message)
    return NextResponse.json({ error: 'DB error' }, { status: 500, headers })
  }

  return NextResponse.json({ ok: true }, { headers })
}
