'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'
import type { Mensaje } from '@/lib/types'

interface ChatWindowProps {
  initialMessages: Mensaje[]
  userId: string
  userName: string
}

export function ChatWindow({ initialMessages, userId: _userId, userName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Mensaje[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastCreatedAt = messages.at(-1)?.created_at

  const poll = useCallback(async () => {
    try {
      const since = lastCreatedAt ?? new Date(0).toISOString()
      const res = await fetch(`/api/portal/chat?since=${encodeURIComponent(since)}`)
      const { messages: newMsgs } = await res.json()
      if (newMsgs?.length) {
        setMessages(prev => {
          const existingIds = new Set(prev.map((m: Mensaje) => m.id))
          const toAdd = newMsgs.filter((m: Mensaje) => !existingIds.has(m.id))
          return toAdd.length ? [...prev, ...toAdd] : prev
        })
      }
    } catch { /* ignore */ }
  }, [lastCreatedAt])

  useEffect(() => {
    const id = setInterval(poll, 4000)
    return () => clearInterval(id)
  }, [poll])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    try {
      const res = await fetch('/api/portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: text }),
      })
      const { mensaje } = await res.json()
      if (mensaje) setMessages(prev => [...prev, mensaje])
    } finally {
      setSending(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{
      background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 12,
      display: 'flex', flexDirection: 'column', height: 520,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid #1e293b',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 16,
          background: 'linear-gradient(135deg, hsl(220 55% 35%), hsl(260 55% 50%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 12,
        }}>MM</div>
        <div>
          <div style={{ color: '#f8fafc', fontSize: 13, fontWeight: 600 }}>Mario Moreno</div>
          <div style={{ color: '#34d399', fontSize: 11 }}>● En línea</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ color: '#475569', textAlign: 'center', fontSize: 13, marginTop: 'auto', marginBottom: 'auto' }}>
            Inicia la conversación. Mario responderá a la brevedad.
          </div>
        )}
        {messages.map(m => {
          const isClient = m.remitente === 'cliente'
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: isClient ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%', padding: '10px 14px', borderRadius: isClient ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: isClient ? '#6366f1' : '#1e293b',
                color: '#f8fafc', fontSize: 13, lineHeight: 1.5,
              }}>
                {!isClient && (
                  <div style={{ color: '#a5b4fc', fontSize: 10, fontWeight: 600, marginBottom: 4 }}>Mario Moreno</div>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.contenido}</div>
                <div style={{ color: isClient ? '#c7d2fe' : '#64748b', fontSize: 10, marginTop: 4, textAlign: 'right' }}>
                  {new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', display: 'flex', gap: 10 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Escribe un mensaje... (Enter para enviar)"
          rows={1}
          style={{
            flex: 1, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
            color: '#f8fafc', padding: '9px 12px', fontSize: 13, outline: 'none', resize: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || sending}
          style={{
            background: input.trim() && !sending ? '#6366f1' : '#1e293b',
            color: '#fff', border: 'none', borderRadius: 8,
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() && !sending ? 'pointer' : 'not-allowed', flexShrink: 0,
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
