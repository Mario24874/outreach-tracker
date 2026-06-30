import { NextRequest } from 'next/server';

/**
 * Verifica el secreto compartido con n8n.
 * Acepta header `x-webhook-secret`, `Authorization: Bearer <secret>` o `?secret=`.
 * Si N8N_WEBHOOK_SECRET no está configurado, NO bloquea (modo abierto para
 * arranque/pruebas); al definir el env se endurece sin tocar código.
 */
export function verifyWebhookSecret(req: NextRequest): boolean {
  const expected = process.env.N8N_WEBHOOK_SECRET;
  if (!expected) return true;
  const auth = req.headers.get('authorization') || '';
  const provided =
    req.headers.get('x-webhook-secret') ||
    (auth.startsWith('Bearer ') ? auth.slice(7) : '') ||
    new URL(req.url).searchParams.get('secret') ||
    '';
  return provided === expected;
}

const ALLOWED_ORIGINS = [
  'https://mariomoreno.work',
  'https://www.mariomoreno.work',
  'https://app.mariomoreno.work',
];

/** Cabeceras CORS para los endpoints de analítica (llamados desde el portfolio). */
export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Max-Age': '86400',
  };
}

const MAX = 2000;
export function clamp(v: unknown, max = MAX): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}
