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
  let body: { rating?: number; comment?: string; reviewer_name?: string; reviewer_email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS_HEADERS })
  }

  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'rating must be 1-5' }, { status: 400, headers: CORS_HEADERS })
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
    return NextResponse.json({ error: 'DB error' }, { status: 500, headers: CORS_HEADERS })
  }

  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
}
