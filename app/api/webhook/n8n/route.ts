import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const incomingSecret = req.headers.get('x-n8n-secret')
  if (!incomingSecret || incomingSecret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[n8n→OutreachTracker]', {
    company: body.company,
    industry: body.industry,
    country: body.country,
    status: body.status,
    at: body.sent_at,
  })

  return NextResponse.json({ ok: true })
}
