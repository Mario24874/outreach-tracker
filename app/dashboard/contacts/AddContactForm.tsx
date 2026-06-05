'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddContactForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', company: '', email: '' });

  async function handleSave() {
    if (!form.name || !form.phone) { alert('Name and phone are required'); return; }
    setSaving(true);
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setForm({ name: '', phone: '', company: '', email: '' });
      router.refresh();
    } else {
      alert('Error: ' + (data.error ?? 'unknown'));
    }
    setSaving(false);
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', background: '#020617', border: '1px solid #1e293b',
    borderRadius: 8, padding: '10px 12px', color: '#f8fafc',
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: '9px 16px', borderRadius: 8, background: '#6366f1', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
      >
        + Add contact
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '28px', width: 400 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: '0 0 20px' }}>Add contact</h3>

            {[
              { key: 'name', label: 'Full name *', placeholder: 'John Doe', type: 'text' },
              { key: 'phone', label: 'Phone (with country code) *', placeholder: '14155552671', type: 'tel' },
              { key: 'email', label: 'Email', placeholder: 'john@company.com', type: 'email' },
              { key: 'company', label: 'Company', placeholder: 'Acme Inc.', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{label}</label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  style={fieldStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#1e293b'; }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={() => setOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'transparent', border: '1px solid #1e293b', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#6366f1', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : 'Add contact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
