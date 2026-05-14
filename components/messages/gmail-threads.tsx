'use client'

import { useState } from 'react'
import type { GmailThread, GmailMessage } from '@/lib/types'
import { Mail, ArrowLeft, Reply } from 'lucide-react'

type Props = {
  threads: GmailThread[]
}

export function GmailThreads({ threads }: Props) {
  const [selected, setSelected] = useState<GmailThread | null>(null)

  if (threads.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12, color: '#475569' }}>
        <Mail size={32} />
        <p style={{ margin: 0, fontSize: 13 }}>
          Sin hilos de Gmail.{' '}
          <a href="/api/auth/gmail" style={{ color: '#a5b4fc', textDecoration: 'none' }}>
            Conecta tu cuenta →
          </a>
        </p>
      </div>
    )
  }

  if (selected) {
    return <ThreadDetail thread={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {threads.map((t) => (
        <button
          key={t.id}
          onClick={() => setSelected(t)}
          style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
            background: 'transparent', border: 'none', borderBottom: '1px solid #1e293b',
            cursor: 'pointer', textAlign: 'left', width: '100%',
          }}
        >
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: 18, flexShrink: 0,
            background: t.has_reply ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.12)',
            border: t.has_reply ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(99,102,241,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {t.has_reply
              ? <Reply size={14} color="#22c55e" />
              : <Mail size={14} color="#a5b4fc" />
            }
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.prospect_name ?? t.prospect_email}
              </span>
              <span style={{ fontSize: 10, color: '#475569', flexShrink: 0 }}>
                {new Date(t.last_message_at).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
              {t.subject}
            </div>
            <div style={{ fontSize: 11, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
              {t.snippet}
            </div>
          </div>

          {/* Reply badge */}
          {t.has_reply && (
            <span style={{
              fontSize: 9, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.12)',
              padding: '2px 7px', borderRadius: 99, flexShrink: 0,
              boxShadow: 'inset 0 0 0 1px rgba(34,197,94,0.3)',
            }}>
              RESPONDIÓ
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

function ThreadDetail({ thread, onBack }: { thread: GmailThread; onBack: () => void }) {
  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
          background: 'transparent', border: 'none', borderBottom: '1px solid #1e293b',
          color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 500, width: '100%', textAlign: 'left',
        }}
      >
        <ArrowLeft size={14} /> Volver
      </button>

      {/* Thread header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b' }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>{thread.subject}</h4>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>{thread.prospect_email}</p>
      </div>

      {/* Messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 440, overflowY: 'auto' }}>
        {thread.messages.map((m) => (
          <EmailMessage key={m.id} msg={m} />
        ))}
      </div>
    </div>
  )
}

function EmailMessage({ msg }: { msg: GmailMessage }) {
  const [expanded, setExpanded] = useState(msg.direction === 'received')
  const isMe = msg.direction === 'sent'

  return (
    <div style={{ borderBottom: '1px solid #1e293b' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', width: '100%', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: isMe ? 'rgba(99,102,241,0.15)' : 'rgba(34,197,94,0.12)',
            border: isMe ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(34,197,94,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isMe ? '#a5b4fc' : '#22c55e', fontWeight: 700, fontSize: 10, flexShrink: 0,
          }}>
            {isMe ? 'YO' : (msg.from.charAt(0).toUpperCase())}
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#f8fafc' }}>
              {isMe ? 'Tú' : msg.from.split('<')[0].trim() || msg.from}
            </span>
            {!expanded && (
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>{msg.snippet}</span>
            )}
          </div>
        </div>
        <span style={{ fontSize: 10, color: '#475569', flexShrink: 0 }}>
          {new Date(msg.date).toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px 54px' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {msg.body
              ? msg.body.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
              : msg.snippet}
          </div>
        </div>
      )}
    </div>
  )
}
