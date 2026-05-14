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
