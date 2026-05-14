import { createClient } from '@/lib/supabase/server'

function getNextWorkday(): string {
  const now = new Date()
  const next = new Date(now)
  next.setDate(next.getDate() + 1)
  // Skip weekend
  while (next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1)
  }
  return next.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }) + ' a las 09:00'
}

const apiTable = [
  { api: 'Google Maps Places', plan: 'Pay-as-you-go', limit: 'Sin límite' },
  { api: 'Hunter.io', plan: 'Free (25/mes)', limit: '25 búsquedas' },
  { api: 'Gemini 2.5 Flash', plan: 'Free tier', limit: '15 req/min' },
  { api: 'Resend', plan: 'Free', limit: '3,000/mes' },
]

export default async function SettingsPage() {
  let stats = { total: 0, domains: 0, industries: 0, countries: 0 }

  try {
    const supabase = await createClient()
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const { data } = await supabase
      .from('outreach_log')
      .select('domain, industry, country')
      .eq('status', 'sent')
      .gte('sent_at', monthStart)

    if (data) {
      stats.total = data.length
      stats.domains = new Set(data.map((r) => r.domain).filter(Boolean)).size
      stats.industries = new Set(data.map((r) => r.industry).filter(Boolean)).size
      stats.countries = new Set(data.map((r) => r.country).filter(Boolean)).size
    }
  } catch {
    // Stats unavailable — show zeros
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Configuración</h1>
        <p className="text-sm text-slate-400 mt-0.5">Estado del sistema y estadísticas</p>
      </div>

      {/* System status */}
      <section>
        <h2 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">Estado del sistema</h2>
        <div className="rounded-xl p-5 space-y-4" style={{ background: '#1e293b' }}>
          <div className="flex items-center justify-between py-2 border-b border-slate-700">
            <span className="text-sm text-slate-400">Workflow activo</span>
            <span className="text-sm text-emerald-400 font-medium">✅ Sí</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-700">
            <span className="text-sm text-slate-400">Próxima ejecución</span>
            <span className="text-sm text-slate-300 capitalize">{getNextWorkday()}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-700">
            <span className="text-sm text-slate-400">Modelo IA</span>
            <span className="text-sm text-slate-300">Gemini 2.5 Flash</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-400">Email remitente</span>
            <span className="text-sm text-slate-300">info@mariomoreno.work</span>
          </div>
        </div>
      </section>

      {/* API summary */}
      <section>
        <h2 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">Resumen de APIs</h2>
        <div className="rounded-xl overflow-hidden" style={{ background: '#1e293b' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {['API', 'Plan', 'Límite mensual'].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apiTable.map((row, i) => (
                <tr key={i} className={i < apiTable.length - 1 ? 'border-b border-slate-800' : ''}>
                  <td className="py-3 px-4 text-slate-200 font-medium">{row.api}</td>
                  <td className="py-3 px-4 text-slate-400">{row.plan}</td>
                  <td className="py-3 px-4 text-slate-400">{row.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Monthly stats */}
      <section>
        <h2 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wide">Estadísticas del mes</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Emails enviados', value: stats.total },
            { label: 'Dominios únicos', value: stats.domains },
            { label: 'Industrias cubiertas', value: stats.industries },
            { label: 'Países cubiertos', value: stats.countries },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{ background: '#1e293b' }}
            >
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
