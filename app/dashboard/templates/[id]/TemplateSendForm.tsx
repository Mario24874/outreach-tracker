'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Contact { id: string; name: string; phone: string; }
interface Template { meta_template_name: string; language: string; components: any; }

export default function TemplateSendForm({ template, contacts }: { template: Template; contacts: Contact[] }) {
  const router = useRouter();
  const [contactId, setContactId] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [params, setParams] = useState<string[]>(() => {
    const body = (template.components as any[])?.find((c: any) => c.type === 'BODY');
    if (!body?.text) return [];
    const matches = body.text.match(/\{\{\d+\}\}/g) ?? [];
    const count = matches.length > 0 ? Math.max(...matches.map((m: string) => parseInt(m.replace(/[{}]/g, '')))) : 0;
    return Array(count).fill('');
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const recipientPhone = useCustom ? customPhone : (contacts.find((c) => c.id === contactId)?.phone ?? '');

  async function handleSend() {
    if (!recipientPhone) { alert('Select a contact or enter a phone number'); return; }
    setSending(true);
    setResult(null);

    const res = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipientPhone,
        templateName: template.meta_template_name,
        languageCode: template.language,
        bodyParams: params,
        contactId: !useCustom ? contactId : undefined,
      }),
    });
    const data = await res.json();

    if (data.success) {
      setResult({ success: true, message: `✓ Template sent! WAMID: ${data.wamid}` });
      setTimeout(() => router.push('/dashboard/whatsapp'), 2000);
    } else {
      setResult({ success: false, message: data.error ?? 'Failed to send' });
    }
    setSending(false);
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', background: '#020617', border: '1px solid #1e293b',
    borderRadius: 8, padding: '10px 12px', color: '#f8fafc',
    fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '24px' }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: '0 0 20px' }}>Send this template</h2>

      {/* Recipient */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Recipient</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {(['Contact', 'Custom phone'] as const).map((opt) => (
            <button key={opt} onClick={() => setUseCustom(opt === 'Custom phone')} style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid',
              background: ((opt === 'Custom phone') === useCustom) ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: ((opt === 'Custom phone') === useCustom) ? '#a5b4fc' : '#64748b',
              borderColor: ((opt === 'Custom phone') === useCustom) ? 'rgba(99,102,241,0.3)' : '#1e293b',
            }}>{opt}</button>
          ))}
        </div>
        {useCustom ? (
          <input type="tel" value={customPhone} onChange={(e) => setCustomPhone(e.target.value)} placeholder="14155552671 (no + or spaces)" style={fieldStyle}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}/>
        ) : (
          <select value={contactId} onChange={(e) => setContactId(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}>
            <option value="">Select a contact…</option>
            {contacts.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
          </select>
        )}
        {recipientPhone && <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Sending to: <span style={{ color: '#a5b4fc' }}>{recipientPhone}</span></p>}
      </div>

      {/* Placeholder inputs */}
      {params.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Fill placeholders</label>
          {params.map((val, idx) => (
            <div key={idx} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>
                {'{{' + (idx + 1) + '}}'}
              </label>
              <input
                type="text"
                value={val}
                onChange={(e) => { const p = [...params]; p[idx] = e.target.value; setParams(p); }}
                placeholder={`Value for {{${idx + 1}}}`}
                style={fieldStyle}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
                onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}
              />
            </div>
          ))}

          {/* Live preview with filled params */}
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Preview with your values</label>
            <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ background: '#1e293b', borderRadius: '12px 12px 12px 4px', padding: '12px 16px', maxWidth: '90%' }}>
                {(template.components as any[])?.map((comp: any, i: number) => {
                  let text = comp.text ?? '';
                  params.forEach((val, idx) => {
                    text = text.replace(new RegExp(`\\{\\{${idx + 1}\\}\\}`, 'g'), val || `{{${idx + 1}}}`);
                  });
                  return (
                    <p key={i} style={{
                      margin: i === 0 ? 0 : '8px 0 0',
                      fontSize: comp.type === 'HEADER' ? 14 : comp.type === 'FOOTER' ? 11 : 13,
                      fontWeight: comp.type === 'HEADER' ? 700 : 400,
                      color: comp.type === 'FOOTER' ? '#64748b' : '#cbd5e1',
                    }}>{text}</p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 16,
          background: result.success ? 'rgba(37,211,102,0.08)' : 'rgba(244,63,94,0.08)',
          border: `1px solid ${result.success ? 'rgba(37,211,102,0.2)' : 'rgba(244,63,94,0.2)'}`,
          color: result.success ? '#86efac' : '#fb7185', fontSize: 13,
        }}>
          {result.message}
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={sending || !recipientPhone}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none',
          background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700,
          cursor: sending || !recipientPhone ? 'not-allowed' : 'pointer',
          opacity: sending || !recipientPhone ? 0.5 : 1,
        }}
      >
        {sending ? 'Sending…' : '✓ Send template via WhatsApp'}
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: '#94a3b8', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.04em',
  display: 'block', marginBottom: 8,
};
