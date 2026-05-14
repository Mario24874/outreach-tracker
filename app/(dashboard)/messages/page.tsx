import { createClient } from '@/lib/supabase/server'
import { getGmailThreads } from '@/lib/gmail'
import { WhatsAppInbox } from '@/components/messages/whatsapp-inbox'
import { GmailThreads } from '@/components/messages/gmail-threads'
import { MessageSquare, Mail } from 'lucide-react'
import type { WhatsAppMessage, WhatsAppConversation } from '@/lib/types'

async function getWhatsAppConversations(): Promise<WhatsAppConversation[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('whatsapp_messages')
    .select('*')
    .order('created_at', { ascending: true })

  const messages = (data ?? []) as WhatsAppMessage[]

  // Group by contact
  const byContact: Record<string, WhatsAppMessage[]> = {}
  for (const m of messages) {
    const contact = m.direction === 'inbound' ? m.from_number : m.to_number
    if (!byContact[contact]) byContact[contact] = []
    byContact[contact].push(m)
  }

  return Object.entries(byContact)
    .map(([contact_number, msgs]) => {
      const inbound = msgs.filter(m => m.direction === 'inbound')
      const last = msgs[msgs.length - 1]
      return {
        contact_number,
        contact_name: msgs.find(m => m.contact_name)?.contact_name ?? null,
        messages: msgs,
        last_message_at: last?.created_at ?? new Date().toISOString(),
        unread_count: inbound.filter(m => m.status === 'received').length,
      }
    })
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
}

export default async function MessagesPage() {
  const [conversations, gmailThreads] = await Promise.all([
    getWhatsAppConversations(),
    getGmailThreads(),
  ])

  const myNumber = process.env.WHATSAPP_PHONE_NUMBER ?? '+584126504208'
  const gmailConfigured = !!process.env.GOOGLE_REFRESH_TOKEN

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div style={{ paddingBottom: 24, borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: '#f8fafc' }}>
          Mensajes
        </h1>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
          WhatsApp + Gmail · comunicaciones con prospectos
        </div>
      </div>

      {/* WhatsApp section */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MessageSquare size={16} color="#22c55e" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>WhatsApp</h3>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
              {process.env.WHATSAPP_PHONE_NUMBER_ID
                ? `${myNumber} · API conectada`
                : 'Pendiente — configura WHATSAPP_PHONE_NUMBER_ID y WHATSAPP_ACCESS_TOKEN'}
            </p>
          </div>
          {!process.env.WHATSAPP_PHONE_NUMBER_ID && (
            <span style={{
              marginLeft: 'auto', fontSize: 10, color: '#f59e0b', fontWeight: 600,
              background: 'rgba(245,158,11,0.12)', padding: '3px 8px', borderRadius: 99,
              border: '1px solid rgba(245,158,11,0.3)',
            }}>PENDIENTE META</span>
          )}
        </div>
        <WhatsAppInbox conversations={conversations} myNumber={myNumber} />
      </div>

      {/* Gmail section */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mail size={16} color="#a5b4fc" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>Gmail</h3>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>
              {gmailConfigured ? 'Hilos de outreach y respuestas' : 'Cuenta no conectada'}
            </p>
          </div>
          {!gmailConfigured && (
            <a
              href="/api/auth/gmail"
              style={{
                marginLeft: 'auto', fontSize: 11, color: '#a5b4fc', fontWeight: 600,
                background: 'rgba(99,102,241,0.12)', padding: '5px 12px', borderRadius: 8,
                border: '1px solid rgba(99,102,241,0.25)', textDecoration: 'none',
              }}
            >
              Conectar Gmail →
            </a>
          )}
        </div>
        <GmailThreads threads={gmailThreads} />
      </div>
    </div>
  )
}
