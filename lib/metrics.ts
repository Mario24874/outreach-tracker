import { createServiceClient } from '@/lib/supabase/server';

export interface Metrics {
  rangeDays: number;
  visitsTotal: number;
  uniqueVisitors: number;
  avgSeconds: number;
  byArea: { area: string; visits: number }[];
  topSections: { section: string; visits: number }[];
  visitsByDay: { day: string; visits: number }[];
  demosTotal: number;
  demosByType: { demo: string; count: number }[];
  leadsTotal: number;
  emailsSent: number;
  replies: number;
  contactsTotal: number;
  funnel: { label: string; value: number }[];
  recentLeads: Record<string, unknown>[];
  recentEmails: Record<string, unknown>[];
  recentContacts: Record<string, unknown>[];
  recentVisits: Record<string, unknown>[];
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

/** Carga y agrega todas las métricas del portal admin en una sola pasada. */
export async function loadMetrics(rangeDays = 30): Promise<Metrics> {
  const supabase = await createServiceClient();
  const fromISO = new Date(Date.now() - rangeDays * 86400_000).toISOString();

  // outreach_log lo escribe n8n; puede vivir en el mismo proyecto Supabase.
  // Si no existe / no es accesible, degradamos a vacío sin romper el panel.
  const safe = async <T>(p: PromiseLike<{ data: T | null }>): Promise<T> => {
    try {
      const { data } = await p;
      return (data ?? []) as T;
    } catch {
      return [] as unknown as T;
    }
  };

  const [views, demos, emails, contacts, leads] = await Promise.all([
    safe<Record<string, unknown>[]>(
      supabase
        .from('page_views')
        .select('anon_id, area, section, path, referrer, duration_seconds, entered_at')
        .gte('entered_at', fromISO)
        .order('entered_at', { ascending: false })
        .limit(10000)
    ),
    safe<Record<string, unknown>[]>(
      supabase.from('demo_runs').select('demo, input_preview, created_at').gte('created_at', fromISO).limit(5000)
    ),
    safe<Record<string, unknown>[]>(
      supabase.from('email_events').select('*').order('received_at', { ascending: false }).limit(200)
    ),
    safe<Record<string, unknown>[]>(
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(200)
    ),
    safe<Record<string, unknown>[]>(
      supabase.from('outreach_log').select('*').order('created_at', { ascending: false }).limit(2000)
    ),
  ]);

  // ---- Visitas ----
  const uniq = new Set(views.map((v) => v.anon_id as string));
  const durations = views.map((v) => (v.duration_seconds as number) || 0).filter((d) => d > 0);
  const avgSeconds = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const areaMap = new Map<string, number>();
  const sectionMap = new Map<string, number>();
  const dayMap = new Map<string, number>();
  for (const v of views) {
    areaMap.set(v.area as string, (areaMap.get(v.area as string) ?? 0) + 1);
    const sec = (v.section as string) || (v.path as string) || 'Otras';
    sectionMap.set(sec, (sectionMap.get(sec) ?? 0) + 1);
    const d = dayKey(v.entered_at as string);
    dayMap.set(d, (dayMap.get(d) ?? 0) + 1);
  }

  const visitsByDay: { day: string; visits: number }[] = [];
  for (let i = Math.min(rangeDays, 14) - 1; i >= 0; i--) {
    const d = dayKey(new Date(Date.now() - i * 86400_000).toISOString());
    visitsByDay.push({ day: d.slice(5), visits: dayMap.get(d) ?? 0 });
  }

  // ---- Demos ----
  const demoMap = new Map<string, number>();
  for (const d of demos) demoMap.set(d.demo as string, (demoMap.get(d.demo as string) ?? 0) + 1);

  // ---- Outreach (leads) ----
  const truthy = (v: unknown) => v === true || v === 'true' || v === 1;
  const leadsTotal = leads.length;
  const emailsSent = leads.filter((l) => truthy(l.email_sent) || l.sent_at || l.email).length || leadsTotal;
  const replies = leads.filter((l) => truthy(l.has_reply)).length + emails.length;

  return {
    rangeDays,
    visitsTotal: views.length,
    uniqueVisitors: uniq.size,
    avgSeconds,
    byArea: Array.from(areaMap, ([area, visits]) => ({ area, visits })).sort((a, b) => b.visits - a.visits),
    topSections: Array.from(sectionMap, ([section, visits]) => ({ section, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 8),
    visitsByDay,
    demosTotal: demos.length,
    demosByType: Array.from(demoMap, ([demo, count]) => ({ demo, count })).sort((a, b) => b.count - a.count),
    leadsTotal,
    emailsSent,
    replies,
    contactsTotal: contacts.length,
    funnel: [
      { label: 'Leads scrapeados', value: leadsTotal },
      { label: 'Emails enviados', value: emailsSent },
      { label: 'Respuestas', value: replies },
      { label: 'Contactos directos', value: contacts.length },
    ],
    recentLeads: leads.slice(0, 25),
    recentEmails: emails.slice(0, 25),
    recentContacts: contacts.slice(0, 25),
    recentVisits: views.slice(0, 30),
  };
}
