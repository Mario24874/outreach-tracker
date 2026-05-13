'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import type { OutreachLog } from '@/lib/types'

type Props = {
  record: OutreachLog | null
  onClose: () => void
}

export function EmailPreviewModal({ record, onClose }: Props) {
  if (!record) return null

  return (
    <Dialog open={!!record} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        style={{ background: '#1e293b', border: '1px solid #334155' }}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-base">
            {record.company ?? '—'}{' '}
            <span className="text-slate-400 font-normal text-sm">
              — {record.to_email ?? '—'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {record.subject && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Asunto</p>
              <p className="text-sm text-slate-300">{record.subject}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-slate-500 mb-1">Cuerpo del email</p>
            <pre
              className="text-xs text-slate-300 whitespace-pre-wrap font-mono rounded-lg p-3 overflow-x-auto"
              style={{ background: '#0f172a', maxHeight: 300 }}
            >
              {record.body_preview ?? '(sin preview)'}
            </pre>
          </div>

          {record.website_url && (
            <Button
              variant="outline"
              size="sm"
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
              onClick={() => window.open(record.website_url!, '_blank')}
            >
              <ExternalLink size={14} className="mr-2" />
              Ver sitio web
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
