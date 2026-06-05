import { createClient } from '@/lib/supabase/server';
import AddContactForm from './AddContactForm';

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user!.id)
    .order('name');

  const stageColors: Record<string, string> = {
    lead: '#64748b',
    responded: '#06b6d4',
    conversation: '#6366f1',
    proposal: '#f59e0b',
    client: '#25D366',
  };

  return (
    <div style={{ padding: '32px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: 0 }}>Contacts</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{contacts?.length ?? 0} contacts</p>
        </div>
        <AddContactForm />
      </div>

      {!contacts || contacts.length === 0 ? (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>No contacts yet</h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Add your first contact to start messaging.</p>
        </div>
      ) : (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto', padding: '12px 20px', borderBottom: '1px solid #1e293b' }}>
            {['Name', 'Phone', 'Company', 'Stage', ''].map((h) => (
              <div key={h} style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
            ))}
          </div>

          {contacts.map((contact: any) => (
            <div
              key={contact.id}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto', padding: '14px 20px', borderBottom: '1px solid #0a0f1f', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 16, background: '#1e293b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: '#94a3b8', fontWeight: 700, flexShrink: 0,
                }}>
                  {contact.name[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>{contact.name}</div>
                  {contact.email && <div style={{ fontSize: 11, color: '#64748b' }}>{contact.email}</div>}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>{contact.phone}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{contact.company ?? '—'}</div>
              <div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 5,
                  background: `${stageColors[contact.stage] ?? '#64748b'}18`,
                  color: stageColors[contact.stage] ?? '#64748b',
                }}>
                  {contact.stage}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`/dashboard/whatsapp?contact=${contact.id}`} style={{ fontSize: 12, color: '#a5b4fc', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>Chat</a>
                <a href={`/dashboard/contacts/${contact.id}`} style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none', padding: '4px 10px', borderRadius: 6, border: '1px solid #1e293b' }}>View</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
