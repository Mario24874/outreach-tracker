import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listTemplates, createTemplate, deleteTemplate } from '@/lib/whatsapp';

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

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const name = req.nextUrl.searchParams.get('name');
    if (!name) return NextResponse.json({ error: 'Missing template name' }, { status: 400 });

    const result = await deleteTemplate(name);
    if (result.error) {
      return NextResponse.json({ error: result.error.message ?? 'Meta API error', details: result.error }, { status: 400 });
    }

    // Remove from local DB too
    await supabase
      .from('wa_templates')
      .delete()
      .eq('user_id', user.id)
      .eq('meta_template_name', name);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
