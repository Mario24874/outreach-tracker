import { createClient } from '@/lib/supabase/server';
import TemplateActions from './TemplateActions';

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: templates } = await supabase
    .from('wa_templates')
    .select('*')
    .eq('user_id', user!.id)
    .order('synced_at', { ascending: false });

  const statusColor: Record<string, string> = {
    APPROVED: '#25D366',
    PENDING: '#f59e0b',
    REJECTED: '#f43f5e',
    PAUSED: '#64748b',
  };

  return (
    <div style={{ padding: '32px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: 0 }}>Templates</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>WhatsApp message templates synced from Meta</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <TemplateActions />
          <a
            href="/dashboard/templates/create"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8, background: '#6366f1',
              color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600,
            }}
          >
            + Create template
          </a>
        </div>
      </div>

      {/* Template grid */}
      {!templates || templates.length === 0 ? (
        <div style={{
          background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16,
          padding: '64px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>No templates yet</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
            Sync your existing templates from Meta, or create a new one.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <TemplateActions primaryStyle />
            <a href="/dashboard/templates/create" style={{ padding: '10px 20px', borderRadius: 8, background: '#6366f1', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              + Create template
            </a>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {templates.map((tpl: any) => (
            <a
              key={tpl.id}
              href={`/dashboard/templates/${tpl.id}`}
              style={{
                display: 'block', background: '#0f172a', border: '1px solid #1e293b',
                borderRadius: 12, padding: '18px 20px', textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = '#6366f1'; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = '#1e293b'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  📋
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace' }}>
                      {tpl.meta_template_name}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                      background: `${statusColor[tpl.status] ?? '#64748b'}18`,
                      color: statusColor[tpl.status] ?? '#64748b',
                      border: `1px solid ${statusColor[tpl.status] ?? '#64748b'}30`,
                    }}>
                      {tpl.status}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b', padding: '2px 7px', borderRadius: 5, background: '#1e293b' }}>
                      {tpl.category}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      {tpl.language}
                    </span>
                  </div>
                  {tpl.components && (
                    <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tpl.components.find((c: any) => c.type === 'BODY')?.text?.slice(0, 100) ?? '(no body text)'}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div style={{ color: '#475569', fontSize: 18, flexShrink: 0 }}>→</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
