import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listTemplates, createTemplate, deleteTemplate } from '@/lib/whatsapp';

// Meta returns a generic "Invalid parameter" message plus a human-friendly
// error_user_title/error_user_msg explaining the real cause. Surface the
// friendly one so the UI shows e.g. "El nombre solo puede contener…" instead
// of an opaque error.
function metaErrorMessage(e: any): string {
  if (!e) return 'Meta API error';
  if (e.error_user_msg) {
    return e.error_user_title ? `${e.error_user_title}: ${e.error_user_msg}` : e.error_user_msg;
  }
  return e.message ?? 'Meta API error';
}

// Templates with {{n}} placeholders require example values, or Meta rejects
// them. Auto-fill placeholder examples for BODY/HEADER text components.
function withExamples(components: any[]): any[] {
  return (components ?? []).map((c) => {
    const matches = (c?.text ?? '').match(/\{\{(\d+)\}\}/g) ?? [];
    if (matches.length === 0) return c;
    const samples = matches.map((_: string, i: number) => `ejemplo${i + 1}`);
    if (c.type === 'BODY') return { ...c, example: { body_text: [samples] } };
    if (c.type === 'HEADER') return { ...c, example: { header_text: samples } };
    return c;
  });
}

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

    const result = await createTemplate(name, category, language, withExamples(components));

    if (result.error) {
      return NextResponse.json({ error: metaErrorMessage(result.error), details: result.error }, { status: 400 });
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
      return NextResponse.json({ error: metaErrorMessage(result.error), details: result.error }, { status: 400 });
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
