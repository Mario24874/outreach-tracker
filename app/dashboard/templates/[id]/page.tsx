import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import TemplateSendForm from './TemplateSendForm';

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: template }, { data: contacts }] = await Promise.all([
    supabase.from('wa_templates').select('*').eq('id', id).eq('user_id', user!.id).single(),
    supabase.from('contacts').select('id, name, phone').eq('user_id', user!.id).order('name'),
  ]);

  if (!template) notFound();

  const statusColor: Record<string, string> = {
    APPROVED: '#25D366',
    PENDING: '#f59e0b',
    REJECTED: '#f43f5e',
    PAUSED: '#64748b',
  };

  return (
    <div style={{ padding: '32px', maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/dashboard/templates" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>← Back to templates</a>
      </div>

      {/* Template info */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', margin: '0 0 8px', fontFamily: 'monospace' }}>
              {template.meta_template_name}
            </h1>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
                background: `${statusColor[template.status] ?? '#64748b'}18`,
                color: statusColor[template.status] ?? '#64748b',
                border: `1px solid ${statusColor[template.status] ?? '#64748b'}30`,
              }}>
                {template.status}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8', padding: '3px 9px', borderRadius: 6, background: '#1e293b' }}>
                {template.category}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8', padding: '3px 9px', borderRadius: 6, background: '#1e293b' }}>
                {template.language}
              </span>
            </div>
          </div>
        </div>

        {/* Components */}
        {template.components && (
          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Structure</div>
            {(template.components as any[]).map((comp: any, i: number) => (
              <div key={i} style={{ marginBottom: 12, padding: '12px 16px', background: '#020617', borderRadius: 10, border: '1px solid #1e293b' }}>
                <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{comp.type}</div>
                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
                  {comp.text ?? comp.format ?? JSON.stringify(comp, null, 2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send form (only if APPROVED) */}
      {template.status === 'APPROVED' ? (
        <TemplateSendForm template={template} contacts={contacts ?? []} />
      ) : (
        <div style={{
          background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '32px',
          textAlign: 'center', color: '#64748b',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p style={{ fontSize: 14, margin: 0 }}>
            This template is <strong style={{ color: statusColor[template.status] }}>{template.status}</strong>.
            {template.status === 'PENDING' && ' It will be available once Meta approves it.'}
            {template.status === 'REJECTED' && ' Create a new template with the required changes.'}
          </p>
        </div>
      )}
    </div>
  );
}
