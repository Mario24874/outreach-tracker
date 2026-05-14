import { getPortalUser } from '@/lib/portal-user'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import type { Proyecto } from '@/lib/types'

const ESTADO_COLORS: Record<string, string> = {
  planificacion: '#6366f1',
  en_progreso: '#22d3ee',
  pausado: '#f59e0b',
  completado: '#34d399',
  cancelado: '#f87171',
}

const ESTADO_LABELS: Record<string, string> = {
  planificacion: 'Planificación',
  en_progreso: 'En progreso',
  pausado: 'Pausado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

export default async function ProyectosPage() {
  const user = await getPortalUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()
  const { data: proyectos } = await supabase
    .from('proyectos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = (proyectos ?? []) as Proyecto[]

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#f8fafc', fontSize: 20, fontWeight: 700, margin: 0 }}>Proyectos</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Estado y avance de tus desarrollos</p>
      </div>

      {list.length === 0 ? (
        <div style={{
          background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 12, padding: '48px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
          <div style={{ color: '#f8fafc', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No tienes proyectos aún</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>
            Crea una solicitud y Mario la convertirá en proyecto una vez aprobada y con el pago inicial recibido.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {list.map(p => {
            const sprintPct = Math.round((p.sprint_actual / p.sprints_total) * 100)
            return (
              <div key={p.id} style={{
                background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 12, padding: '20px',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ color: '#f8fafc', fontSize: 15, fontWeight: 700 }}>{p.nombre}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{p.tipo}</div>
                  </div>
                  <span style={{
                    background: `${ESTADO_COLORS[p.estado]}1a`,
                    color: ESTADO_COLORS[p.estado],
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, flexShrink: 0,
                  }}>
                    {ESTADO_LABELS[p.estado]}
                  </span>
                </div>

                {p.descripcion && (
                  <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5 }}>{p.descripcion}</div>
                )}

                {/* Sprint progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Sprint {p.sprint_actual} de {p.sprints_total}</span>
                    <span style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 600 }}>{sprintPct}%</span>
                  </div>
                  <div style={{ background: '#1e293b', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${sprintPct}%`,
                      background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
                      borderRadius: 4, transition: 'width 0.3s',
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {p.presupuesto_total && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', fontSize: 12 }}>Presupuesto</span>
                      <span style={{ color: '#f8fafc', fontSize: 12, fontWeight: 600 }}>
                        ${p.presupuesto_total.toLocaleString('es-ES')}
                      </span>
                    </div>
                  )}
                  {p.fecha_entrega_estimada && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', fontSize: 12 }}>Entrega estimada</span>
                      <span style={{ color: '#f8fafc', fontSize: 12 }}>
                        {new Date(p.fecha_entrega_estimada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: 12 }}>Pago inicial</span>
                    <span style={{ color: p.pago_inicial_recibido ? '#34d399' : '#f59e0b', fontSize: 12, fontWeight: 600 }}>
                      {p.pago_inicial_recibido ? '✓ Recibido' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
