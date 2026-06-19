import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE a conversation. ?contactId=<id> removes all messages for that contact
// (clear conversation). Add &deleteContact=true to also remove the contact
// (delete chat). RLS guarantees a user can only delete their own rows.
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const contactId = searchParams.get('contactId');
    const deleteContact = searchParams.get('deleteContact') === 'true';
    if (!contactId) return NextResponse.json({ error: 'Missing contactId' }, { status: 400 });

    const { error: msgErr } = await supabase
      .from('wa_messages')
      .delete()
      .eq('user_id', user.id)
      .eq('contact_id', contactId);
    if (msgErr) return NextResponse.json({ error: msgErr.message }, { status: 400 });

    if (deleteContact) {
      const { error: contactErr } = await supabase
        .from('contacts')
        .delete()
        .eq('user_id', user.id)
        .eq('id', contactId);
      if (contactErr) return NextResponse.json({ error: contactErr.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[conversations:delete]', err);
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 });
  }
}
