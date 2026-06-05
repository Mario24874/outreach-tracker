import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: contact }, { data: messages }] = await Promise.all([
    supabase.from('contacts').select('*').eq('id', id).eq('user_id', user!.id).single(),
    supabase.from('wa_messages').select('*').eq('contact_id', id).order('created_at', { ascending: false }).limit(20),
  ]);

  if (!contact) notFound();

  return (
    <div style={{ padding: '32px', maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/dashboard/contacts" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>← Back to contacts</a>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#94a3b8', fontWeight: 700 }}>
            {contact.name[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{contact.name}</h1>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{contact.phone}</div>
          </div>
          <a href={`/dashboard/whatsapp?contact=${contact.id}`} style={{ marginLeft: 'auto', padding: '9px 16px', borderRadius: 8, background: '#25D366', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            💬 Open chat
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          {[
            { label: 'Email', value: contact.email },
            { label: 'Company', value: contact.company },
            { label: 'Industry', value: contact.industry },
            { label: 'Country', value: contact.country },
            { label: 'Stage', value: contact.stage },
          ].map(({ label, value }) => value ? (
            <div key={label}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#f8fafc' }}>{value}</div>
            </div>
          ) : null)}
        </div>
      </div>

      {/* Message history */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', margin: 0 }}>Message history</h2>
        </div>
        {messages && messages.length > 0 ? messages.map((msg: any) => (
          <div key={msg.id} style={{ padding: '12px 20px', borderBottom: '1px solid #0a0f1f', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 12 }}>{msg.direction === 'inbound' ? '📥' : '📤'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#cbd5e1' }}>{msg.body}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                {msg.direction} · {msg.status} · {new Date(msg.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        )) : (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>No messages yet</div>
        )}
      </div>
    </div>
  );
}
