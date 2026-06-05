import { createClient } from '@/lib/supabase/server';
import ChatView from './ChatView';

export default async function WhatsAppPage({
  searchParams,
}: {
  searchParams: Promise<{ contact?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get all conversations (latest message per contact)
  const { data: messages } = await supabase
    .from('wa_messages')
    .select('id, direction, body, status, created_at, phone_from, phone_to, contact_id, contacts(id, name, phone)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  // Group by contact
  const seen = new Set<string>();
  const conversations: any[] = [];
  for (const msg of messages ?? []) {
    const contactId = msg.contact_id ?? (msg.direction === 'inbound' ? msg.phone_from : msg.phone_to);
    if (!contactId || seen.has(contactId)) continue;
    seen.add(contactId);
    conversations.push(msg);
  }

  // Get contacts for new message dropdown
  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, name, phone')
    .eq('user_id', user!.id)
    .order('name');

  // Get messages for selected contact
  let selectedMessages: any[] = [];
  let selectedContact: any = null;

  if (params.contact) {
    const { data: msgs } = await supabase
      .from('wa_messages')
      .select('*')
      .eq('user_id', user!.id)
      .eq('contact_id', params.contact)
      .order('created_at', { ascending: true });
    selectedMessages = msgs ?? [];

    const { data: contact } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', params.contact)
      .single();
    selectedContact = contact;
  }

  return (
    <ChatView
      conversations={conversations}
      contacts={contacts ?? []}
      selectedContactId={params.contact}
      selectedContact={selectedContact}
      selectedMessages={selectedMessages}
    />
  );
}
