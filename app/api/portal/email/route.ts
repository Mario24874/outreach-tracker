import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

const TO = 'info@mariomoreno.work'
const FROM = 'MarioOS Portal <noreply@mariomoreno.work>'
const MAX_BYTES = 25 * 1024 * 1024

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data: user } = await supabase
    .from('users')
    .select('email, full_name')
    .eq('clerk_user_id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const form = await req.formData()
  const subject = (form.get('subject') as string | null)?.trim()
  const body    = (form.get('body')    as string | null)?.trim()
  const cc      = (form.get('cc')      as string | null)?.trim()

  if (!subject || !body) {
    return NextResponse.json({ error: 'Asunto y mensaje son requeridos' }, { status: 400 })
  }

  const rawFiles = form.getAll('files') as File[]
  const validFiles = rawFiles.filter(f => f.size > 0)

  const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0)
  if (totalSize > MAX_BYTES) {
    return NextResponse.json({ error: 'Los adjuntos superan el límite de 25 MB' }, { status: 413 })
  }

  const attachments = await Promise.all(
    validFiles.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()),
    }))
  )

  const ccList = cc ? cc.split(',').map(e => e.trim()).filter(Boolean) : undefined
  const senderLabel = user.full_name ? `${user.full_name} <${user.email}>` : user.email

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    replyTo: user.email,
    ...(ccList?.length ? { cc: ccList } : {}),
    subject: `[Portal] ${subject}`,
    text: `De: ${senderLabel}\n\n${body}`,
    html: `<p><strong>De:</strong> ${senderLabel}</p><hr/><div style="white-space:pre-wrap">${body.replace(/</g,'&lt;')}</div>`,
    ...(attachments.length ? { attachments } : {}),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
