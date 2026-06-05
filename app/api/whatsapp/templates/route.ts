import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listTemplates, createTemplate } from '@/lib/whatsapp';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: templates } = await supabase
      .from('wa_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('meta_template_name');

    return NextResponse.json({ templates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, category, language, components } = await req.json();
    if (!name || !category || !language || !components) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createTemplate(name, category, language, components);

    if (result.error) {
      return NextResponse.json({ error: result.error.message ?? 'Meta API error', details: result.error }, { status: 400 });
    }

    // Save to DB as PENDING
    await supabase.from('wa_templates').insert({
      user_id: user.id,
      meta_template_name: name,
      language,
      category,
      status: 'PENDING',
      components,
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
