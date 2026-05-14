import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { contenido } = await req.json()
  if (!contenido?.trim()) return NextResponse.json({ error: 'Empty message' }, { status: 400 })

  const supabase = createAdminClient()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('mensajes')
    .insert({ user_id: user.id, canal: 'chat', remitente: 'cliente', contenido: contenido.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, mensaje: data })
}

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const since = req.nextUrl.searchParams.get('since')
  const supabase = createAdminClient()

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!user) return NextResponse.json({ messages: [] })

  let query = supabase
    .from('mensajes')
    .select('*')
    .eq('user_id', user.id)
    .eq('canal', 'chat')
    .order('created_at', { ascending: true })

  if (since) query = query.gt('created_at', since)

  const { data } = await query.limit(50)
  return NextResponse.json({ messages: data ?? [] })
}
