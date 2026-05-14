export type OutreachLog = {
  id: string
  sent_at: string | null
  company: string | null
  to_email: string | null
  domain: string | null
  industry: string | null
  country: string | null
  website_url: string | null
  subject: string | null
  body_preview: string | null
  status: 'sent' | 'error' | null
  resend_id: string | null
  message: string | null
  has_reply: boolean | null
  replied_at: string | null
}

export type OutreachProspect = {
  id: string
  discovered_at: string
  company: string | null
  website_url: string | null
  domain: string | null
  email: string | null
  industry: string | null
  country: string | null
  status: 'pending' | 'contacted' | 'skipped'
}

export type ChartDay = {
  date: string
  count: number
}

export type ChartIndustry = {
  name: string
  value: number
}

export type WhatsAppMessage = {
  id: string
  direction: 'inbound' | 'outbound'
  from_number: string
  to_number: string
  contact_name: string | null
  message_type: string
  body: string | null
  wamid: string | null
  status: string
  raw_payload: Record<string, unknown> | null
  created_at: string
}

export type WhatsAppConversation = {
  contact_number: string
  contact_name: string | null
  messages: WhatsAppMessage[]
  last_message_at: string
  unread_count: number
}

export type GmailMessage = {
  id: string
  threadId: string
  from: string
  to: string
  subject: string
  snippet: string
  date: string
  body: string | null
  direction: 'sent' | 'received'
}

// ============================================================
// Portal / SaaS types
// ============================================================

export type UserRole = 'admin' | 'client'
export type UserStatus = 'active' | 'inactive' | 'pending'

export type PortalUser = {
  id: string
  clerk_user_id: string
  email: string
  full_name: string | null
  phone: string | null
  company: string | null
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

export type SolicitudTipo = 'cotizacion' | 'requerimiento' | 'implementacion' | 'cambio' | 'automatizacion' | 'desarrollo' | 'otro'
export type SolicitudEstado = 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'en_progreso' | 'completada'

export type Solicitud = {
  id: string
  user_id: string
  tipo: SolicitudTipo
  titulo: string
  descripcion: string | null
  estado: SolicitudEstado
  presupuesto_estimado: number | null
  notas_admin: string | null
  created_at: string
  updated_at: string
}

export type ProyectoEstado = 'planificacion' | 'en_progreso' | 'pausado' | 'completado' | 'cancelado'

export type Proyecto = {
  id: string
  user_id: string
  solicitud_id: string | null
  nombre: string
  tipo: string
  descripcion: string | null
  estado: ProyectoEstado
  sprint_actual: number
  sprints_total: number
  presupuesto_total: number | null
  pago_inicial: number | null
  pago_inicial_recibido: boolean
  fecha_inicio: string | null
  fecha_entrega_estimada: string | null
  created_at: string
  updated_at: string
}

export type TicketPrioridad = 'baja' | 'media' | 'alta' | 'critica'
export type TicketEstado = 'abierto' | 'en_progreso' | 'resuelto' | 'cerrado'

export type Ticket = {
  id: string
  user_id: string
  proyecto_id: string | null
  titulo: string
  descripcion: string
  prioridad: TicketPrioridad
  estado: TicketEstado
  created_at: string
  updated_at: string
}

export type MensajeCanal = 'chat' | 'email' | 'whatsapp'
export type MensajeRemitente = 'cliente' | 'admin'

export type Mensaje = {
  id: string
  user_id: string
  proyecto_id: string | null
  canal: MensajeCanal
  remitente: MensajeRemitente
  contenido: string
  leido: boolean
  created_at: string
}

// ============================================================

export type GmailThread = {
  id: string
  subject: string
  prospect_email: string
  prospect_name: string | null
  snippet: string
  messages: GmailMessage[]
  last_message_at: string
  has_reply: boolean
}
