import { getPortalUser } from '@/lib/portal-user'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Solicitud, SolicitudTipo } from '@/lib/types'

const TIPOS: { value: SolicitudTipo; label: string }[] = [
  { value: 'cotizacion', label: 'Cotización' },
  { value: 'requerimiento', label: 'Requerimiento' },
  { value: 'implementacion', label: 'Implementación' },
  { value: 'cambio', label: 'Cambio' },
  { value: 'automatizacion', label: 'Automatización' },
  { value: 'desarrollo', label: 'Desarrollo' },
  { value: 'otro', label: 'Otro' },
]

const ESTADO_COLORS: Record<string, string> = {
  pendiente: '#f59e0b',
  en_revision: '#6366f1',
  aprobada: '#22d3ee',
  rechazada: '#f87171',
  en_progreso: '#34d399',
  completada: '#94a3b8',
}

const ESTADO_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  en_revision: 'En revisión',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  en_progreso: 'En progreso',
  completada: 'Completada',
}

async function createSolicitud(formData: FormData) {
  'use server'
  const user = await getPortalUser()
  if (!user) return

  const supabase = createAdminClient()
  await supabase.from('solicitudes').insert({
    user_id: user.id,
    tipo: formData.get('tipo') as SolicitudTipo,
    titulo: formData.get('titulo') as string,
    descripcion: formData.get('descripcion') as string || null,
  })
  revalidatePath('/portal/solicitudes')
}

export default async function SolicitudesPage() {
  const user = await getPortalUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()
  const { data: solicitudes } = await supabase
    .from('solicitudes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = (solicitudes ?? []) as Solicitud[]

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#f8fafc', fontSize: 20, fontWeight: 700, margin: 0 }}>Solicitudes</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Cotizaciones, requerimientos y desarrollos</p>
      </div>

      {/* Create form */}
      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 12, padding: 24, marginBottom: 28 }}>
        <h2 style={{ color: '#f8fafc', fontSize: 14, fontWeight: 600, margin: '0 0 16px' }}>Nueva solicitud</h2>
        <form action={createSolicitud} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Tipo *</label>
              <select
                name="tipo"
                required
                style={{
                  width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
                  color: '#f8fafc', padding: '9px 12px', fontSize: 13, outline: 'none',
                }}
              >
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Título *</label>
              <input
                name="titulo"
                required
                placeholder="Describe brevemente tu solicitud"
                style={{
                  width: '100%', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
                  color: '#f8fafc', padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6 }}>Descripción</label>
            <textarea
              name="descripcion"
              rows={3}
              placeholder="Detalla lo que necesitas, alcance, plazos, etc."
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
              Enviar solicitud
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div style={{ color: '#475569', textAlign: 'center', padding: '40px 0', fontSize: 14 }}>
          No tienes solicitudes aún. Crea tu primera arriba.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(s => (
            <div key={s.id} style={{
              background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 10, padding: '16px 20px',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    background: '#6366f11a', color: '#a5b4fc', fontSize: 10, fontWeight: 600,
                    padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{TIPOS.find(t => t.value === s.tipo)?.label ?? s.tipo}</span>
                </div>
                <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 600 }}>{s.titulo}</div>
                {s.descripcion && (
                  <div style={{ color: '#64748b', fontSize: 12, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.descripcion}
                  </div>
                )}
                <div style={{ color: '#475569', fontSize: 11, marginTop: 6 }}>
                  {new Date(s.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span style={{
                  background: `${ESTADO_COLORS[s.estado]}1a`,
                  color: ESTADO_COLORS[s.estado],
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                }}>
                  {ESTADO_LABELS[s.estado]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
