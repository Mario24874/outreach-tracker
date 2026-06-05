'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'MARKETING' | 'UTILITY'>('UTILITY');
  const [language, setLanguage] = useState('es');
  const [bodyText, setBodyText] = useState('');
  const [header, setHeader] = useState('');
  const [footer, setFooter] = useState('');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const paramCount = (bodyText.match(/\{\{\d+\}\}/g) ?? []).length;

  async function handleCreate() {
    if (!name || !bodyText) { alert('Name and body text are required'); return; }

    setCreating(true);
    setResult(null);

    const components: any[] = [];
    if (header) components.push({ type: 'HEADER', format: 'TEXT', text: header });
    components.push({ type: 'BODY', text: bodyText });
    if (footer) components.push({ type: 'FOOTER', text: footer });

    const res = await fetch('/api/whatsapp/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, language, components }),
    });
    const data = await res.json();

    if (data.success) {
      setResult({ success: true, message: 'Template submitted to Meta! It will appear as PENDING until approved.' });
      setTimeout(() => router.push('/dashboard/templates'), 2000);
    } else {
      setResult({ success: false, message: data.error ?? 'Failed to create template' });
    }
    setCreating(false);
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', background: '#020617', border: '1px solid #1e293b',
    borderRadius: 8, padding: '10px 12px', color: '#f8fafc',
    fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '32px', maxWidth: 680 }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/dashboard/templates" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>← Back to templates</a>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', margin: '8px 0 4px' }}>Create template</h1>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
          Templates are submitted to Meta for approval. Use {'{{'+'1}}'}, {'{{'+'2}}'} etc. for placeholders.
        </p>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '28px' }}>
        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Template name <span style={{ color: '#f43f5e' }}>*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_]/g, ''))}
            placeholder="e.g. appointment_reminder"
            style={fieldStyle}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
            onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}
          />
          <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Lowercase letters, numbers, underscores only</p>
        </div>

        {/* Category + Language */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Category <span style={{ color: '#f43f5e' }}>*</span></label>
            <select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ ...fieldStyle, cursor: 'pointer' }}
              onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}>
              <option value="UTILITY">UTILITY — Transactional</option>
              <option value="MARKETING">MARKETING — Promotional</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Language <span style={{ color: '#f43f5e' }}>*</span></label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ ...fieldStyle, cursor: 'pointer' }}
              onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}>
              <option value="es">Spanish (es)</option>
              <option value="en_US">English (en_US)</option>
              <option value="pt_BR">Portuguese (pt_BR)</option>
              <option value="it">Italian (it)</option>
            </select>
          </div>
        </div>

        {/* Header (optional) */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Header <span style={{ color: '#64748b' }}>(optional)</span></label>
          <input type="text" value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Short header text" style={fieldStyle}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}/>
        </div>

        {/* Body */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Body text <span style={{ color: '#f43f5e' }}>*</span></label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder={'Hello {{1}}, your appointment is confirmed for {{2}}. Reply CONFIRM to accept.'}
            rows={5}
            style={{ ...fieldStyle, resize: 'vertical' }}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
            onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}
          />
          {paramCount > 0 && (
            <p style={{ fontSize: 11, color: '#a5b4fc', marginTop: 4 }}>
              {paramCount} placeholder{paramCount > 1 ? 's' : ''} detected: {Array.from({ length: paramCount }, (_, i) => `{{${i+1}}}`).join(', ')}
            </p>
          )}
        </div>

        {/* Footer (optional) */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Footer <span style={{ color: '#64748b' }}>(optional)</span></label>
          <input type="text" value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="e.g. Reply STOP to unsubscribe" style={fieldStyle}
            onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }} onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}/>
        </div>

        {/* Preview */}
        {(header || bodyText || footer) && (
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Preview</label>
            <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: 12, padding: '16px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -8, left: 12, background: '#25D366', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>WhatsApp</div>
              <div style={{ background: '#1e293b', borderRadius: '12px 12px 12px 4px', padding: '12px 16px', maxWidth: '80%' }}>
                {header && <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{header}</p>}
                {bodyText && <p style={{ margin: '0 0 8px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{bodyText}</p>}
                {footer && <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{footer}</p>}
              </div>
            </div>
          </div>
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
          onClick={handleCreate}
          disabled={creating || !name || !bodyText}
          style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            background: '#6366f1', color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: creating || !name || !bodyText ? 'not-allowed' : 'pointer',
            opacity: creating || !name || !bodyText ? 0.5 : 1,
          }}
        >
          {creating ? 'Submitting to Meta…' : 'Submit template to Meta'}
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: '#94a3b8', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.04em',
  display: 'block', marginBottom: 8,
};
