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
