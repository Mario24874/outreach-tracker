'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmailPreviewModal } from '@/components/email-preview-modal'
import { Download } from 'lucide-react'
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

function truncate(str: string | null, len: number) {
  if (!str) return '—'
  return str.length > len ? str.slice(0, len) + '…' : str
}

function exportCsv(records: OutreachLog[]) {
  const headers = ['empresa', 'pais', 'industria', 'email', 'dominio', 'asunto', 'estado', 'fecha']
  const rows = records.map((r) => [
    r.company ?? '',
    r.country ?? '',
    r.industry ?? '',
    r.to_email ?? '',
    r.domain ?? '',
    (r.subject ?? '').replace(/,/g, ' '),
    r.status ?? '',
    r.sent_at ?? '',
  ])
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `outreach-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

type Props = {
  records: OutreachLog[]
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export function OutreachTable({ records, page, totalPages }: Props) {
  const [selected, setSelected] = useState<OutreachLog | null>(null)

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportCsv(records)}
          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <Download size={14} className="mr-2" />
          Exportar CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ background: '#1e293b' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {['Empresa', 'Sitio Web', 'País', 'Industria', 'Email', 'Asunto', 'Estado', 'Fecha'].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 text-sm">
                  Sin resultados para los filtros aplicados
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelected(r)}
                className="border-b border-slate-800 hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 text-slate-200 font-medium whitespace-nowrap">
                  {r.company ?? '—'}
                </td>
                <td className="py-3 px-4">
                  {r.website_url ? (
                    <a
                      href={r.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-indigo-400 hover:text-indigo-300 text-xs underline underline-offset-2 truncate max-w-[140px] block"
                    >
                      {r.domain ?? r.website_url}
                    </a>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{r.country ?? '—'}</td>
                <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{r.industry ?? '—'}</td>
                <td className="py-3 px-4 text-slate-400 text-xs">{r.to_email ?? '—'}</td>
                <td className="py-3 px-4 text-slate-400 max-w-[200px]">
                  {truncate(r.subject, 40)}
                </td>
                <td className="py-3 px-4">
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
                <td className="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">
                  {formatDate(r.sent_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-400">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`?page=${page - 1}`}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Anterior
              </a>
            )}
            {page < totalPages && (
              <a
                href={`?page=${page + 1}`}
                className="px-3 py-1.5 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Siguiente
              </a>
            )}
          </div>
        </div>
      )}

      <EmailPreviewModal record={selected} onClose={() => setSelected(null)} />
    </>
  )
}
