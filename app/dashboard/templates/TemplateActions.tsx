'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TemplateActions({ primaryStyle }: { primaryStyle?: boolean }) {
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  async function syncTemplates() {
    setSyncing(true);
    const res = await fetch('/api/whatsapp/templates/sync', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      router.refresh();
    } else {
      alert('Sync failed: ' + (data.error ?? 'unknown'));
    }
    setSyncing(false);
  }

  return (
    <button
      onClick={syncTemplates}
      disabled={syncing}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '9px 16px', borderRadius: 8, border: '1px solid #1e293b',
        background: primaryStyle ? '#0f172a' : 'transparent',
        color: '#94a3b8', fontSize: 13, fontWeight: 600,
        cursor: syncing ? 'wait' : 'pointer',
        opacity: syncing ? 0.6 : 1,
      }}
    >
      {syncing ? '⟳ Syncing…' : '⟳ Sync templates'}
    </button>
  );
}
