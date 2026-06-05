import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();

  const envInfo = [
    { label: 'App URL', value: process.env.NEXT_PUBLIC_APP_URL },
    { label: 'Phone Number ID', value: process.env.META_PHONE_NUMBER_ID ? `...${process.env.META_PHONE_NUMBER_ID.slice(-6)}` : 'Not configured' },
    { label: 'WABA ID', value: process.env.META_WABA_ID ? `...${process.env.META_WABA_ID.slice(-6)}` : 'Not configured' },
    { label: 'Webhook URL', value: `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/webhook` },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: 0 }}>Settings</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Account and WhatsApp configuration</p>
      </div>

      {/* Account info */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>Account</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { label: 'Email', value: user?.email },
            { label: 'Full name', value: profile?.full_name },
            { label: 'Company', value: profile?.company_name },
            { label: 'Role', value: profile?.role },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #0a0f1f' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
              <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 500 }}>{value ?? '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Config */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>WhatsApp Cloud API</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {envInfo.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #0a0f1f' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
              <span style={{ fontSize: 12, color: '#f8fafc', fontFamily: 'monospace', background: '#1e293b', padding: '3px 8px', borderRadius: 5 }}>{value ?? '—'}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, fontSize: 13, color: '#94a3b8' }}>
          <strong style={{ color: '#a5b4fc' }}>Webhook setup:</strong> Go to Meta for Developers → Your App → WhatsApp → Configuration → Webhook, and set the URL above with your <code style={{ color: '#6366f1' }}>META_VERIFY_TOKEN</code>.
        </div>
      </div>

      {/* Privacy Policy link */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '24px' }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: '0 0 12px' }}>Privacy Policy</h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>
          Required for Meta App Review. Must be accessible at a public URL.
        </p>
        <a href="/privacy" target="_blank" style={{ fontSize: 13, color: '#a5b4fc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          View Privacy Policy ↗
        </a>
      </div>
    </div>
  );
}
