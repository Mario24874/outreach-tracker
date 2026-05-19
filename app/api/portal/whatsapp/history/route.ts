import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data: user } = await supabase
    .from('users')
    .select('phone')
    .eq('clerk_user_id', userId)
    .single()

  if (!user?.phone) return NextResponse.json({ messages: [], hasPhone: false })

  const phone = user.phone
  const { data: messages } = await supabase
    .from('whatsapp_messages')
    .select('id, direction, from_number, to_number, body, status, created_at')
    .or(`from_number.eq.${phone},to_number.eq.${phone}`)
    .order('created_at', { ascending: true })
    .limit(100)

  return NextResponse.json({ messages: messages ?? [], hasPhone: true, phone })
}
