// Admin screens: shared shell + Dashboard + CRM Kanban

const { MOSLogo, MOSWordmark, MOSCard, MOSButton, MOSBadge, MOSAvatar, Icons, Sparkline, BarChart, Donut, INDUSTRY_TONE, industryTone } = window;

// ============ SIDEBAR ============
const AdminSidebar = ({ active = 'dashboard', expanded = true }) => {
  const items = [
    { id: 'dashboard', i: <Icons.Dashboard size={18}/>, l: 'Dashboard' },
    { id: 'crm',       i: <Icons.Users size={18}/>,     l: 'Clientes & CRM', badge: 48 },
    { id: 'outreach',  i: <Icons.Mail size={18}/>,      l: 'Outreach' },
    { id: 'whatsapp',  i: <Icons.Whatsapp size={18}/>,  l: 'WhatsApp', badge: 3 },
    { id: 'projects',  i: <Icons.Folder size={18}/>,    l: 'Proyectos' },
  ];
  const w = expanded ? 240 : 64;
  return (
    <div style={{
      width: w, flexShrink: 0, height: '100%',
      background: '#0a0f1f', borderRight: '1px solid #1e293b',
      display: 'flex', flexDirection: 'column',
      transition: 'width .2s ease',
    }}>
      {/* Brand */}
      <div style={{
        padding: expanded ? '18px 18px' : '18px 12px', borderBottom: '1px solid #1e293b',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <MOSLogo size={30}/>
        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>MarioOS</span>
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>Admin</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
        {expanded && <div style={navHeader}>Workspace</div>}
        {items.map(it => (
          <div key={it.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: expanded ? '10px 12px' : '10px',
            borderRadius: 9, cursor: 'pointer',
            background: active === it.id ? 'rgba(99,102,241,0.12)' : 'transparent',
            color: active === it.id ? '#a5b4fc' : '#94a3b8',
            position: 'relative',
            justifyContent: expanded ? 'flex-start' : 'center',
          }}>
            {active === it.id && (
              <span style={{
                position: 'absolute', left: 0, top: 8, bottom: 8, width: 2,
                background: '#6366f1', borderRadius: 2,
                boxShadow: '0 0 6px #6366f1',
              }}/>
            )}
            {it.i}
            {expanded && <>
              <span style={{ fontSize: 13, fontWeight: active === it.id ? 600 : 500 }}>{it.l}</span>
              {it.badge && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                  padding: '2px 6px', borderRadius: 6,
                  background: active === it.id ? 'rgba(99,102,241,0.3)' : '#1e293b',
                  color: active === it.id ? '#a5b4fc' : '#94a3b8',
                }}>{it.badge}</span>
              )}
            </>}
          </div>
        ))}
        {expanded && <div style={{ ...navHeader, marginTop: 18 }}>Cuenta</div>}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: expanded ? '10px 12px' : '10px', borderRadius: 9,
          color: '#94a3b8', cursor: 'pointer',
          justifyContent: expanded ? 'flex-start' : 'center',
        }}>
          <Icons.Settings size={18}/>
          {expanded && <span style={{ fontSize: 13, fontWeight: 500 }}>Configuración</span>}
        </div>
      </div>

      {/* User */}
      <div style={{
        padding: expanded ? '14px 14px' : '12px', borderTop: '1px solid #1e293b',
        display: 'flex', alignItems: 'center', gap: 10,
        justifyContent: expanded ? 'flex-start' : 'center',
      }}>
        <MOSAvatar name="Mario Moreno" size={32}/>
        {expanded && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Mario Moreno</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>Admin · sistema activo</div>
          </div>
        )}
        {expanded && (
          <span style={{
            width: 7, height: 7, borderRadius: 4,
            background: '#22c55e', boxShadow: '0 0 8px #22c55e',
          }}/>
        )}
      </div>
    </div>
  );
};
const navHeader = {
  fontSize: 10, color: '#475569', fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  padding: '8px 12px 6px',
};
window.AdminSidebar = AdminSidebar;

// ============ ADMIN HEADER ============
const AdminHeader = ({ title, subtitle, active = true, actions = null }) => (
  <div style={{
    height: 68, padding: '0 28px', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: '1px solid #1e293b',
  }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em' }}>{title}</h1>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: active ? '#86efac' : '#64748b', fontWeight: 600,
          padding: '3px 8px', borderRadius: 999,
          background: active ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.12)',
          boxShadow: active ? 'inset 0 0 0 1px rgba(34,197,94,0.3)' : 'inset 0 0 0 1px #1e293b',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 3,
            background: active ? '#22c55e' : '#64748b',
            boxShadow: active ? '0 0 8px #22c55e' : 'none',
          }}/>
          {active ? 'Sistema activo' : 'Sin actividad'}
        </span>
      </div>
      {subtitle && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{subtitle}</div>}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
        padding: '8px 12px', width: 260,
      }}>
        <Icons.Search size={14} color="#64748b"/>
        <input placeholder="Buscar clientes, emails…" style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: '#f8fafc', fontSize: 12, fontFamily: 'inherit',
        }}/>
        <span style={{ fontSize: 9, color: '#475569', padding: '2px 5px', borderRadius: 4, background: '#1e293b' }}>⌘K</span>
      </div>
      <button style={{
        width: 38, height: 38, borderRadius: 9,
        background: '#0f172a', border: '1px solid #1e293b', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        <Icons.Bell size={16} color="#94a3b8"/>
        <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 4, background: '#ef4444' }}/>
      </button>
      {actions}
    </div>
  </div>
);
window.AdminHeader = AdminHeader;

// ============ ADMIN DASHBOARD ============
const ScreenAdminDash = () => {
  const sparkA = [12, 18, 14, 22, 28, 24, 32, 38, 36, 42, 48, 54, 58, 62];
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: '#020617', color: '#f8fafc', fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      <AdminSidebar active="dashboard"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminHeader title="Dashboard" subtitle="Resumen de actividad · semana del 6 al 12 de mayo"
          actions={<MOSButton variant="primary" size="md" leftIcon={<Icons.Plus size={14}/>}>Nuevo envío</MOSButton>}/>

        <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          {/* Bento grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: '160px 200px 180px',
            gap: 16,
          }}>
            {/* Big KPI: emails this week */}
            <MOSCard glow style={{ gridColumn: 'span 2', gridRow: 'span 1' }} padding={22}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    <div style={kpiLabel}>Emails enviados · esta semana</div>
                    <div style={{
                      fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1,
                      background: 'linear-gradient(180deg, #f8fafc, #a5b4fc)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      marginTop: 8,
                    }}>347</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ color: '#86efac', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icons.TrendUp size={14}/> +28%
                    </span>
                    <span style={{ color: '#64748b' }}>vs. semana anterior</span>
                  </div>
                </div>
                <Sparkline data={sparkA} width={180} height={90}/>
              </div>
            </MOSCard>

            {/* KPI cards */}
            <MOSCard padding={18}>
              <div style={kpiLabel}>Clientes activos</div>
              <div style={kpiBig}>12</div>
              <div style={{ display: 'flex', gap: -8, marginTop: 8 }}>
                {['Laura','Carlos','Ana','David'].map((n,i) => (
                  <div key={n} style={{ marginLeft: i ? -8 : 0 }}>
                    <MOSAvatar name={n} size={22} ring/>
                  </div>
                ))}
                <span style={{
                  marginLeft: -8, width: 22, height: 22, borderRadius: 11,
                  background: '#0f172a', border: '2px solid #0f172a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#94a3b8', fontWeight: 700,
                  boxShadow: 'inset 0 0 0 1px #334155',
                }}>+8</span>
              </div>
            </MOSCard>

            <MOSCard padding={18}>
              <div style={kpiLabel}>Leads en pipeline</div>
              <div style={kpiBig}>48</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
                <span style={{ color: '#fcd34d', fontWeight: 700 }}>11</span> calientes ·
                <span style={{ color: '#a5b4fc', fontWeight: 700 }}>23</span> tibios
              </div>
            </MOSCard>

            {/* World map */}
            <MOSCard glow style={{ gridColumn: 'span 2', gridRow: 'span 2' }} padding={22}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={kpiLabel}>Mapa de actividad</div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>Leads por país en los últimos 30 días</div>
                </div>
                <MOSBadge tone="indigo" dot>14 países</MOSBadge>
              </div>
              <WorldMap/>
              <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
                {[
                  ['🇲🇽 México', 18, 'indigo'],
                  ['🇪🇸 España', 12, 'cyan'],
                  ['🇨🇴 Colombia', 9, 'green'],
                  ['🇦🇷 Argentina', 6, 'amber'],
                  ['🇨🇱 Chile', 3, 'rose'],
                ].map(([l, v, t]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
                    <span style={{ width: 7, height: 7, borderRadius: 4, background: `var(--c-${t}, #6366f1)` }}/>
                    {l} · <span style={{ color: '#f8fafc', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </MOSCard>

            {/* Tasa respuesta */}
            <MOSCard padding={18}>
              <div style={kpiLabel}>Tasa de respuesta</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 6 }}>
                <div style={kpiBig}>23<span style={{ fontSize: 18, color: '#64748b' }}>%</span></div>
                <Donut segments={[
                  { value: 23, color: '#6366f1' },
                  { value: 12, color: '#06b6d4' },
                  { value: 65, color: '#1e293b' },
                ]} size={64} thickness={10}/>
              </div>
              <div style={{ fontSize: 11, color: '#86efac', marginTop: 6 }}>+3.4% sobre baseline</div>
            </MOSCard>

            {/* Próxima ejecución */}
            <MOSCard padding={18}>
              <div style={kpiLabel}>Próximo envío</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icons.Clock size={16} color="#a5b4fc"/>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>mar · 09:00</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Batch dental clínicas · 80 contactos</div>
                </div>
              </div>
              <div style={{ marginTop: 10, height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: '#6366f1' }}/>
              </div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>en 14 h 22 min</div>
            </MOSCard>

            {/* Latest activity */}
            <MOSCard style={{ gridColumn: 'span 4' }} padding={20}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>Actividad reciente</h3>
                <span style={{ fontSize: 11, color: '#a5b4fc', cursor: 'pointer', fontWeight: 500 }}>Ver todo →</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                  { i: <Icons.Mail size={14} color="#a5b4fc"/>, t: 'Respondió por email', s: 'Maritxu Hoteles · hace 12 min', tone: 'indigo' },
                  { i: <Icons.Whatsapp size={14} color="#86efac"/>, t: 'WhatsApp inbound', s: 'Inmobiliaria Vista · hace 32 min', tone: 'green' },
                  { i: <Icons.Sparkles size={14} color="#67e8f9"/>, t: 'Lead nuevo', s: 'Clínica Tu Sonrisa · hace 1h', tone: 'cyan' },
                  { i: <Icons.Check size={14} color="#fcd34d"/>, t: 'Propuesta aceptada', s: 'Tendencia Legal · hace 3h', tone: 'amber' },
                ].map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: '#0f172a', border: '1px solid #1e293b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{a.i}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{a.t}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{a.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </MOSCard>
          </div>
        </div>
      </div>
      {/* Provide color vars for legend dots */}
      <style>{`
        :root {
          --c-indigo: #6366f1; --c-cyan: #06b6d4; --c-green: #22c55e;
          --c-amber: #f59e0b; --c-rose: #f43f5e;
        }
      `}</style>
    </div>
  );
};
const kpiLabel = { fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' };
const kpiBig = { fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 6, lineHeight: 1 };
window.ScreenAdminDash = ScreenAdminDash;

// ============ WORLD MAP (dot grid + highlights) ============
const WorldMap = () => {
  // Stylized dot-grid map. Renders an SVG.
  const dots = [];
  const W = 460, H = 200;
  // Highlight cities (rough): Mexico, Spain, Colombia, Argentina, Chile, USA
  const cities = [
    { x: 0.18, y: 0.42, r: 8, c: '#6366f1', l: 'MX' },
    { x: 0.45, y: 0.30, r: 6, c: '#06b6d4', l: 'ES' },
    { x: 0.22, y: 0.52, r: 5, c: '#22c55e' },
    { x: 0.27, y: 0.72, r: 4, c: '#f59e0b' },
    { x: 0.25, y: 0.78, r: 3, c: '#f43f5e' },
    { x: 0.15, y: 0.30, r: 4, c: '#a5b4fc' },
  ];
  // dot grid for "continents" — simplified mask via rough rectangles
  const rect = (x1, y1, x2, y2) => ({ x1, y1, x2, y2 });
  const continents = [
    rect(0.05, 0.20, 0.30, 0.55),   // N. America
    rect(0.18, 0.55, 0.30, 0.92),   // S. America
    rect(0.42, 0.22, 0.58, 0.55),   // EU/Africa block
    rect(0.46, 0.55, 0.55, 0.78),   // Africa
    rect(0.58, 0.30, 0.85, 0.62),   // Asia
    rect(0.78, 0.65, 0.90, 0.82),   // Oceania
  ];
  const cols = 56, rows = 22;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const nx = c / cols, ny = r / rows;
      if (continents.some(C => nx > C.x1 && nx < C.x2 && ny > C.y1 && ny < C.y2)) {
        dots.push({ x: nx * W, y: ny * H });
      }
    }
  }
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', margin: '8px 0' }}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.2} fill="#334155"/>
      ))}
      {cities.map((c, i) => (
        <g key={i}>
          <circle cx={c.x * W} cy={c.y * H} r={c.r + 8} fill={c.c} opacity="0.12">
            <animate attributeName="r" values={`${c.r+4};${c.r+14};${c.r+4}`} dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.18;0;0.18" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx={c.x * W} cy={c.y * H} r={c.r} fill={c.c} opacity="0.95"/>
          <circle cx={c.x * W} cy={c.y * H} r={c.r * 0.4} fill="#fff" opacity="0.85"/>
        </g>
      ))}
    </svg>
  );
};
window.WorldMap = WorldMap;

// ============ CRM KANBAN ============
const ScreenAdminCRM = () => {
  const columns = [
    {
      id: 'lead', title: 'Lead (contactado)', count: 14, color: '#94a3b8',
      cards: [
        { co: 'Hotel Maritxu', country: '🇪🇸 ES', ind: 'Hoteles', email: 'info@maritxu.es', date: 'hoy', heat: null },
        { co: 'Dental Sonríe',  country: '🇲🇽 MX', ind: 'Dental',  email: 'dir@dentalsonrie.mx', date: 'hoy', heat: null },
        { co: 'Vista Inmuebles', country: '🇨🇴 CO', ind: 'Inmobiliaria', email: 'admin@vista.co', date: 'ayer' },
        { co: 'Tendencia Legal', country: '🇦🇷 AR', ind: 'Legal',  email: 'estudio@tendencia.ar', date: 'ayer' },
      ],
    },
    {
      id: 'responded', title: 'Respondió', count: 7, color: '#67e8f9',
      cards: [
        { co: 'Clínica Tu Sonrisa', country: '🇲🇽 MX', ind: 'Dental', email: 'gerencia@tusonrisa.mx', date: 'hoy', heat: 'hot' },
        { co: 'Posada del Lago',     country: '🇨🇱 CL', ind: 'Hoteles', email: 'reservas@posadalago.cl', date: 'ayer', heat: 'warm' },
        { co: 'EdTech Latam',        country: '🇨🇴 CO', ind: 'Educación', email: 'hola@edtechlatam.co', date: 'lun', heat: 'cold' },
      ],
    },
    {
      id: 'convo', title: 'En conversación', count: 5, color: '#a5b4fc',
      cards: [
        { co: 'Bufete Vargas', country: '🇲🇽 MX', ind: 'Legal', email: 'contacto@vargas.mx', date: 'hace 3h', heat: 'hot', whatsapp: true },
        { co: 'CrecerData',    country: '🇪🇸 ES', ind: 'SaaS', email: 'ana@crecerdata.es', date: 'ayer', heat: 'warm' },
      ],
    },
    {
      id: 'proposal', title: 'Propuesta enviada', count: 4, color: '#fcd34d',
      cards: [
        { co: 'Vuela Tours',  country: '🇲🇽 MX', ind: 'Agencia viajes', email: 'comercial@vuelatours.mx', date: '7 may', heat: 'hot' },
        { co: 'Inmobiliaria Norte', country: '🇨🇴 CO', ind: 'Inmobiliaria', email: 'ventas@norte.co', date: '5 may', heat: 'warm' },
      ],
    },
    {
      id: 'client', title: 'Cliente ✦', count: 12, color: '#86efac',
      cards: [
        { co: 'Clínica Dental Sonríe', country: '🇲🇽 MX', ind: 'Dental', email: 'laura@sonrie.mx', date: 'activo', heat: 'hot', active: true },
        { co: 'Boutique Estela',        country: '🇲🇽 MX', ind: 'Marketing', email: 'estela@boutique.mx', date: 'activo', active: true },
      ],
    },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: '#020617', color: '#f8fafc', fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      <AdminSidebar active="crm"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminHeader title="Clientes & CRM" subtitle="42 leads · 5 columnas · arrastra para mover"
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <MOSButton variant="secondary" size="md" leftIcon={<Icons.Settings size={14}/>}>Filtros</MOSButton>
              <MOSButton variant="primary" size="md" leftIcon={<Icons.Plus size={14}/>}>Añadir lead</MOSButton>
            </div>
          }/>

        {/* Filters bar */}
        <div style={{
          padding: '14px 28px', borderBottom: '1px solid #1e293b',
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        }}>
          {['Todos','🇲🇽 México','🇪🇸 España','🇨🇴 Colombia','Dental','Hoteles','Calientes 🔥'].map((c, i) => (
            <button key={c} style={{
              padding: '6px 12px', borderRadius: 8,
              border: i === 0 ? '1px solid #6366f1' : '1px solid #1e293b',
              background: i === 0 ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: i === 0 ? '#a5b4fc' : '#94a3b8', cursor: 'pointer',
              fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
            }}>{c}</button>
          ))}
        </div>

        {/* Kanban board */}
        <div style={{
          flex: 1, overflow: 'auto', padding: 24,
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          {columns.map(col => (
            <div key={col.id} style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Col header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 4, background: col.color,
                    boxShadow: `0 0 8px ${col.color}`,
                  }}/>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em' }}>{col.title}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#64748b',
                    background: '#0f172a', padding: '2px 6px', borderRadius: 6,
                  }}>{col.count}</span>
                </div>
                <button style={{
                  width: 20, height: 20, borderRadius: 5, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748b',
                }}><Icons.Plus size={12}/></button>
              </div>

              {/* Cards */}
              {col.cards.map((card, i) => {
                const tone = industryTone(card.ind);
                return (
                  <MOSCard key={i} padding={14} glow={!!card.active}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>{card.co}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <MOSBadge tone={tone}>{card.ind}</MOSBadge>
                          <span style={{ fontSize: 11, color: '#64748b' }}>{card.country}</span>
                        </div>
                      </div>
                      {card.heat && (
                        <span title={card.heat} style={{
                          fontSize: 12, lineHeight: 1, opacity: card.heat === 'hot' ? 1 : card.heat === 'warm' ? 0.7 : 0.4,
                          filter: card.heat === 'cold' ? 'grayscale(0.8)' : 'none',
                        }}>🔥</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                      <Icons.Mail size={11} color="#64748b"/>
                      <span style={{
                        fontSize: 10, color: '#94a3b8',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0,
                      }}>{card.email}</span>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginTop: 10, paddingTop: 10, borderTop: '1px solid #1e293b',
                    }}>
                      <span style={{ fontSize: 10, color: '#64748b' }}>{card.date}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button style={cardChip(card.whatsapp ? '#25D366' : null)}>
                          <Icons.Whatsapp size={11} color={card.whatsapp ? '#fff' : '#94a3b8'}/>
                        </button>
                        <button style={cardChip()}>
                          <Icons.Eye size={11} color="#94a3b8"/>
                        </button>
                      </div>
                    </div>
                  </MOSCard>
                );
              })}

              {/* Empty add hint */}
              <div style={{
                padding: 10, border: '1px dashed #1e293b', borderRadius: 10,
                fontSize: 11, color: '#475569', textAlign: 'center', cursor: 'pointer',
              }}>+ arrastrar aquí</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const cardChip = (bg) => ({
  width: 22, height: 22, borderRadius: 6,
  background: bg || 'rgba(30,41,59,0.6)',
  border: bg ? `1px solid ${bg}` : '1px solid #1e293b',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: bg ? `0 0 10px ${bg}66` : 'none',
});
window.ScreenAdminCRM = ScreenAdminCRM;
