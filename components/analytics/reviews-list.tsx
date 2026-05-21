'use client'

import { useState } from 'react'
import type { PortfolioReview, ReviewStatus } from '@/lib/types'

type Props = {
  initial: PortfolioReview[]
}

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
}

const STATUS_COLOR: Record<ReviewStatus, string> = {
  pending: '#f59e0b',
  approved: '#22c55e',
  rejected: '#ef4444',
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#334155', fontSize: 14 }}>★</span>
      ))}
    </span>
  )
}

export function ReviewsList({ initial }: Props) {
  const [reviews, setReviews] = useState<PortfolioReview[]>(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function setStatus(id: string, status: ReviewStatus) {
    setLoading(id)
    const res = await fetch(`/api/analytics/review/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
    }
    setLoading(null)
  }

  if (reviews.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569', fontSize: 13 }}>
        No hay reviews todavía
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {reviews.map((r) => (
        <div key={r.id} style={{
          background: '#020617', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Stars rating={r.rating} />
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                background: `${STATUS_COLOR[r.status]}20`,
                color: STATUS_COLOR[r.status],
              }}>
                {STATUS_LABEL[r.status]}
              </span>
              <span style={{ fontSize: 11, color: '#475569' }}>
                {new Date(r.created_at).toLocaleDateString('es-ES')}
              </span>
            </div>
            {r.reviewer_name && (
              <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginTop: 6 }}>
                {r.reviewer_name}
                {r.reviewer_email && <span style={{ color: '#475569', fontWeight: 400 }}> · {r.reviewer_email}</span>}
              </div>
            )}
            {r.comment && (
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>
                {r.comment}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {r.status !== 'approved' && (
              <button
                onClick={() => setStatus(r.id, 'approved')}
                disabled={loading === r.id}
                style={{
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(34,197,94,0.12)', color: '#22c55e',
                  border: '1px solid rgba(34,197,94,0.25)', cursor: 'pointer',
                  opacity: loading === r.id ? 0.5 : 1,
                }}
              >
                Aprobar
              </button>
            )}
            {r.status !== 'rejected' && (
              <button
                onClick={() => setStatus(r.id, 'rejected')}
                disabled={loading === r.id}
                style={{
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer',
                  opacity: loading === r.id ? 0.5 : 1,
                }}
              >
                Rechazar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
