'use client'

import { useRef, useState } from 'react'
import { X, Paperclip, Send, CheckCircle, AlertCircle } from 'lucide-react'

const MAX_MB = 25
const MAX_BYTES = MAX_MB * 1024 * 1024

type Status = 'idle' | 'sending' | 'success' | 'error'

export function PortalEmailModal() {
  const [open, setOpen]       = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody]       = useState('')
  const [cc, setCc]           = useState('')
  const [files, setFiles]     = useState<File[]>([])
  const [status, setStatus]   = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function totalSize() { return files.reduce((s, f) => s + f.size, 0) }

  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const next = [...files, ...Array.from(incoming)]
    if (next.reduce((s, f) => s + f.size, 0) > MAX_BYTES) {
      setErrorMsg(`Los archivos superan el límite de ${MAX_MB} MB`)
      return
    }
    setFiles(next)
    setErrorMsg('')
  }

  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  function reset() {
    setSubject(''); setBody(''); setCc(''); setFiles([])
    setStatus('idle'); setErrorMsg('')
  }

  function close() { setOpen(false); setTimeout(reset, 300) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return
    setStatus('sending')
    setErrorMsg('')

    const form = new FormData()
    form.set('subject', subject)
    form.set('body', body)
    form.set('cc', cc)
    files.forEach(f => form.append('files', f))

    try {
      const res = await fetch('/api/portal/email', { method: 'POST', body: form })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok) { setStatus('error'); setErrorMsg(data.error ?? 'Error al enviar'); return }
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Error de conexión. Inténtalo de nuevo.')
    }
  }

  const sending = status === 'sending'
  const totalMB = (totalSize() / (1024 * 1024)).toFixed(1)

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'block', width: '100%', marginTop: 12,
          background: '#6366f11a', border: '1px solid #6366f130',
          borderRadius: 8, padding: '10px 14px', color: '#a5b4fc',
          fontSize: 13, fontWeight: 600, textAlign: 'left', cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#6366f130')}
        onMouseLeave={e => (e.currentTarget.style.background = '#6366f11a')}
      >
        ✉️ Redactar correo a info@mariomoreno.work
      </button>

      {/* Overlay */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <div style={{
            background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 14,
            width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}>

            {/* Header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid #1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: '#6366f11a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 15 }}>Nuevo correo</span>
              </div>
              <button onClick={close} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {status === 'success' ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <CheckCircle size={48} color="#34d399" style={{ margin: '0 auto 16px' }} />
                <div style={{ color: '#f8fafc', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>¡Correo enviado!</div>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>
                  Mario recibirá tu mensaje en info@mariomoreno.work y te responderá a tu correo.
                </div>
                <button onClick={close} style={{
                  background: '#6366f1', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer',
                }}>
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* To — read only */}
                <Field label="Para">
                  <div style={{
                    background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
                    padding: '9px 12px', color: '#64748b', fontSize: 13,
                  }}>
                    info@mariomoreno.work
                  </div>
                </Field>

                {/* Subject */}
                <Field label="Asunto *">
                  <input
                    value={subject} onChange={e => setSubject(e.target.value)}
                    placeholder="Escribe el asunto"
                    required disabled={sending}
                    style={inputStyle}
                  />
                </Field>

                {/* CC */}
                <Field label="CC (opcional)">
                  <input
                    value={cc} onChange={e => setCc(e.target.value)}
                    placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
                    disabled={sending}
                    style={inputStyle}
                  />
                </Field>

                {/* Body */}
                <Field label="Mensaje *">
                  <textarea
                    value={body} onChange={e => setBody(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    required rows={6} disabled={sending}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </Field>

                {/* Attachments */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>
                      Adjuntos {files.length > 0 && `(${files.length} · ${totalMB} MB / ${MAX_MB} MB)`}
                    </span>
                    <button
                      type="button" onClick={() => fileRef.current?.click()} disabled={sending}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: '#1e293b', border: '1px solid #334155',
                        borderRadius: 6, padding: '5px 10px', color: '#94a3b8',
                        fontSize: 12, cursor: 'pointer',
                      }}
                    >
                      <Paperclip size={13} /> Adjuntar archivo
                    </button>
                  </div>
                  <input
                    ref={fileRef} type="file" multiple hidden
                    onChange={e => addFiles(e.target.files)}
                    accept="*/*"
                  />
                  {files.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {files.map((f, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: '#0f172a', border: '1px solid #1e293b',
                          borderRadius: 6, padding: '6px 10px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            <Paperclip size={13} color="#64748b" style={{ flexShrink: 0 }} />
                            <span style={{ color: '#94a3b8', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {f.name}
                            </span>
                            <span style={{ color: '#475569', fontSize: 11, flexShrink: 0 }}>
                              {(f.size / 1024).toFixed(0)} KB
                            </span>
                          </div>
                          <button
                            type="button" onClick={() => removeFile(i)} disabled={sending}
                            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 2, flexShrink: 0 }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error */}
                {(status === 'error' || errorMsg) && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#dc26261a', border: '1px solid #dc262630',
                    borderRadius: 8, padding: '10px 14px',
                  }}>
                    <AlertCircle size={15} color="#f87171" />
                    <span style={{ color: '#f87171', fontSize: 13 }}>{errorMsg || 'Error al enviar el correo.'}</span>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                  <button type="button" onClick={close} disabled={sending} style={cancelBtnStyle}>
                    Cancelar
                  </button>
                  <button
                    type="submit" disabled={sending || !subject.trim() || !body.trim()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: sending || !subject.trim() || !body.trim() ? '#334155' : '#6366f1',
                      color: '#fff', border: 'none', borderRadius: 8,
                      padding: '10px 20px', fontWeight: 600, fontSize: 13,
                      cursor: sending || !subject.trim() || !body.trim() ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <Send size={14} />
                    {sending ? 'Enviando...' : 'Enviar correo'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#0f172a', border: '1px solid #1e293b',
  borderRadius: 8, padding: '9px 12px', color: '#f8fafc',
  fontSize: 13, outline: 'none', boxSizing: 'border-box',
}

const cancelBtnStyle: React.CSSProperties = {
  background: 'transparent', border: '1px solid #334155', borderRadius: 8,
  color: '#94a3b8', padding: '10px 18px', fontWeight: 500,
  fontSize: 13, cursor: 'pointer',
}
