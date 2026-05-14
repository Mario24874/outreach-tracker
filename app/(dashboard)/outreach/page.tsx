import { createClient } from '@/lib/supabase/server'
import { OutreachTable } from '@/components/outreach-table'
import { OutreachFilters } from '@/components/outreach-filters'
import { Suspense } from 'react'
import type { OutreachLog } from '@/lib/types'

const PAGE_SIZE = 25

type SearchParams = Promise<{
  page?: string
  q?: string
  industry?: string
  country?: string
  status?: string
  from?: string
  to?: string
}>

async function getOutreachData(params: Awaited<SearchParams>) {
  const supabase = await createClient()

  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('outreach_log')
    .select('*', { count: 'exact' })
    .order('sent_at', { ascending: false })

  if (params.q) {
    query = query.or(`company.ilike.%${params.q}%,to_email.ilike.%${params.q}%`)
  }
  if (params.industry && params.industry !== 'all') {
    query = query.eq('industry', params.industry)
  }
  if (params.country && params.country !== 'all') {
    query = query.eq('country', params.country)
  }
  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }
  if (params.from) {
    query = query.gte('sent_at', new Date(params.from).toISOString())
  }
  if (params.to) {
    const toDate = new Date(params.to)
    toDate.setHours(23, 59, 59, 999)
    query = query.lte('sent_at', toDate.toISOString())
  }

  const { data, count } = await query.range(from, to)

  // Fetch filter options
  const [{ data: indRaw }, { data: cntRaw }] = await Promise.all([
    supabase
      .from('outreach_log')
      .select('industry')
      .not('industry', 'is', null)
      .order('industry'),
    supabase
      .from('outreach_log')
      .select('country')
      .not('country', 'is', null)
      .order('country'),
  ])

  const industries = [...new Set((indRaw ?? []).map((r) => r.industry as string).filter(Boolean))]
  const countries = [...new Set((cntRaw ?? []).map((r) => r.country as string).filter(Boolean))]

  return {
    records: (data ?? []) as OutreachLog[],
    count: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    industries,
    countries,
  }
}

export default async function OutreachPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams

  let result
  try {
    result = await getOutreachData(params)
  } catch {
    return (
      <div className="p-8 text-red-400">
        Error cargando datos. Verifica la conexión a Supabase.
      </div>
    )
  }

  const { records, count, page, totalPages, industries, countries } = result

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Outreach Log</h1>
        <p className="text-sm text-slate-400 mt-0.5">{count.toLocaleString('es-ES')} registros en total</p>
      </div>

      <div className="rounded-xl p-5" style={{ background: '#1e293b' }}>
        <Suspense fallback={null}>
          <OutreachFilters industries={industries} countries={countries} />
        </Suspense>
      </div>

      <OutreachTable records={records} page={page} totalPages={totalPages} />
    </div>
  )
}
