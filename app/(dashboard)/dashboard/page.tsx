import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { KpiCard } from '@/components/kpi-card'
import { EmailsByDayChart } from '@/components/charts/emails-by-day'
import { EmailsByIndustryChart } from '@/components/charts/emails-by-industry'
import { VisitsByDayChart } from '@/components/analytics/visits-chart'
import { RealtimeTable } from '@/components/realtime-table'
import { Mail, CalendarDays, CalendarRange, Users, Eye, Star, Clock } from 'lucide-react'
import type { ChartDay, ChartIndustry, OutreachLog } from '@/lib/types'

function startOfDay(d: Date) { const r = new Date(d); r.setHours(0,0,0,0); return r }
function startOfWeek(d: Date) { const r = new Date(d); r.setDate(r.getDate()-r.getDay()); r.setHours(0,0,0,0); return r }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function daysAgo(n: number) { return new Date(Date.now() - n * 86400000) }

async function getDashboardData() {
  const supabase = await createClient()
  const admin = createAdminClient()
  const now = new Date()

  const [
    { count: emailsToday },
    { count: emailsWeek },
    { count: emailsMonth },
    { count: prospectsQueue },
    { data: rawDay },
    { data: rawIndustry },
    { data: recentRaw },
    { count: visitasHoy },
    { count: visitasSemana },
    { count: visitasMes },
    { data: visitsRaw },
    { data: reviewsRaw },
  ] = await Promise.all([
    supabase.from('outreach_log').select('*', { count: 'exact', head: true })
      .eq('status', 'sent').gte('sent_at', startOfDay(now).toISOString()),
    supabase.from('outreach_log').select('*', { count: 'exact', head: true })
      .eq('status', 'sent').gte('sent_at', startOfWeek(now).toISOString()),
    supabase.from('outreach_log').select('*', { count: 'exact', head: true })
      .eq('status', 'sent').gte('sent_at', startOfMonth(now).toISOString()),
    supabase.from('outreach_prospects').select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('outreach_log').select('sent_at').eq('status', 'sent')
      .gte('sent_at', daysAgo(14).toISOString()).not('sent_at', 'is', null),
    supabase.from('outreach_log').select('industry').eq('status', 'sent')
      .gte('sent_at', daysAgo(30).toISOString()).not('industry', 'is', null),
    supabase.from('outreach_log').select('*').order('sent_at', { ascending: false }).limit(10),
    // Analytics
    admin.from('portfolio_visits').select('*', { count: 'exact', head: true })
      .gte('visited_at', startOfDay(now).toISOString()),
    admin.from('portfolio_visits').select('*', { count: 'exact', head: true })
      .gte('visited_at', startOfWeek(now).toISOString()),
    admin.from('portfolio_visits').select('*', { count: 'exact', head: true })
      .gte('visited_at', startOfMonth(now).toISOString()),
    admin.from('portfolio_visits').select('visited_at')
      .gte('visited_at', daysAgo(14).toISOString()).not('visited_at', 'is', null),
    admin.from('portfolio_reviews').select('rating, status').order('created_at', { ascending: false }),
  ])

  // Outreach charts
  const dayMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) dayMap[daysAgo(i).toISOString().slice(0, 10)] = 0
  for (const row of rawDay ?? []) {
    if (row.sent_at) { const k = new Date(row.sent_at).toISOString().slice(0, 10); if (k in dayMap) dayMap[k]++ }
  }
  const chartDay: ChartDay[] = Object.entries(dayMap).map(([date, count]) => ({ date: date.slice(5), count }))

  const indMap: Record<string, number> = {}
  for (const row of rawIndustry ?? []) {
    if (row.industry) indMap[row.industry] = (indMap[row.industry] ?? 0) + 1
  }
  const chartIndustry: ChartIndustry[] = Object.entries(indMap).sort((a,b) => b[1]-a[1]).slice(0,6)
    .map(([name, value]) => ({ name, value }))

  // Visits chart
  const visitDayMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) visitDayMap[daysAgo(i).toISOString().slice(0, 10)] = 0
  for (const row of visitsRaw ?? []) {
    if (row.visited_at) { const k = new Date(row.visited_at).toISOString().slice(0, 10); if (k in visitDayMap) visitDayMap[k]++ }
  }
  const visitChartData = Object.entries(visitDayMap).map(([date, count]) => ({ date: date.slice(5), count }))

  // Reviews summary
  const reviews = reviewsRaw ?? []
  const approved = reviews.filter((r) => r.status === 'approved')
  const avgRating = approved.length > 0
    ? (approved.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / approved.length).toFixed(1)
    : '—'
  const pendingCount = reviews.filter((r) => r.status === 'pending').length

  return {
    emailsToday: emailsToday ?? 0, emailsWeek: emailsWeek ?? 0,
    emailsMonth: emailsMonth ?? 0, prospectsQueue: prospectsQueue ?? 0,
    chartDay, chartIndustry, recent: (recentRaw ?? []) as OutreachLog[],
    visitasHoy: visitasHoy ?? 0, visitasSemana: visitasSemana ?? 0,
    visitasMes: visitasMes ?? 0, visitChartData, avgRating, pendingCount,
  }
}

export default async function DashboardPage() {
  let data
  try {
    data = await getDashboardData()
  } catch {
    return (
      <div className="p-8" style={{ color: '#ef4444' }}>
        Error conectando a Supabase. Verifica las variables de entorno.
      </div>
    )
  }

  const {
    emailsToday, emailsWeek, emailsMonth, prospectsQueue,
    chartDay, chartIndustry, recent,
    visitasHoy, visitasSemana, visitasMes, visitChartData, avgRating, pendingCount,
  } = data
  const hasActivityToday = emailsToday > 0

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 24, borderBottom: '1px solid #1e293b' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: '#f8fafc' }}>
              Dashboard
            </h1>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: hasActivityToday ? '#86efac' : '#64748b', fontWeight: 600,
              padding: '3px 8px', borderRadius: 999,
              background: hasActivityToday ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.12)',
              boxShadow: hasActivityToday ? 'inset 0 0 0 1px rgba(34,197,94,0.3)' : 'inset 0 0 0 1px #1e293b',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: hasActivityToday ? '#22c55e' : '#64748b', boxShadow: hasActivityToday ? '0 0 8px #22c55e' : 'none' }} />
              {hasActivityToday ? 'Sistema activo' : 'Sin actividad hoy'}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Resumen de outreach · actualización en tiempo real</div>
        </div>
      </div>

      {/* ── Outreach ──────────────────────────────── */}
      <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Outreach
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Emails hoy"         value={emailsToday}     icon={<Mail         size={18} color="#a5b4fc" />} />
        <KpiCard label="Esta semana"         value={emailsWeek}      icon={<CalendarDays size={18} color="#a5b4fc" />} />
        <KpiCard label="Este mes"            value={emailsMonth}     icon={<CalendarRange size={18} color="#a5b4fc" />} />
        <KpiCard label="Prospectos en cola"  value={prospectsQueue}  icon={<Users        size={18} color="#a5b4fc" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3"><EmailsByDayChart data={chartDay} /></div>
        <div className="lg:col-span-2"><EmailsByIndustryChart data={chartIndustry} /></div>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>Actividad reciente</h3>
          <a href="/outreach" style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 500, textDecoration: 'none' }}>Ver todo →</a>
        </div>
        <RealtimeTable initial={recent} />
      </div>

      {/* ── Portfolio Analytics ───────────────────── */}
      <div style={{ paddingTop: 8, borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Portfolio · mariomoreno.work
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Visitas y valoraciones</div>
          </div>
          <a href="/analytics" style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 500, textDecoration: 'none' }}>
            Gestionar reviews →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Visitas hoy"      value={visitasHoy}      icon={<Eye  size={18} color="#34d399" />} />
        <KpiCard label="Esta semana"      value={visitasSemana}   icon={<Eye  size={18} color="#34d399" />} />
        <KpiCard label="Este mes"         value={visitasMes}      icon={<Eye  size={18} color="#34d399" />} />
        <KpiCard label="Rating promedio"  value={avgRating}       icon={<Star size={18} color="#f59e0b" />} />
        <KpiCard label="Reviews pendientes" value={pendingCount}  icon={<Clock size={18} color="#f59e0b" />} />
      </div>

      <VisitsByDayChart data={visitChartData} />
    </div>
  )
}
