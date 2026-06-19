import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Role drives the sidebar label: the business owner is "Admin", everyone
  // else (reviewers, clients) is "Client".
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  const role = profile?.role === 'admin' ? 'Admin' : 'Client';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#020617' }}>
      <Sidebar role={role} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
