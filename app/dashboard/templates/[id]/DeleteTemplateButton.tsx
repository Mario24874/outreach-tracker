'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteTemplateButton({ name }: { name: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `Delete template "${name}"? This removes it from Meta and cannot be undone.`
      )
    )
      return;
    setDeleting(true);
    const res = await fetch(
      `/api/whatsapp/templates?name=${encodeURIComponent(name)}`,
      { method: 'DELETE' }
    );
    const data = await res.json();
    if (data.success) {
      router.push('/dashboard/templates');
      router.refresh();
    } else {
      alert('Delete failed: ' + (data.error ?? 'unknown'));
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        flexShrink: 0,
        padding: '8px 14px',
        borderRadius: 8,
        border: '1px solid rgba(244,63,94,0.3)',
        background: 'rgba(244,63,94,0.08)',
        color: '#f43f5e',
        fontSize: 13,
        fontWeight: 600,
        cursor: deleting ? 'wait' : 'pointer',
        opacity: deleting ? 0.6 : 1,
      }}
    >
      {deleting ? 'Deleting…' : 'Delete template'}
    </button>
  );
}
