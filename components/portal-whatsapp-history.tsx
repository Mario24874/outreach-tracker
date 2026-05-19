'use client'

import { useEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'

const MARIO_NUMBER = '+584126504208'
const WA_LINK = `https://wa.me/${MARIO_NUMBER.replace('+', '')}`

type WaMessage = {
  id: string
  direction: 'inbound' | 'outbound'
  body: string | null
  status: string
  created_at: string
}

type ApiResponse = {
  messages: WaMessage[]
  hasPhone: boolean
  phone?: string
}

export function PortalWhatsappHistory() {
  const [data, setData]       = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [saveError, setSaveError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/portal/whatsapp/history')
      const json = await res.json() as ApiResponse
      setData(json)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (data?.messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [data])

  async function savePhone() {
    if (!phone.trim()) return
    setSaving(true)
    setSaveError('')
    const res = await fetch('/api/portal/profile/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.trim() }),
    })
    const json = await res.json() as { ok?: boolean; error?: string }
    if (!res.ok) { setSaveError(json.error ?? 'Error al guardar'); setSaving(false); return }
    await load()
    setSaving(false)
  }

  // ── No phone registered ──────────────────────────────────────────────────
  if (!loading && data && !data.hasPhone) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          Para ver el historial de conversación de WhatsApp, registra tu número de WhatsApp.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+584141234567"
            style={{
              flex: 1, background: '#0f172a', border: '1px solid #1e293b',
              borderRadius: 8, padding: '9px 12px', color: '#f8fafc', fontSize: 13, outline: 'none',
            }}
          />
          <button
            onClick={savePhone} disabled={saving || !phone.trim()}
            style={{
              background: saving ? '#334155' : '#25d366', color: '#fff',
              border: 'none', borderRadius: 8, padding: '9px 16px',
              fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', flexShrink: 0,
            }}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
        {saveError && <p style={{ color: '#f87171', fontSize: 12, margin: 0 }}>{saveError}</p>}
        <a
          href={WA_LINK} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#25d3661a', border: '1px solid #25d36630',
            borderRadius: 8, padding: '10px 14px', color: '#34d399',
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Escribir a Mario por WhatsApp
        </a>
      </div>
    )
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: 24, height: 24, border: '2px solid #25d366', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  // ── Has phone → show history ─────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#64748b', fontSize: 12 }}>
          Número: <strong style={{ color: '#94a3b8' }}>{data.phone}</strong>
        </span>
        <button
          onClick={load}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
        >
          <RefreshCw size={13} /> Actualizar
        </button>
      </div>

      {/* Chat window */}
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
        height: 320, overflowY: 'auto', padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {data.messages.length === 0 ? (
          <div style={{ color: '#475569', fontSize: 13, textAlign: 'center', margin: 'auto' }}>
            Sin mensajes aún. Las conversaciones de WhatsApp aparecerán aquí.
          </div>
        ) : data.messages.map(m => {
          // outbound = Mario sent to client, inbound = client replied
          const isMario = m.direction === 'outbound'
          const time = new Date(m.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: isMario ? 'flex-start' : 'flex-end' }}>
              <div style={{
                maxWidth: '75%', padding: '8px 12px',
                borderRadius: isMario ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                background: isMario ? '#1e293b' : '#25d36620',
                border: isMario ? '1px solid #334155' : '1px solid #25d36640',
              }}>
                {isMario && (
                  <div style={{ color: '#25d366', fontSize: 10, fontWeight: 600, marginBottom: 3 }}>Mario Moreno</div>
                )}
                <div style={{ color: '#f8fafc', fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {m.body ?? '(sin texto)'}
                </div>
                <div style={{ color: '#64748b', fontSize: 10, marginTop: 4, textAlign: 'right' }}>
                  {time} {isMario && `· ${m.status}`}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Open WhatsApp */}
      <a
        href={WA_LINK} target="_blank" rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: '#25d3661a', border: '1px solid #25d36630',
          borderRadius: 8, padding: '10px 14px', color: '#34d399',
          fontSize: 13, fontWeight: 600, textDecoration: 'none',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Abrir WhatsApp para responder
      </a>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
