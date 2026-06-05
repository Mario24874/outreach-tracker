import { createClient } from '@/lib/supabase/server';
import SendMessageForm from './SendMessageForm';

export default async function SendMessagePage({
  searchParams,
}: {
  searchParams: Promise<{ contact?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: contacts }, { data: templates }] = await Promise.all([
    supabase.from('contacts').select('id, name, phone').eq('user_id', user!.id).order('name'),
    supabase.from('wa_templates').select('*').eq('user_id', user!.id).eq('status', 'APPROVED').order('meta_template_name'),
  ]);

  return (
    <div style={{ padding: '32px', maxWidth: 600 }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/dashboard/whatsapp" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>← Back to chats</a>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', margin: '8px 0 4px' }}>Send message</h1>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Send a text or template message via WhatsApp</p>
      </div>
      <SendMessageForm
        contacts={contacts ?? []}
        templates={templates ?? []}
        defaultContactId={params.contact}
      />
    </div>
  );
}
