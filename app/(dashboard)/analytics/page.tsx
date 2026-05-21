import { createAdminClient } from '@/lib/supabase/admin'
import { KpiCard } from '@/components/kpi-card'
import { VisitsByDayChart } from '@/components/analytics/visits-chart'
import { ReviewsList } from '@/components/analytics/reviews-list'
import { Eye, Star, Clock, TrendingUp } from 'lucide-react'
import type { PortfolioReview } from '@/lib/types'

function startOfDay(d: Date) { const r = new Date(d); r.setHours(0,0,0,0); return r }
function startOfWeek(d: Date) { const r = new Date(d); r.setDate(r.getDate()-r.getDay()); r.setHours(0,0,0,0); return r }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function daysAgo(n: number) { return new Date(Date.now() - n * 86400000) }

async function getAnalyticsData() {
  const supabase = createAdminClient()
  const now = new Date()

  const [
    { count: visitasHoy },
    { count: visitasSemana },
    { count: visitasMes },
    { data: visitasRaw },
    { data: reviewsRaw },
  ] = await Promise.all([
    supabase.from('portfolio_visits').select('*', { count: 'exact', head: true })
      .gte('visited_at', startOfDay(now).toISOString()),
    supabase.from('portfolio_visits').select('*', { count: 'exact', head: true })
      .gte('visited_at', startOfWeek(now).toISOString()),
    supabase.from('portfolio_visits').select('*', { count: 'exact', head: true })
      .gte('visited_at', startOfMonth(now).toISOString()),
    supabase.from('portfolio_visits').select('visited_at')
      .gte('visited_at', daysAgo(14).toISOString())
      .not('visited_at', 'is', null),
    supabase.from('portfolio_reviews').select('*')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  // Build 14-day chart
  const dayMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    dayMap[daysAgo(i).toISOString().slice(0, 10)] = 0
  }
  for (const row of visitasRaw ?? []) {
    if (row.visited_at) {
      const key = new Date(row.visited_at).toISOString().slice(0, 10)
      if (key in dayMap) dayMap[key]++
    }
  }
  const chartData = Object.entries(dayMap).map(([date, count]) => ({ date: date.slice(5), count }))

  const reviews = (reviewsRaw ?? []) as PortfolioReview[]
  const approvedReviews = reviews.filter((r) => r.status === 'approved')
  const avgRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '—'
  const pendingCount = reviews.filter((r) => r.status === 'pending').length

  return {
    visitasHoy: visitasHoy ?? 0,
    visitasSemana: visitasSemana ?? 0,
    visitasMes: visitasMes ?? 0,
    chartData,
    reviews,
    avgRating,
    pendingCount,
    totalApproved: approvedReviews.length,
  }
}

export default async function AnalyticsPage() {
  let data
  try {
    data = await getAnalyticsData()
  } catch {
    return (
      <div className="p-8" style={{ color: '#ef4444' }}>
        Error cargando métricas del portfolio.
      </div>
    )
  }

  const { visitasHoy, visitasSemana, visitasMes, chartData, reviews, avgRating, pendingCount, totalApproved } = data

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div style={{ paddingBottom: 24, borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: '#f8fafc' }}>
          Analytics del Portfolio
        </h1>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
          Visitas y valoraciones de mariomoreno.work
        </div>
      </div>

      {/* KPIs — visitas */}
      <div>
        <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Visitas
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard label="Hoy" value={visitasHoy} icon={<Eye size={18} color="#34d399" />} />
          <KpiCard label="Esta semana" value={visitasSemana} icon={<TrendingUp size={18} color="#34d399" />} />
          <KpiCard label="Este mes" value={visitasMes} icon={<Eye size={18} color="#34d399" />} />
        </div>
      </div>

      {/* Visits chart */}
      <VisitsByDayChart data={chartData} />

      {/* Reviews section */}
      <div>
        <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Reviews
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <KpiCard
            label="Calificación promedio"
            value={avgRating as string | number}
            icon={<Star size={18} color="#f59e0b" />}
          />
          <KpiCard label="Aprobados" value={totalApproved} icon={<Star size={18} color="#22c55e" />} />
          <KpiCard label="Pendientes" value={pendingCount} icon={<Clock size={18} color="#f59e0b" />} />
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
              Todas las valoraciones
            </h3>
            {pendingCount > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
                background: 'rgba(245,158,11,0.12)', color: '#f59e0b',
              }}>
                {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <ReviewsList initial={reviews} />
        </div>
      </div>
    </div>
  )
}
