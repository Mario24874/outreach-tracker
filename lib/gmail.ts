import { google } from 'googleapis'
import type { GmailMessage, GmailThread } from './types'

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail/callback`
  )
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
  }
  return client
}

export function getGmailAuthUrl(): string {
  const client = getOAuth2Client()
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  })
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuth2Client()
  const { tokens } = await client.getToken(code)
  return tokens
}

function decodeBase64(str: string): string {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
}

function extractBody(payload: Record<string, unknown>): string | null {
  const p = payload as {
    mimeType?: string
    body?: { data?: string }
    parts?: unknown[]
  }
  if (p.body?.data) return decodeBase64(p.body.data)
  if (p.parts && Array.isArray(p.parts)) {
    for (const part of p.parts as Record<string, unknown>[]) {
      const b = extractBody(part)
      if (b) return b
    }
  }
  return null
}

function parseHeader(headers: { name: string; value: string }[], name: string): string {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? ''
}

export async function getGmailThreads(prospectEmails?: string[]): Promise<GmailThread[]> {
  if (!process.env.GOOGLE_REFRESH_TOKEN) return []

  try {
    const auth = getOAuth2Client()
    const gmail = google.gmail({ version: 'v1', auth })

    // Simple query: threads that have sent messages, optionally filtered by prospect emails
    const q = prospectEmails?.length
      ? prospectEmails.map(e => `{to:${e} from:${e}}`).join(' OR ')
      : 'in:sent'

    const listRes = await gmail.users.threads.list({
      userId: 'me',
      maxResults: 30,
      q,
    })

  const threadItems = listRes.data.threads ?? []
  const threads: GmailThread[] = []

  await Promise.all(
    threadItems.map(async (t) => {
      if (!t.id) return
      const threadRes = await gmail.users.threads.get({
        userId: 'me',
        id: t.id,
        format: 'full',
      })

      const msgs: GmailMessage[] = []
      const rawMessages = threadRes.data.messages ?? []

      for (const msg of rawMessages) {
        const headers = (msg.payload?.headers ?? []) as { name: string; value: string }[]
        const from = parseHeader(headers, 'From')
        const to = parseHeader(headers, 'To')
        const subject = parseHeader(headers, 'Subject')
        const date = parseHeader(headers, 'Date')
        const labelIds = msg.labelIds ?? []
        const direction: 'sent' | 'received' = labelIds.includes('SENT') ? 'sent' : 'received'

        msgs.push({
          id: msg.id ?? '',
          threadId: t.id,
          from,
          to,
          subject,
          snippet: msg.snippet ?? '',
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
          body: msg.payload ? extractBody(msg.payload as Record<string, unknown>) : null,
          direction,
        })
      }

      if (msgs.length === 0) return

      const first = msgs[0]
      const prospectEmail = first.direction === 'sent'
        ? first.to.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] ?? first.to
        : first.from.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] ?? first.from
      const prospectName = first.direction === 'sent'
        ? first.to.split('<')[0].trim().replace(/"/g, '') || null
        : first.from.split('<')[0].trim().replace(/"/g, '') || null

      threads.push({
        id: t.id,
        subject: first.subject,
        prospect_email: prospectEmail,
        prospect_name: prospectName || null,
        snippet: msgs[msgs.length - 1].snippet,
        messages: msgs,
        last_message_at: msgs[msgs.length - 1].date,
        has_reply: msgs.some(m => m.direction === 'received'),
      })
    })
  )

    return threads.sort((a, b) =>
      new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    )
  } catch (err) {
    console.error('[gmail] getGmailThreads error:', err)
    return []
  }
}
