import { getPortalUser } from '@/lib/portal-user'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { FileText, Layers, TicketCheck, MessageCircle } from 'lucide-react'

export default async function PortalPage() {
  const user = await getPortalUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()

  const [{ count: solicitudesCount }, { count: proyectosCount }, { count: ticketsCount }, { count: mensajesCount }] =
    await Promise.all([
      supabase.from('solicitudes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('proyectos').select('*', { count: 'exact', head: true }).eq('user_id', user.id).neq('estado', 'completado'),
      supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('estado', 'abierto'),
      supabase.from('mensajes').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('leido', false).eq('remitente', 'admin'),
    ])

  const kpis = [
    { label: 'Solicitudes', value: solicitudesCount ?? 0, icon: FileText, color: '#6366f1', href: '/portal/solicitudes' },
    { label: 'Proyectos activos', value: proyectosCount ?? 0, icon: Layers, color: '#22d3ee', href: '/portal/proyectos' },
    { label: 'Tickets abiertos', value: ticketsCount ?? 0, icon: TicketCheck, color: '#f59e0b', href: '/portal/tickets' },
    { label: 'Mensajes no leídos', value: mensajesCount ?? 0, icon: MessageCircle, color: '#34d399', href: '/portal/chat' },
  ]

  const greeting = user.full_name ? `Hola, ${user.full_name.split(' ')[0]}` : 'Bienvenido'

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: '#f8fafc', fontSize: 22, fontWeight: 700, margin: 0 }}>{greeting} 👋</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Resumen de tu cuenta en Mario Moreno Tech</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {kpis.map(({ label, value, icon: Icon, color, href }) => (
          <a key={label} href={href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 12, padding: '20px 22px',
              display: 'flex', alignItems: 'center', gap: 16,
              transition: 'border-color 0.15s',
            }}
              className="hover:border-indigo-500/50"
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: `${color}1a`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ color: '#f8fafc', fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{value}</div>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{label}</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ background: '#0a0f1f', border: '1px solid #1e293b', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ color: '#f8fafc', fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>¿Qué puedo hacer aquí?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '📋', text: 'Crear una solicitud de cotización, desarrollo o automatización' },
            { icon: '📊', text: 'Ver el estado y avance de tus proyectos por sprint' },
            { icon: '🎫', text: 'Abrir tickets de soporte o reportar incidencias' },
            { icon: '💬', text: 'Chatear en tiempo real o enviar mensajes vía WhatsApp / email' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
