import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ConnectClient from './ConnectClient';

export const metadata = {
  title: 'Connect WhatsApp (Coexistence) — MarioOS',
};
export const dynamic = 'force-dynamic';

// Temporary admin-only page to onboard an existing WhatsApp Business app number
// to the Cloud API via Embedded Signup v4 (Coexistence). Remove after linking.
export default async function ConnectWhatsAppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = !!user.email && adminEmails.includes(user.email.toLowerCase());
  if (!isAdmin) redirect('/dashboard');

  const appId = process.env.META_APP_ID ?? '994890322950768';
  const configId = process.env.META_ES_CONFIG_ID ?? '';

  return <ConnectClient appId={appId} configId={configId} userEmail={user.email ?? ''} />;
}
