import { getPortalUser } from '@/lib/portal-user'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { ChatWindow } from '@/components/portal-chat'
import type { Mensaje } from '@/lib/types'

export default async function ChatPage() {
  const user = await getPortalUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()
  const { data: mensajes } = await supabase
    .from('mensajes')
    .select('*')
    .eq('user_id', user.id)
    .eq('canal', 'chat')
    .order('created_at', { ascending: true })
    .limit(100)

  // Mark admin messages as read
  await supabase
    .from('mensajes')
    .update({ leido: true })
    .eq('user_id', user.id)
    .eq('canal', 'chat')
    .eq('remitente', 'admin')
    .eq('leido', false)

  return (
    <div style={{ padding: '32px 24px', maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: '#f8fafc', fontSize: 20, fontWeight: 700, margin: 0 }}>Chat en vivo</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Conversación directa con Mario Moreno</p>
      </div>
      <ChatWindow
        initialMessages={(mensajes ?? []) as Mensaje[]}
        userId={user.id}
        userName={user.full_name ?? user.email}
      />
    </div>
  )
}
