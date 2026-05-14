import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@/lib/gmail'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  const tokens = await exchangeCodeForTokens(code)

  // Show refresh token so user can copy it to env vars
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Gmail Auth</title>
<style>body{font-family:monospace;background:#020617;color:#f8fafc;padding:40px;max-width:600px}
h2{color:#a5b4fc}pre{background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:16px;overflow:auto;font-size:13px;color:#22c55e}
p{color:#94a3b8;font-size:13px}strong{color:#f8fafc}</style>
</head>
<body>
<h2>✓ Gmail autorizado</h2>
<p>Copia este <strong>refresh token</strong> y agrégalo como variable de entorno <code>GOOGLE_REFRESH_TOKEN</code> en Easypanel y en <code>.env.local</code>:</p>
<pre>${tokens.refresh_token ?? 'No refresh_token — vuelve a autorizar con prompt=consent'}</pre>
<p>También agrega:</p>
<pre>GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${process.env.GOOGLE_CLIENT_SECRET}
GOOGLE_REFRESH_TOKEN=${tokens.refresh_token ?? 'PEGA_EL_TOKEN_AQUI'}</pre>
<p>Una vez configurado, cierra esta ventana y recarga <a href="/messages" style="color:#a5b4fc">/messages</a>.</p>
</body>
</html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
