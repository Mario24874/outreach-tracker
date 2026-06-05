import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTextMessage, sendTemplateMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { to, message, templateName, languageCode, bodyParams, contactId } = body;

    if (!to) return NextResponse.json({ error: 'Missing recipient phone number' }, { status: 400 });

    let result: any;
    let msgType: string;
    let msgBody: string;

    if (templateName) {
      result = await sendTemplateMessage(to, templateName, languageCode ?? 'es', bodyParams ?? []);
      msgType = 'template';
      msgBody = templateName;
    } else {
      if (!message) return NextResponse.json({ error: 'Missing message body' }, { status: 400 });
      result = await sendTextMessage(to, message);
      msgType = 'text';
      msgBody = message;
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message ?? 'WhatsApp API error', details: result.error }, { status: 400 });
    }

    const wamid = result.messages?.[0]?.id;

    // Save to DB
    const msgData: any = {
      user_id: user.id,
      direction: 'outbound',
      type: msgType,
      body: msgBody,
      status: 'sent',
      phone_to: to,
      wamid,
    };
    if (contactId) msgData.contact_id = contactId;
    if (templateName) msgData.template_name = templateName;
    if (bodyParams) msgData.template_params = bodyParams;

    await supabase.from('wa_messages').insert(msgData);

    return NextResponse.json({ success: true, wamid });
  } catch (err: any) {
    console.error('[send]', err);
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
  }
}
