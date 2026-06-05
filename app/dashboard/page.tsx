import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalSent },
    { count: totalDelivered },
    { count: totalContacts },
    { count: approvedTemplates },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('wa_messages').select('*', { count: 'exact', head: true })
      .eq('user_id', user!.id).eq('direction', 'outbound').gte('created_at', weekAgo),
    supabase.from('wa_messages').select('*', { count: 'exact', head: true })
      .eq('user_id', user!.id).eq('direction', 'outbound').in('status', ['delivered', 'read']).gte('created_at', weekAgo),
    supabase.from('contacts').select('*', { count: 'exact', head: true })
      .eq('user_id', user!.id),
    supabase.from('wa_templates').select('*', { count: 'exact', head: true })
      .eq('user_id', user!.id).eq('status', 'APPROVED'),
    supabase.from('wa_messages').select('id, direction, type, body, status, created_at, contacts(name, phone)')
      .eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10),
  ]);

  const deliveryRate = totalSent && totalSent > 0
    ? Math.round(((totalDelivered ?? 0) / totalSent) * 100)
    : 0;

  const kpis = [
    { label: 'Messages sent (7d)', value: totalSent ?? 0, color: '#6366f1', icon: '📤' },
    { label: 'Delivery rate', value: `${deliveryRate}%`, color: '#25D366', icon: '✅' },
    { label: 'Active contacts', value: totalContacts ?? 0, color: '#06b6d4', icon: '👥' },
    { label: 'Approved templates', value: approvedTemplates ?? 0, color: '#f59e0b', icon: '📋' },
  ];

  return (
    <div style={{ padding: '32px 32px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: 0 }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Overview of your WhatsApp Business activity</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{
            background: '#0f172a', border: '1px solid #1e293b',
            borderRadius: 12, padding: '20px 24px',
          }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>{kpi.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', margin: 0 }}>Recent activity</h2>
          <a href="/dashboard/whatsapp" style={{ fontSize: 12, color: '#a5b4fc', textDecoration: 'none' }}>View all →</a>
        </div>

        {recentMessages && recentMessages.length > 0 ? (
          <div>
            {recentMessages.map((msg: any) => (
              <div key={msg.id} style={{ padding: '14px 24px', borderBottom: '1px solid #0a0f1f', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: msg.direction === 'inbound' ? 'rgba(37,211,102,0.1)' : 'rgba(99,102,241,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>
                  {msg.direction === 'inbound' ? '📥' : '📤'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#f8fafc', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {(msg.contacts as any)?.name ?? msg.contacts?.phone ?? 'Unknown'}
                    <span style={{ color: '#64748b', fontWeight: 400 }}> — {msg.body?.slice(0, 60) ?? '(no text)'}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    {msg.direction === 'inbound' ? 'Inbound' : 'Outbound'} · {msg.type} · {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
                <StatusBadge status={msg.status} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
            <p style={{ fontSize: 14, margin: 0 }}>No messages yet. <a href="/dashboard/whatsapp/send" style={{ color: '#a5b4fc' }}>Send your first message →</a></p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 24 }}>
        {[
          { href: '/dashboard/whatsapp/send', label: 'Send a message', desc: 'Send text or template', icon: '✉️' },
          { href: '/dashboard/templates', label: 'Manage templates', desc: 'Sync & create templates', icon: '📋' },
          { href: '/dashboard/contacts', label: 'View contacts', desc: 'Manage your contact list', icon: '👥' },
          { href: '/dashboard/settings', label: 'Settings', desc: 'Configure WhatsApp number', icon: '⚙️' },
        ].map((link) => (
          <a key={link.href} href={link.href} style={{
            display: 'block', background: '#0f172a', border: '1px solid #1e293b',
            borderRadius: 10, padding: '16px 20px', textDecoration: 'none',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e293b'; }}
          >
            <div style={{ fontSize: 20, marginBottom: 8 }}>{link.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>{link.label}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{link.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: '#64748b',
    sent: '#94a3b8',
    delivered: '#25D366',
    read: '#6366f1',
    failed: '#f43f5e',
  };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: colors[status] ?? '#64748b', flexShrink: 0 }}>
      {status}
    </span>
  );
}
