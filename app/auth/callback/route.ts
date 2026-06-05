import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Docker runs on 0.0.0.0:3000 internally — use forwarded headers from
  // Easypanel's reverse proxy to build the correct public URL.
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (forwardedHost ? `${forwardedProto}://${forwardedHost}` : 'https://app.mariomoreno.work');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${appUrl}${next}`);
    }
  }

  return NextResponse.redirect(`${appUrl}/login?error=auth_failed`);
}
