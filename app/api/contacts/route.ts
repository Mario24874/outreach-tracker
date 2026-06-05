import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase.from('contacts').select('*').eq('user_id', user.id).order('name');
    return NextResponse.json({ contacts: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, phone, company, email, industry, country } = await req.json();
    if (!name || !phone) return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });

    const { data, error } = await supabase.from('contacts').insert({
      user_id: user.id,
      name,
      phone,
      company: company ?? null,
      email: email ?? null,
      industry: industry ?? null,
      country: country ?? null,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, contact: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
