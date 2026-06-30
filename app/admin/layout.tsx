import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 24px',
          height: 56,
          borderBottom: '1px solid #1e293b',
          background: '#0a0f1f',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15 }}>
          <span style={{ color: '#6366f1' }}>●</span> Admin · Métricas
        </span>
        <nav style={{ display: 'flex', gap: 4, fontSize: 13 }}>
          <Link href="/admin" style={{ color: '#94a3b8', padding: '6px 10px', borderRadius: 8 }}>
            Resumen
          </Link>
          <Link href="/dashboard" style={{ color: '#64748b', padding: '6px 10px', borderRadius: 8 }}>
            WhatsApp ↗
          </Link>
        </nav>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#475569' }}>{user.email}</span>
      </header>
      {children}
    </div>
  );
}
