import { createClient } from '@/lib/supabase/server'
import { KpiCard } from '@/components/kpi-card'
import { EmailsByDayChart } from '@/components/charts/emails-by-day'
import { EmailsByIndustryChart } from '@/components/charts/emails-by-industry'
import { RealtimeTable } from '@/components/realtime-table'
import { Mail, CalendarDays, CalendarRange, Users } from 'lucide-react'
import type { ChartDay, ChartIndustry, OutreachLog } from '@/lib/types'

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
}

async function getDashboardData() {
  const supabase = await createClient()
  const now = new Date()

  const [
    { count: emailsToday },
    { count: emailsWeek },
    { count: emailsMonth },
    { count: prospectsQueue },
    { data: rawDay },
    { data: rawIndustry },
    { data: recentRaw },
  ] = await Promise.all([
    supabase
      .from('outreach_log')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')
      .gte('sent_at', startOfDay(now).toISOString()),

    supabase
      .from('outreach_log')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')
      .gte('sent_at', startOfWeek(now).toISOString()),

    supabase
      .from('outreach_log')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')
      .gte('sent_at', startOfMonth(now).toISOString()),

    supabase
      .from('outreach_prospects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),

    supabase
      .from('outreach_log')
      .select('sent_at')
      .eq('status', 'sent')
      .gte('sent_at', daysAgo(14).toISOString())
      .not('sent_at', 'is', null),

    supabase
      .from('outreach_log')
      .select('industry')
      .eq('status', 'sent')
      .gte('sent_at', daysAgo(30).toISOString())
      .not('industry', 'is', null),

    supabase
      .from('outreach_log')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10),
  ])

  const dayMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = daysAgo(i)
    const key = d.toISOString().slice(0, 10)
    dayMap[key] = 0
  }
  for (const row of rawDay ?? []) {
    if (row.sent_at) {
      const key = new Date(row.sent_at).toISOString().slice(0, 10)
      if (key in dayMap) dayMap[key]++
    }
  }
  const chartDay: ChartDay[] = Object.entries(dayMap).map(([date, count]) => ({
    date: date.slice(5),
    count,
  }))

  const indMap: Record<string, number> = {}
  for (const row of rawIndustry ?? []) {
    if (row.industry) {
      indMap[row.industry] = (indMap[row.industry] ?? 0) + 1
    }
  }
  const chartIndustry: ChartIndustry[] = Object.entries(indMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }))

  return {
    emailsToday: emailsToday ?? 0,
    emailsWeek: emailsWeek ?? 0,
    emailsMonth: emailsMonth ?? 0,
    prospectsQueue: prospectsQueue ?? 0,
    chartDay,
    chartIndustry,
    recent: (recentRaw ?? []) as OutreachLog[],
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

  const { emailsToday, emailsWeek, emailsMonth, prospectsQueue, chartDay, chartIndustry, recent } = data
  const hasActivityToday = emailsToday > 0

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header — MarioOS AdminHeader style */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 24, borderBottom: '1px solid #1e293b',
      }}>
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
              boxShadow: hasActivityToday
                ? 'inset 0 0 0 1px rgba(34,197,94,0.3)'
                : 'inset 0 0 0 1px #1e293b',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 3,
                background: hasActivityToday ? '#22c55e' : '#64748b',
                boxShadow: hasActivityToday ? '0 0 8px #22c55e' : 'none',
                animation: hasActivityToday ? 'mos-pulse 2s ease-in-out infinite' : 'none',
              }} />
              {hasActivityToday ? 'Sistema activo' : 'Sin actividad hoy'}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Resumen de outreach · actualización en tiempo real
          </div>
        </div>
      </div>

      {/* KPIs — bento grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Emails hoy" value={emailsToday} icon={Mail} />
        <KpiCard label="Esta semana" value={emailsWeek} icon={CalendarDays} />
        <KpiCard label="Este mes" value={emailsMonth} icon={CalendarRange} />
        <KpiCard label="Prospectos en cola" value={prospectsQueue} icon={Users} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <EmailsByDayChart data={chartDay} />
        </div>
        <div className="lg:col-span-2">
          <EmailsByIndustryChart data={chartIndustry} />
        </div>
      </div>

      {/* Recent activity */}
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b',
        borderRadius: 14, padding: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
            Actividad reciente
          </h3>
          <a href="/outreach" style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 500, textDecoration: 'none' }}>
            Ver todo →
          </a>
        </div>
        <RealtimeTable initial={recent} />
      </div>
    </div>
  )
}
