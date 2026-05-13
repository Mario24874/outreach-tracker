'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import type { OutreachLog } from '@/lib/types'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type Props = {
  initial: OutreachLog[]
}

export function RealtimeTable({ initial }: Props) {
  const [records, setRecords] = useState<OutreachLog[]>(initial)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('outreach-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'outreach_log' },
        (payload) => {
          setRecords((prev) => [payload.new as OutreachLog, ...prev].slice(0, 10))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        Sin actividad reciente
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            {['Empresa', 'País', 'Industria', 'Email', 'Estado', 'Fecha'].map((h) => (
              <th
                key={h}
                className="text-left py-3 px-3 text-xs font-medium text-slate-400 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr
              key={r.id}
              className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3 px-3 text-slate-200 font-medium">{r.company ?? '—'}</td>
              <td className="py-3 px-3 text-slate-400">{r.country ?? '—'}</td>
              <td className="py-3 px-3 text-slate-400">{r.industry ?? '—'}</td>
              <td className="py-3 px-3 text-slate-400">{r.to_email ?? '—'}</td>
              <td className="py-3 px-3">
                <Badge
                  variant="outline"
                  className={
                    r.status === 'sent'
                      ? 'border-emerald-600 text-emerald-400 bg-emerald-900/20'
                      : 'border-red-600 text-red-400 bg-red-900/20'
                  }
                >
                  {r.status === 'sent' ? 'Enviado' : 'Error'}
                </Badge>
              </td>
              <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                {formatDate(r.sent_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
