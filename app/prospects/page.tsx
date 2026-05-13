import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { OutreachProspect } from '@/lib/types'

async function skipProspect(id: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('outreach_prospects').update({ status: 'skipped' }).eq('id', id)
  revalidatePath('/prospects')
}

async function restoreProspect(id: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('outreach_prospects').update({ status: 'pending' }).eq('id', id)
  revalidatePath('/prospects')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function ProspectsTable({
  prospects,
  action,
  actionLabel,
  actionForm,
}: {
  prospects: OutreachProspect[]
  action: (id: string) => Promise<void>
  actionLabel: string
  actionForm: (id: string) => React.ReactNode
}) {
  if (prospects.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">Sin prospectos</div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl" style={{ background: '#1e293b' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            {['Empresa', 'Dominio', 'País', 'Industria', 'Email', 'Descubierto', ''].map((h) => (
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
          {prospects.map((p) => (
            <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              <td className="py-3 px-4 text-slate-200 font-medium">{p.company ?? '—'}</td>
              <td className="py-3 px-4 text-slate-400 text-xs">{p.domain ?? '—'}</td>
              <td className="py-3 px-4 text-slate-400">{p.country ?? '—'}</td>
              <td className="py-3 px-4 text-slate-400">{p.industry ?? '—'}</td>
              <td className="py-3 px-4 text-slate-400 text-xs">{p.email ?? '—'}</td>
              <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{formatDate(p.discovered_at)}</td>
              <td className="py-3 px-4">
                {actionForm(p.id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function ProspectsPage() {
  let pending: OutreachProspect[] = []
  let skipped: OutreachProspect[] = []

  try {
    const supabase = await createClient()
    const [{ data: pendingData }, { data: skippedData }] = await Promise.all([
      supabase
        .from('outreach_prospects')
        .select('*')
        .eq('status', 'pending')
        .order('discovered_at', { ascending: false }),
      supabase
        .from('outreach_prospects')
        .select('*')
        .eq('status', 'skipped')
        .order('discovered_at', { ascending: false }),
    ])
    pending = (pendingData ?? []) as OutreachProspect[]
    skipped = (skippedData ?? []) as OutreachProspect[]
  } catch {
    return (
      <div className="p-8 text-red-400">
        Error cargando prospectos. Verifica la conexión a Supabase.
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Prospectos</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {pending.length} pendientes · {skipped.length} omitidos
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="pending" className="text-slate-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Pendientes{' '}
            <Badge variant="outline" className="ml-2 border-slate-600 text-slate-400 text-xs">
              {pending.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="skipped" className="text-slate-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            Omitidos{' '}
            <Badge variant="outline" className="ml-2 border-slate-600 text-slate-400 text-xs">
              {skipped.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <ProspectsTable
            prospects={pending}
            action={skipProspect}
            actionLabel="Omitir"
            actionForm={(id) => (
              <form action={skipProspect.bind(null, id)}>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs rounded-md border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
                >
                  Omitir
                </button>
              </form>
            )}
          />
        </TabsContent>

        <TabsContent value="skipped" className="mt-4">
          <ProspectsTable
            prospects={skipped}
            action={restoreProspect}
            actionLabel="Restaurar"
            actionForm={(id) => (
              <form action={restoreProspect.bind(null, id)}>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs rounded-md border border-indigo-600 text-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300 transition-colors"
                >
                  Restaurar
                </button>
              </form>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
