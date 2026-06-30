import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Lista blanca de correos con acceso al portal /admin.
 * Configurable por env ADMIN_EMAILS (CSV); por defecto solo el owner.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || 'marioivanmorenopineda@gmail.com')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && adminEmails().includes(email.toLowerCase());
}

/** Devuelve el user autenticado solo si su correo está en la allowlist; si no, null. */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return isAdminEmail(user?.email) ? user : null;
}

/** Guard server-side para páginas /admin. Redirige a /login si no es el owner. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect('/login?next=/admin');
  return user;
}
