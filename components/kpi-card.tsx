'use client'

import { useState, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'

type KpiCardProps = {
  label: string
  value: number | string
  icon: LucideIcon
  description?: string
}

export function KpiCard({ label, value, icon: Icon, description }: KpiCardProps) {
  const [pos, setPos] = useState({ x: -200, y: -200, active: false })
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return
        const r = ref.current.getBoundingClientRect()
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top, active: true })
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, active: false }))}
      style={{
        position: 'relative', overflow: 'hidden',
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px -10px rgba(0,0,0,0.6)',
        transition: 'border-color .2s',
      }}
    >
      {/* Spotlight */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: pos.active ? 1 : 0, transition: 'opacity .25s',
        background: `radial-gradient(220px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.10), transparent 60%)`,
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          borderRadius: 10,
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
          width: 38, height: 38, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color="#a5b4fc" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>
            {label}
          </p>
          <p style={{
            fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1, marginTop: 6,
            background: 'linear-gradient(180deg, #f8fafc 0%, #a5b4fc 130%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {value}
          </p>
          {description && (
            <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
