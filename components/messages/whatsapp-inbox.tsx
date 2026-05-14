'use client'

import { useState } from 'react'
import type { WhatsAppMessage, WhatsAppConversation } from '@/lib/types'
import { MessageSquare, Send, Phone } from 'lucide-react'

type Props = {
  conversations: WhatsAppConversation[]
  myNumber: string
}

export function WhatsAppInbox({ conversations, myNumber }: Props) {
  const [selected, setSelected] = useState<WhatsAppConversation | null>(
    conversations[0] ?? null
  )
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  async function send() {
    if (!text.trim() || !selected) return
    setSending(true)
    await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: selected.contact_number, message: text }),
    })
    setText('')
    setSending(false)
  }

  if (conversations.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#475569', fontSize: 13 }}>
        Sin mensajes de WhatsApp aún
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: 520, borderRadius: 10, overflow: 'hidden', border: '1px solid #1e293b' }}>
      {/* Contact list */}
      <div style={{ width: 220, borderRight: '1px solid #1e293b', background: '#0a0f1f', overflowY: 'auto', flexShrink: 0 }}>
        {conversations.map((c) => (
          <button
            key={c.contact_number}
            onClick={() => setSelected(c)}
            style={{
              width: '100%', textAlign: 'left', padding: '12px 14px',
              background: selected?.contact_number === c.contact_number ? 'rgba(99,102,241,0.12)' : 'transparent',
              borderBottom: '1px solid #1e293b', cursor: 'pointer', border: 'none',
              borderLeft: selected?.contact_number === c.contact_number ? '2px solid #6366f1' : '2px solid transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 12,
              }}>
                {(c.contact_name ?? c.contact_number).charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.contact_name ?? c.contact_number}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.messages[c.messages.length - 1]?.body ?? ''}
                </div>
              </div>
              {c.unread_count > 0 && (
                <span style={{
                  marginLeft: 'auto', background: '#6366f1', color: '#fff',
                  fontSize: 9, fontWeight: 700, borderRadius: 99, padding: '2px 6px', flexShrink: 0,
                }}>{c.unread_count}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
        {selected ? (
          <>
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Phone size={14} color="#64748b" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>
                {selected.contact_name ?? selected.contact_number}
              </span>
              <span style={{ fontSize: 11, color: '#475569' }}>{selected.contact_number}</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.messages.map((m) => (
                <MessageBubble key={m.id} msg={m} myNumber={myNumber} />
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid #1e293b', display: 'flex', gap: 8 }}>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Escribe un mensaje..."
                style={{
                  flex: 1, background: '#1e293b', border: '1px solid #334155',
                  borderRadius: 8, padding: '8px 12px', color: '#f8fafc', fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={sending || !text.trim()}
                style={{
                  background: sending || !text.trim() ? '#1e293b' : '#6366f1',
                  border: 'none', borderRadius: 8, padding: '8px 12px',
                  color: '#fff', cursor: sending || !text.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
            <MessageSquare size={32} />
          </div>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ msg, myNumber }: { msg: WhatsAppMessage; myNumber: string }) {
  const isMe = msg.direction === 'outbound' || msg.from_number === myNumber
  const time = new Date(msg.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '70%', padding: '8px 12px', borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
        background: isMe ? '#6366f1' : '#1e293b',
        color: '#f8fafc', fontSize: 13,
      }}>
        <p style={{ margin: 0 }}>{msg.body ?? '(no text)'}</p>
        <div style={{ fontSize: 10, color: isMe ? 'rgba(255,255,255,0.6)' : '#64748b', marginTop: 4, textAlign: 'right' }}>
          {time} · {msg.status}
        </div>
      </div>
    </div>
  )
}
