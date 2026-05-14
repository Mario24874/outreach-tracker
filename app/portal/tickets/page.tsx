import { getPortalUser } from '@/lib/portal-user'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Ticket, TicketPrioridad, Proyecto } from '@/lib/types'

const PRIORIDAD_COLORS: Record<string, string> = {
  baja: '#34d399', media: '#f59e0b', alta: '#f97316', critica: '#f87171',
}
const ESTADO_COLORS: Record<string, string> = {
  abierto: '#6366f1', en_progreso: '#22d3ee', resuelto: '#34d399', cerrado: '#475569',
}
const ESTADO_LABELS: Record<string, string> = {
  abierto: 'Abierto', en_progreso: 'En progreso', resuelto: 'Resuelto', cerrado: 'Cerrado',
}

async function createTicket(formData: FormData) {
  'use server'
  const user = await getPortalUser()
  if (!user) return
  const supabase = createAdminClient()
  const proyecto_id = formData.get('proyecto_id') as string || null
  await supabase.from('tickets').insert({
    user_id: user.id,
    proyecto_id: proyecto_id || null,
    titulo: formData.get('titulo') as string,
    descripcion: formData.get('descripcion') as string,
    prioridad: formData.get('prioridad') as TicketPrioridad,
  })
  revalidatePath('/portal/tickets')
}

export default async function TicketsPage() {
  const user = await getPortalUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()
  const [{ data: tickets }, { data: proyectos }] = await Promise.all([
    supabase.from('tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('proyectos').select('id, nombre').eq('user_id', user.id).neq('estado', 'cancelado'),
  ])

  const list = (tickets ?? []) as Ticket[]
  const proyectosList = (proyectos ?? []) as Pick<Proyecto, 'id' | 'nombre'>[]

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#f8fafc', fontSize: 20, fontWeight: 700, margin: 0 }}>Tickets</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Soporte técnico e incidencias</p>
      </div>

      {/* Create form */}
      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 12, padding: 24, marginBottom: 28 }}>
        <h2 style={{ color: '#f8fafc', fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Nuevo ticket</h2>
        <form action={createTicket} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Título *</label>
              <input
                name="titulo"
                required
                placeholder="Problema o solicitud"
                style={{
                  width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
                  color: '#f8fafc', padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Prioridad *</label>
              <select
                name="prioridad"
                required
                defaultValue="media"
                style={{
                  width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
                  color: '#f8fafc', padding: '9px 12px', fontSize: 13, outline: 'none',
                }}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Proyecto</label>
              <select
                name="proyecto_id"
                style={{
                  width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
                  color: '#f8fafc', padding: '9px 12px', fontSize: 13, outline: 'none',
                }}
              >
                <option value="">Sin proyecto</option>
                {proyectosList.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Descripción *</label>
            <textarea
              name="descripcion"
              required
              rows={3}
              placeholder="Describe el problema con el máximo detalle posible"
              style={{
                width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
                color: '#f8fafc', padding: '9px 12px', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{
                background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Crear ticket
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div style={{ color: '#475569', textAlign: 'center', padding: '40px 0', fontSize: 14 }}>
          No tienes tickets abiertos. ¡Todo en orden! 🎉
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(t => (
            <div key={t.id} style={{
              background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 10, padding: '16px 20px',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.titulo}</div>
                <div style={{ color: '#64748b', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.descripcion}
                </div>
                <div style={{ color: '#475569', fontSize: 11, marginTop: 6 }}>
                  {new Date(t.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <span style={{
                  background: `${ESTADO_COLORS[t.estado]}1a`, color: ESTADO_COLORS[t.estado],
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                }}>{ESTADO_LABELS[t.estado]}</span>
                <span style={{
                  background: `${PRIORIDAD_COLORS[t.prioridad]}1a`, color: PRIORIDAD_COLORS[t.prioridad],
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, textTransform: 'capitalize',
                }}>{t.prioridad}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
