import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listTemplates } from '@/lib/whatsapp';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const metaData = await listTemplates();

    if (metaData.error) {
      return NextResponse.json({ error: metaData.error.message ?? 'Meta API error' }, { status: 400 });
    }

    const templates = metaData.data ?? [];
    let upserted = 0;

    for (const tpl of templates) {
      await supabase.from('wa_templates').upsert(
        {
          user_id: user.id,
          meta_template_name: tpl.name,
          language: tpl.language ?? 'es',
          category: tpl.category,
          status: tpl.status,
          components: tpl.components,
          synced_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,meta_template_name,language' }
      );
      upserted++;
    }

    return NextResponse.json({ success: true, synced: upserted });
  } catch (err: any) {
    console.error('[sync-templates]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
