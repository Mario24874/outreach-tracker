import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { phone } = await req.json() as { phone: string }
  const normalized = phone?.trim().replace(/\s+/g, '')

  if (!normalized || !/^\+?\d{7,15}$/.test(normalized)) {
    return NextResponse.json({ error: 'Número inválido. Usa formato internacional, ej: +584141234567' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('users')
    .update({ phone: normalized })
    .eq('clerk_user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
