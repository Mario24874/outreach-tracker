'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Contact { id: string; name: string; phone: string; }
interface Template { id: string; meta_template_name: string; language: string; status: string; components: any; }

export default function SendMessageForm({
  contacts,
  templates,
  defaultContactId,
}: {
  contacts: Contact[];
  templates: Template[];
  defaultContactId?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<'text' | 'template'>('text');
  const [contactId, setContactId] = useState(defaultContactId ?? '');
  const [customPhone, setCustomPhone] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [body, setBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [params, setParams] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const template = templates.find((t) => t.meta_template_name === selectedTemplate);

  function extractParams(components: any): number {
    if (!components) return 0;
    const body = components.find((c: any) => c.type === 'BODY');
    if (!body?.text) return 0;
    const matches = body.text.match(/\{\{\d+\}\}/g);
    return matches ? Math.max(...matches.map((m: string) => parseInt(m.replace(/[{}]/g, '')))) : 0;
  }

  function onTemplateChange(name: string) {
    setSelectedTemplate(name);
    const tpl = templates.find((t) => t.meta_template_name === name);
    const count = tpl ? extractParams(tpl.components) : 0;
    setParams(Array(count).fill(''));
  }

  const recipientPhone = useCustom ? customPhone : (contacts.find((c) => c.id === contactId)?.phone ?? '');

  async function handleSend() {
    if (!recipientPhone) { alert('Select a contact or enter a phone number'); return; }
    setSending(true);
    setResult(null);

    const payload =
      mode === 'text'
        ? { to: recipientPhone, message: body, contactId: !useCustom ? contactId : undefined }
        : { to: recipientPhone, templateName: selectedTemplate, languageCode: template?.language ?? 'es', bodyParams: params, contactId: !useCustom ? contactId : undefined };

    const endpoint = mode === 'text' ? '/api/whatsapp/send' : '/api/whatsapp/send';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      setResult({ success: true, message: `Message sent! WAMID: ${data.wamid}` });
      setTimeout(() => router.push('/dashboard/whatsapp'), 1500);
    } else {
      setResult({ success: false, message: data.error ?? 'Failed to send message' });
    }
    setSending(false);
  }

  const fieldStyle = {
    width: '100%', background: '#020617', border: '1px solid #1e293b',
    borderRadius: 8, padding: '10px 12px', color: '#f8fafc',
    fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '28px' }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, padding: 4, background: '#020617', borderRadius: 10 }}>
        {(['text', 'template'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1, padding: '8px', borderRadius: 7, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: mode === m ? '#6366f1' : 'transparent',
              color: mode === m ? '#fff' : '#94a3b8',
            }}
          >
            {m === 'text' ? '✏️ Text message' : '📋 Template message'}
          </button>
        ))}
      </div>

      {/* Recipient */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Recipient</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button onClick={() => setUseCustom(false)} style={{ ...toggleBtn, background: !useCustom ? 'rgba(99,102,241,0.15)' : 'transparent', color: !useCustom ? '#a5b4fc' : '#64748b', border: !useCustom ? '1px solid rgba(99,102,241,0.3)' : '1px solid #1e293b' }}>Contact</button>
          <button onClick={() => setUseCustom(true)} style={{ ...toggleBtn, background: useCustom ? 'rgba(99,102,241,0.15)' : 'transparent', color: useCustom ? '#a5b4fc' : '#64748b', border: useCustom ? '1px solid rgba(99,102,241,0.3)' : '1px solid #1e293b' }}>Custom phone</button>
        </div>
        {useCustom ? (
          <input type="tel" value={customPhone} onChange={(e) => setCustomPhone(e.target.value)} placeholder="14155552671 (no + or spaces)" style={fieldStyle}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}/>
        ) : (
          <select value={contactId} onChange={(e) => setContactId(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}>
            <option value="">Select a contact…</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
            ))}
          </select>
        )}
        {recipientPhone && <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Will be sent to: <span style={{ color: '#a5b4fc' }}>{recipientPhone}</span></p>}
      </div>

      {mode === 'text' ? (
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Message</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type your message…" rows={4} style={{ ...fieldStyle, resize: 'vertical' }}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}/>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Template</label>
            {templates.length === 0 ? (
              <div style={{ padding: '12px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 13, color: '#fcd34d' }}>
                No approved templates found. <a href="/dashboard/templates" style={{ color: '#a5b4fc' }}>Sync templates →</a>
              </div>
            ) : (
              <select value={selectedTemplate} onChange={(e) => onTemplateChange(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}>
                <option value="">Select a template…</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.meta_template_name}>{t.meta_template_name} ({t.language})</option>
                ))}
              </select>
            )}
          </div>

          {template && (
            <>
              {/* Template preview */}
              {template.components && (
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Preview</label>
                  <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 16px' }}>
                    {template.components.map((comp: any, i: number) => (
                      <div key={i} style={{ marginBottom: 8 }}>
                        <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase' }}>{comp.type}: </span>
                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{comp.text ?? comp.format ?? JSON.stringify(comp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholder inputs */}
              {params.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Fill in placeholders</label>
                  {params.map((_, idx) => (
                    <div key={idx} style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>
                        {'{{' + (idx + 1) + '}}'}
                      </label>
                      <input
                        type="text"
                        value={params[idx]}
                        onChange={(e) => { const p = [...params]; p[idx] = e.target.value; setParams(p); }}
                        placeholder={`Value for {{${idx + 1}}}`}
                        style={fieldStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {result && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 16,
          background: result.success ? 'rgba(37,211,102,0.08)' : 'rgba(244,63,94,0.08)',
          border: `1px solid ${result.success ? 'rgba(37,211,102,0.2)' : 'rgba(244,63,94,0.2)'}`,
          color: result.success ? '#86efac' : '#fb7185',
          fontSize: 13,
        }}>
          {result.message}
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={sending || !recipientPhone || (mode === 'text' ? !body.trim() : !selectedTemplate)}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none',
          background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700,
          cursor: 'pointer',
          opacity: (sending || !recipientPhone || (mode === 'text' ? !body.trim() : !selectedTemplate)) ? 0.5 : 1,
        }}
      >
        {sending ? 'Sending…' : '✓ Send WhatsApp message'}
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: '#94a3b8', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.04em',
  display: 'block', marginBottom: 8,
};

const toggleBtn: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
};
