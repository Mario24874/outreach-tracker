import { loadMetrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin · Métricas', robots: { index: false, follow: false } };

function fmtDur(s: number): string {
  if (!s) return '0s';
  const m = Math.floor(s / 60);
  if (m < 1) return `${s}s`;
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
function fmtDate(v: unknown): string {
  if (!v || typeof v !== 'string') return '—';
  const d = new Date(v);
  return isNaN(+d) ? '—' : d.toLocaleString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function pick(o: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (v !== undefined && v !== null && v !== '') return String(v);
  }
  return '—';
}
const truthy = (v: unknown) => v === true || v === 'true' || v === 1;

const CARD: React.CSSProperties = { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 };
const TH: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #1e293b' };
const TD: React.CSSProperties = { padding: '8px 10px', color: '#cbd5e1', fontSize: 12.5, borderBottom: '1px solid #131c31', verticalAlign: 'top' };

export default async function AdminMetricsPage() {
  const m = await loadMetrics(30);
  const maxDay = Math.max(1, ...m.visitsByDay.map((d) => d.visits));
  const totalArea = m.byArea.reduce((s, a) => s + a.visits, 0) || 1;
  const maxFunnel = Math.max(1, ...m.funnel.map((f) => f.value));

  const kpis = [
    { label: 'Visitas (30d)', value: m.visitsTotal, color: '#60a5fa', icon: '👁️' },
    { label: 'Visitantes únicos', value: m.uniqueVisitors, color: '#34d399', icon: '🧑' },
    { label: 'Demos probados', value: m.demosTotal, color: '#a78bfa', icon: '🤖' },
    { label: 'Tiempo medio', value: fmtDur(m.avgSeconds), color: '#fbbf24', icon: '⏱️' },
    { label: 'Leads scrapeados', value: m.leadsTotal, color: '#22d3ee', icon: '📍' },
    { label: 'Emails enviados', value: m.emailsSent, color: '#f472b6', icon: '✉️' },
    { label: 'Respuestas', value: m.replies, color: '#4ade80', icon: '↩️' },
    { label: 'Contactos directos', value: m.contactsTotal, color: '#fb923c', icon: '📨' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 2px' }}>Métricas de tráfico, leads y solicitudes</h1>
      <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Últimos 30 días · portfolio + app + scraping n8n</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={CARD}>
            <div style={{ fontSize: 18 }}>{k.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color, marginTop: 6 }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* Visitas por día */}
        <div style={CARD}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: '0 0 14px' }}>Visitas por día</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 110 }}>
            {m.visitsByDay.map((d) => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div title={`${d.visits}`} style={{ width: '100%', height: `${(d.visits / maxDay) * 90}px`, minHeight: 2, background: '#6366f1', borderRadius: 3 }} />
                <span style={{ fontSize: 9, color: '#475569', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Embudo outreach */}
        <div style={CARD}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: '0 0 14px' }}>Embudo de outreach</h3>
          {m.funnel.map((f) => (
            <div key={f.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
                <span>{f.label}</span><span style={{ color: '#e2e8f0', fontWeight: 600 }}>{f.value}</span>
              </div>
              <div style={{ height: 6, background: '#131c31', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${(f.value / maxFunnel) * 100}%`, background: '#22d3ee', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Por área + secciones */}
        <div style={CARD}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: '0 0 14px' }}>Por destino y sección</h3>
          {m.byArea.map((a) => (
            <div key={a.area} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>
                <span style={{ textTransform: 'capitalize' }}>{a.area}</span><span>{Math.round((a.visits / totalArea) * 100)}%</span>
              </div>
              <div style={{ height: 6, background: '#131c31', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${(a.visits / totalArea) * 100}%`, background: '#34d399', borderRadius: 4 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #1e293b' }}>
            {m.topSections.length === 0 ? (
              <p style={{ fontSize: 12, color: '#475569' }}>Sin datos aún</p>
            ) : (
              m.topSections.map((s) => (
                <div key={s.section} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', padding: '2px 0' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{s.section}</span>
                  <span style={{ color: '#64748b' }}>{s.visits}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Correos recibidos (quién escribió + mensaje) */}
      <Section title="Correos recibidos (respuestas a outreach)">
        <Table
          head={['De', 'Asunto', 'Mensaje', 'Fecha']}
          rows={m.recentEmails.map((e) => [
            `${pick(e, 'from_name')} · ${pick(e, 'from_email')}`,
            pick(e, 'subject'),
            pick(e, 'body_preview').slice(0, 140),
            fmtDate(e.received_at ?? e.created_at),
          ])}
          empty="Aún no llegan respuestas (el webhook /api/webhook/email las guardará aquí)."
        />
      </Section>

      {/* Contactos directos del portfolio */}
      <Section title="Solicitudes directas (formulario del portfolio)">
        <Table
          head={['Nombre', 'Email / Tel', 'Mensaje', 'Fecha']}
          rows={m.recentContacts.map((c) => [
            pick(c, 'name'),
            `${pick(c, 'email')} ${pick(c, 'phone') !== '—' ? '· ' + pick(c, 'phone') : ''}`,
            pick(c, 'message').slice(0, 140),
            fmtDate(c.created_at),
          ])}
          empty="Sin solicitudes directas todavía."
        />
      </Section>

      {/* Leads scrapeados */}
      <Section title="Leads scrapeados (n8n · outreach_log)">
        <Table
          head={['Negocio', 'Email', 'Búsqueda', 'Respondió', 'Fecha']}
          rows={m.recentLeads.map((l) => [
            pick(l, 'business_name', 'name', 'title'),
            pick(l, 'email'),
            pick(l, 'query', 'search', 'keyword'),
            truthy(l.has_reply) ? '✅' : '—',
            fmtDate(l.created_at ?? l.sent_at),
          ])}
          empty="Sin leads aún o outreach_log no accesible desde este proyecto."
        />
      </Section>

      {/* Visitas anónimas recientes */}
      <Section title="Visitas anónimas recientes">
        <Table
          head={['Anon', 'Destino', 'Ruta', 'Origen', 'Tiempo', 'Fecha']}
          rows={m.recentVisits.map((v) => [
            String(v.anon_id ?? '').slice(0, 8),
            String(v.area ?? ''),
            pick(v, 'path'),
            pick(v, 'referrer').slice(0, 40),
            fmtDur((v.duration_seconds as number) || 0),
            fmtDate(v.entered_at),
          ])}
          empty="Aún no hay visitas registradas (instala el tracker en el portfolio)."
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ ...CARD, marginBottom: 16, padding: 0, overflow: 'hidden' }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: 0, padding: '14px 16px', borderBottom: '1px solid #1e293b' }}>{title}</h3>
      {children}
    </div>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: string[][]; empty: string }) {
  if (rows.length === 0) return <p style={{ padding: 16, fontSize: 12.5, color: '#475569' }}>{empty}</p>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>{head.map((h) => <th key={h} style={TH}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} style={TD}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
