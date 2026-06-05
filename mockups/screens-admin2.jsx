// Admin screens part 2: WhatsApp, Client Profile, Outreach Analytics

const { MOSLogo, MOSCard, MOSButton, MOSBadge, MOSAvatar, Icons, AdminSidebar, AdminHeader, Sparkline, BarChart, Donut, INDUSTRY_TONE, industryTone } = window;

// ============ ADMIN WHATSAPP ============
const ScreenAdminWA = () => {
  const chats = [
    { id: 1, name: 'Laura Restrepo',  co: 'Clínica Sonríe', last: 'Perfecto, te confirmo mañana 👍', when: '14:42', unread: 2, active: true, stage: 'client' },
    { id: 2, name: 'Inmobiliaria Vista', co: 'Vista', last: 'Audio · 0:34', when: '13:18', unread: 1, stage: 'convo' },
    { id: 3, name: 'Bufete Vargas',   co: 'Legal MX',  last: 'Mañana revisamos el contrato.', when: '12:05', unread: 0, stage: 'convo' },
    { id: 4, name: 'Hotel Maritxu',   co: 'Hoteles ES', last: '¿Tienen disponibilidad para abril?', when: 'ayer', unread: 0, stage: 'responded' },
    { id: 5, name: 'CrecerData',      co: 'SaaS', last: 'Doc adjunto recibido ✓', when: 'lun', unread: 0, stage: 'convo' },
    { id: 6, name: 'EdTech Latam',    co: 'Educación', last: 'Te cuento más cuando vuelva.', when: '7 may', unread: 0, stage: 'responded' },
  ];

  const messages = [
    { from: 'them', body: 'Hola Mario, qué tal todo?', when: '14:18' },
    { from: 'them', body: '¿Pudiste ver lo del calendario de citas?', when: '14:18' },
    { from: 'me',   body: 'Hola Laura! Sí, ya quedó integrado con Google Calendar bidireccional.', when: '14:25', status: 'read' },
    { from: 'me',   body: 'Cuando reservan en el portal te aparece automáticamente en tu Google.', when: '14:25', status: 'read' },
    { from: 'them', body: 'Excelente!! 🎉', when: '14:32' },
    { from: 'them', body: 'Imagen', img: true, when: '14:33' },
    { from: 'me',   body: 'Listo, lo aplico esta tarde y te paso staging para que pruebes.', when: '14:40', status: 'delivered' },
    { from: 'them', body: 'Perfecto, te confirmo mañana 👍', when: '14:42' },
  ];

  const stageBadge = (s) => {
    if (s === 'client') return <MOSBadge tone="green" dot>cliente</MOSBadge>;
    if (s === 'convo')  return <MOSBadge tone="indigo" dot>en conversación</MOSBadge>;
    return <MOSBadge tone="cyan" dot>respondió</MOSBadge>;
  };

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: '#020617', color: '#f8fafc', fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      <AdminSidebar active="whatsapp"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminHeader title="WhatsApp" subtitle="Meta Cloud API · número verificado +52 55 1234 5678"
          actions={<MOSButton variant="secondary" size="md" leftIcon={<Icons.Plus size={14}/>}>Nuevo chat</MOSButton>}/>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr 280px', overflow: 'hidden' }}>
          {/* CHAT LIST */}
          <div style={{ borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Search */}
            <div style={{ padding: '14px 14px 10px', flexShrink: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#0f172a', border: '1px solid #1e293b',
                borderRadius: 999, padding: '8px 14px',
              }}>
                <Icons.Search size={14} color="#64748b"/>
                <input placeholder="Buscar chats…" style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#f8fafc', fontSize: 13, fontFamily: 'inherit',
                }}/>
              </div>
            </div>
            {/* Tabs */}
            <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6, flexShrink: 0 }}>
              {[['Todos', 22, true], ['No leídos', 3], ['Clientes', 12], ['Leads', 10]].map(([l, n, a], i) => (
                <button key={l} style={{
                  padding: '5px 10px', borderRadius: 999,
                  border: a ? '1px solid #6366f1' : '1px solid #1e293b',
                  background: a ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: a ? '#a5b4fc' : '#94a3b8',
                  fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>{l}<span style={{ color: a ? '#a5b4fc' : '#64748b' }}>{n}</span></button>
              ))}
            </div>
            {/* Chats */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {chats.map(c => (
                <div key={c.id} style={{
                  display: 'flex', gap: 10, padding: '12px 14px',
                  cursor: 'pointer', position: 'relative',
                  background: c.active ? 'rgba(99,102,241,0.10)' : 'transparent',
                  borderLeft: c.active ? '2px solid #6366f1' : '2px solid transparent',
                }}>
                  <div style={{ position: 'relative' }}>
                    <MOSAvatar name={c.name} size={40}/>
                    <span style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 12, height: 12, borderRadius: 6,
                      background: '#25D366', border: '2px solid #020617',
                    }}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{c.name}</span>
                      <span style={{ fontSize: 10, color: c.unread ? '#a5b4fc' : '#64748b', fontWeight: c.unread ? 600 : 400, flexShrink: 0 }}>{c.when}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>{c.co}</div>
                    <div style={{
                      fontSize: 12, color: c.unread ? '#cbd5e1' : '#64748b',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{c.last}</div>
                  </div>
                  {c.unread > 0 && (
                    <span style={{
                      alignSelf: 'center',
                      minWidth: 18, height: 18, padding: '0 5px',
                      background: '#25D366', color: '#000', borderRadius: 9,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                    }}>{c.unread}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CHAT VIEW */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: '#070b1c',
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.04) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
            overflow: 'hidden',
          }}>
            {/* Chat header */}
            <div style={{
              height: 64, padding: '0 24px', flexShrink: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid #1e293b', background: 'rgba(2,6,23,0.6)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <MOSAvatar name="Laura Restrepo" size={36}/>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Laura Restrepo</span>
                    {stageBadge('client')}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Clínica Dental Sonríe · en línea</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={chatHeaderBtn}><Icons.Phone size={14} color="#94a3b8"/></button>
                <button style={chatHeaderBtn}><Icons.Search size={14} color="#94a3b8"/></button>
                <button style={chatHeaderBtn}><Icons.ChevronRight size={14} color="#94a3b8" style={{ transform: 'rotate(90deg)' }}/></button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ alignSelf: 'center', fontSize: 10, color: '#64748b', padding: '4px 10px', background: 'rgba(15,23,42,0.6)', borderRadius: 999, margin: '8px 0' }}>
                Hoy
              </div>
              {messages.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '55%',
                    padding: m.img ? 4 : '8px 12px',
                    borderRadius: 10,
                    background: m.from === 'me' ? '#005c4b' : '#1e293b',
                    color: '#f8fafc', fontSize: 13, lineHeight: 1.45,
                    boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
                    position: 'relative',
                  }}>
                    {m.img ? (
                      <div style={{
                        width: 220, height: 140, borderRadius: 8,
                        background: 'linear-gradient(135deg, #1e293b, #334155)',
                        backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 6px, transparent 6px 14px)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                      }}>📷 foto recepción.jpg</div>
                    ) : m.body}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end',
                      marginTop: 4, fontSize: 9, color: m.from === 'me' ? '#86d8c7' : '#64748b', fontWeight: 500,
                    }}>
                      {m.when}
                      {m.from === 'me' && (
                        <span style={{ color: m.status === 'read' ? '#67e8f9' : '#94a3b8' }}>
                          {m.status === 'read' ? '✓✓' : m.status === 'delivered' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: 16, borderTop: '1px solid #1e293b', background: 'rgba(2,6,23,0.8)' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#1e293b', borderRadius: 22, padding: '4px 4px 4px 14px',
              }}>
                <button style={chatIconBtn}><Icons.Smile size={18} color="#94a3b8"/></button>
                <button style={chatIconBtn}><Icons.Paperclip size={18} color="#94a3b8"/></button>
                <input placeholder="Escribe un mensaje…" style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', padding: '8px 4px',
                }}/>
                <button style={{
                  width: 38, height: 38, borderRadius: 19,
                  background: 'linear-gradient(180deg, #25D366, #1FAB54)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px -4px rgba(37,211,102,0.6)',
                }}><Icons.Send size={15} color="#fff"/></button>
              </div>
            </div>
          </div>

          {/* CONTACT PANEL */}
          <div style={{
            borderLeft: '1px solid #1e293b', overflow: 'auto', padding: 20,
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
              <MOSAvatar name="Laura Restrepo" size={64}/>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>Laura Restrepo</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>+52 55 9876 5432</div>
              </div>
              <MOSBadge tone="green" dot glow>Cliente activo</MOSBadge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['Empresa', 'Clínica Dental Sonríe'],
                ['Industria', 'Dental'],
                ['País', '🇲🇽 México'],
                ['Web', 'sonrie.mx'],
                ['Email', 'laura@sonrie.mx'],
                ['Primer contacto', '14 abr 2026'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', padding: '6px 0', borderBottom: '1px solid #1e293b' }}>
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</span>
                  <span style={{ fontSize: 12, color: '#f8fafc' }}>{v}</span>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Notas</div>
              <div style={{
                background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
                padding: 10, fontSize: 11, color: '#cbd5e1', lineHeight: 1.5,
              }}>
                Cliente recurrente. Prefiere reuniones miércoles AM. Su esposo es contador (referido potencial).
              </div>
            </div>

            <MOSButton variant="secondary" size="sm" leftIcon={<Icons.ArrowUpRight size={12}/>}>
              Ver perfil completo
            </MOSButton>
          </div>
        </div>
      </div>
    </div>
  );
};
const chatHeaderBtn = {
  width: 32, height: 32, borderRadius: 8,
  background: 'transparent', border: '1px solid #1e293b',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const chatIconBtn = {
  width: 36, height: 36, borderRadius: 18, border: 'none', background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
window.ScreenAdminWA = ScreenAdminWA;

// ============ ADMIN CLIENT PROFILE ============
const ScreenAdminClient = () => {
  const [tab, setTab] = React.useState('resumen');
  const tabs = [
    { id: 'resumen', l: 'Resumen' },
    { id: 'emails',  l: 'Emails' },
    { id: 'wa',      l: 'WhatsApp' },
    { id: 'proyecto', l: 'Proyecto' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: '#020617', color: '#f8fafc', fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      <AdminSidebar active="crm"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminHeader title="Clínica Dental Sonríe" subtitle="CRM › Clientes › ID-018"
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <MOSButton variant="secondary" size="md" leftIcon={<Icons.ArrowRight size={14}/>}>Mover pipeline</MOSButton>
              <MOSButton variant="whatsapp" size="md" leftIcon={<Icons.Whatsapp size={14}/>}>WhatsApp</MOSButton>
            </div>
          }/>

        <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          {/* Header card */}
          <MOSCard glow padding={24} style={{ marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(ellipse 50% 80% at 0% 0%, rgba(99,102,241,0.18), transparent 60%)',
            }}/>
            <div style={{ display: 'flex', gap: 22, alignItems: 'center', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <MOSAvatar name="Clínica Dental Sonríe" size={76}/>
                <span style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 18, height: 18, borderRadius: 9,
                  background: '#22c55e', border: '3px solid #020617',
                  boxShadow: '0 0 10px #22c55e',
                }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>Clínica Dental Sonríe</h2>
                  <MOSBadge tone="green" dot glow>Cliente activo</MOSBadge>
                  <MOSBadge tone="rose">Dental</MOSBadge>
                </div>
                <div style={{ display: 'flex', gap: 18, marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icons.Building size={12} color="#64748b"/> sonrie.mx
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icons.Globe size={12} color="#64748b"/> 🇲🇽 México · Guadalajara
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icons.Mail size={12} color="#64748b"/> laura@sonrie.mx
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icons.Phone size={12} color="#64748b"/> +52 55 9876 5432
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Valor cliente</span>
                <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>$ 24,500</span>
                <span style={{ fontSize: 10, color: '#86efac' }}>↑ proyecto activo</span>
              </div>
            </div>
          </MOSCard>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 18,
            background: '#0f172a', border: '1px solid #1e293b',
            borderRadius: 10, padding: 4, width: 'fit-content',
            position: 'relative',
          }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '7px 16px', borderRadius: 7, border: 'none',
                background: tab === t.id ? 'linear-gradient(180deg, #6366f1, #4f46e5)' : 'transparent',
                color: tab === t.id ? '#fff' : '#94a3b8',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: tab === t.id ? '0 4px 12px -4px rgba(99,102,241,0.5)' : 'none',
                transition: 'all .15s',
              }}>{t.l}</button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'resumen' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
              {/* Timeline (tracing beam) */}
              <MOSCard padding={22}>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 16 }}>Timeline de interacciones</h3>
                <div style={{ position: 'relative', paddingLeft: 24 }}>
                  <div style={{
                    position: 'absolute', left: 8, top: 8, bottom: 8, width: 2,
                    background: 'linear-gradient(180deg, #6366f1 0%, #06b6d4 60%, #334155 100%)',
                  }}/>
                  {[
                    { t: 'Outreach inicial enviado', d: '14 abr · 09:02', i: <Icons.Mail size={11}/>, c: '#6366f1', desc: 'Plantilla: dental-v3 · personalizada' },
                    { t: 'Respondió por email', d: '14 abr · 16:31', i: <Icons.Check size={11}/>, c: '#06b6d4', desc: '"Me interesa, ¿podemos agendar una llamada?"' },
                    { t: 'Primer WhatsApp', d: '15 abr · 10:14', i: <Icons.Whatsapp size={11}/>, c: '#22c55e', desc: 'Iniciaron conversación, intercambiaron audios' },
                    { t: 'Propuesta enviada', d: '21 abr', i: <Icons.File size={11}/>, c: '#f59e0b', desc: 'PDF · $24,500 · sitio + reservas' },
                    { t: 'Cliente confirmado', d: '23 abr', i: <Icons.Sparkles size={11}/>, c: '#22c55e', desc: 'Kickoff agendado para 24 abr' },
                    { t: 'Kickoff', d: '24 abr', i: <Icons.Check size={11}/>, c: '#a5b4fc', desc: 'Reunión completa · acta y archivos en el proyecto' },
                  ].map((m, i, arr) => (
                    <div key={i} style={{ position: 'relative', paddingBottom: i === arr.length-1 ? 0 : 16 }}>
                      <div style={{
                        position: 'absolute', left: -22, top: 0,
                        width: 18, height: 18, borderRadius: 9,
                        background: '#020617', border: `2px solid ${m.c}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: m.c,
                      }}>{m.i}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{m.t}</span>
                        <span style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>{m.d}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{m.desc}</div>
                    </div>
                  ))}
                </div>
              </MOSCard>

              {/* Notes + stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <MOSCard padding={18}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>Notas internas</h3>
                    <span style={{ fontSize: 10, color: '#64748b' }}>auto-guardado</span>
                  </div>
                  <div style={{
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderLeft: '3px solid #f59e0b',
                    borderRadius: 8, padding: 12,
                    fontSize: 12, color: '#fcd34d', lineHeight: 1.6,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    Prefiere reuniones miércoles AM. Quiere expansión a clinic-2 en Q4. Su esposo (contador) podría ser referido potencial — explorar después del kickoff de su proyecto actual.
                  </div>
                </MOSCard>

                <MOSCard padding={18}>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 14 }}>Resumen relación</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <MiniStat label="Días desde contacto" value="28" tone="#a5b4fc"/>
                    <MiniStat label="Emails intercambiados" value="14" tone="#67e8f9"/>
                    <MiniStat label="Msgs WhatsApp" value="89" tone="#86efac"/>
                    <MiniStat label="Archivos compartidos" value="7" tone="#fcd34d"/>
                  </div>
                </MOSCard>

                <MOSCard padding={18}>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 10 }}>Tags</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['vip','recurrente','dental','referido-potencial','q2-2026'].map(t => (
                      <MOSBadge key={t}>#{t}</MOSBadge>
                    ))}
                    <button style={{
                      padding: '3px 9px', borderRadius: 999,
                      border: '1px dashed #334155', background: 'transparent',
                      color: '#64748b', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                    }}>+ añadir</button>
                  </div>
                </MOSCard>
              </div>
            </div>
          )}

          {tab !== 'resumen' && (
            <MOSCard padding={32} style={{ textAlign: 'center', color: '#64748b' }}>
              <Icons.Sparkles size={28} color="#475569" style={{ margin: '0 auto 8px' }}/>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1' }}>Vista de {tab}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Pestaña en desarrollo en este mockup</div>
            </MOSCard>
          )}
        </div>
      </div>
    </div>
  );
};
const MiniStat = ({ label, value, tone }) => (
  <div style={{
    background: '#020617', border: '1px solid #1e293b',
    borderRadius: 8, padding: '10px 12px',
  }}>
    <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: tone, letterSpacing: '-0.02em', marginTop: 2 }}>{value}</div>
  </div>
);
window.ScreenAdminClient = ScreenAdminClient;

// ============ ADMIN OUTREACH ANALYTICS ============
const ScreenAdminOutreach = () => {
  const barData = [22, 28, 35, 30, 42, 50, 48, 56, 52, 60, 70, 68, 76, 82, 78, 88, 95, 92, 102, 110, 105, 118, 125, 130, 138, 144, 158, 162, 175, 180];

  const rows = [
    { co: 'Hotel Maritxu',     country: '🇪🇸', ind: 'Hoteles', email: 'info@maritxu.es', sent: '12 may · 09:02', open: true, reply: false },
    { co: 'Dental Sonríe Clínica', country: '🇲🇽', ind: 'Dental', email: 'dir@dentalsonrie.mx', sent: '12 may · 09:02', open: true, reply: true },
    { co: 'Vista Inmuebles',   country: '🇨🇴', ind: 'Inmobiliaria', email: 'admin@vista.co', sent: '12 may · 09:02', open: false, reply: false },
    { co: 'Tendencia Legal',   country: '🇦🇷', ind: 'Legal', email: 'estudio@tendencia.ar', sent: '12 may · 09:02', open: true, reply: false },
    { co: 'CrecerData',        country: '🇪🇸', ind: 'SaaS', email: 'ana@crecerdata.es', sent: '11 may · 14:18', open: true, reply: true },
    { co: 'Vuela Tours',       country: '🇲🇽', ind: 'Agencia viajes', email: 'comercial@vuelatours.mx', sent: '11 may · 14:18', open: true, reply: false },
    { co: 'Posada del Lago',   country: '🇨🇱', ind: 'Hoteles', email: 'reservas@posadalago.cl', sent: '11 may · 14:18', open: false, reply: false },
    { co: 'EdTech Latam',      country: '🇨🇴', ind: 'Educación', email: 'hola@edtechlatam.co', sent: '11 may · 09:00', open: true, reply: true },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: '#020617', color: '#f8fafc', fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      <AdminSidebar active="outreach"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminHeader title="Outreach" subtitle="Tracking de envíos · últimos 30 días"
          actions={<MOSButton variant="primary" size="md" leftIcon={<Icons.Send size={14}/>}>Nuevo envío</MOSButton>}/>

        <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {['Últimos 30 días','Todos los países','Todas industrias','Estado · todos'].map((c, i) => (
              <button key={c} style={{
                padding: '7px 12px', borderRadius: 8,
                background: '#0f172a', border: '1px solid #1e293b',
                color: '#94a3b8', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {c} <Icons.ChevronDown size={12} color="#64748b"/>
              </button>
            ))}
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
            {[
              { l: 'Total enviados', v: '2,418', sub: '+18% vs mes pasado', tone: '#a5b4fc' },
              { l: 'Esta semana', v: '347', sub: '5 días de envío', tone: '#67e8f9' },
              { l: 'Tasa apertura', v: '38%', sub: '+2.1% vs benchmark', tone: '#86efac' },
              { l: 'Dominios únicos', v: '187', sub: 'en 14 países', tone: '#fcd34d' },
            ].map((k, i) => (
              <MOSCard key={i} padding={18} glow={i === 0}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{k.l}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: k.tone }}>{k.v}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{k.sub}</div>
              </MOSCard>
            ))}
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 18 }}>
            <MOSCard padding={22}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>Emails por día</h3>
                  <span style={{ fontSize: 11, color: '#64748b' }}>últimos 30 días</span>
                </div>
                <MOSBadge tone="indigo">indigo-500</MOSBadge>
              </div>
              <BarChart data={barData} width={620} height={120} gap={3}/>
            </MOSCard>
            <MOSCard padding={22}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 14 }}>Por industria</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <Donut size={120} thickness={20} segments={[
                  { value: 32, color: '#f43f5e' },
                  { value: 24, color: '#f59e0b' },
                  { value: 18, color: '#3b82f6' },
                  { value: 14, color: '#22c55e' },
                  { value: 12, color: '#a855f7' },
                ]}/>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, fontSize: 11 }}>
                  {[
                    ['Dental', '32%', '#f43f5e'],
                    ['Hoteles', '24%', '#f59e0b'],
                    ['Educación', '18%', '#3b82f6'],
                    ['Inmobiliaria', '14%', '#22c55e'],
                    ['Legal', '12%', '#a855f7'],
                  ].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 4, background: c }}/>
                      <span style={{ color: '#cbd5e1', flex: 1 }}>{l}</span>
                      <span style={{ color: '#94a3b8', fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </MOSCard>
          </div>

          {/* Table */}
          <MOSCard padding={0}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>Últimos envíos</h3>
              <span style={{ fontSize: 11, color: '#64748b' }}>{rows.length} de 2,418</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#020617' }}>
                  {['Empresa','Industria','País','Email','Enviado','Abrió','Respondió',''].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 14px', fontSize: 10,
                      color: '#64748b', fontWeight: 600, letterSpacing: '0.04em',
                      textTransform: 'uppercase', borderBottom: '1px solid #1e293b',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #0f172a' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#f8fafc' }}>{r.co}</td>
                    <td style={{ padding: '12px 14px' }}><MOSBadge tone={industryTone(r.ind)}>{r.ind}</MOSBadge></td>
                    <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{r.country}</td>
                    <td style={{ padding: '12px 14px', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{r.email}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{r.sent}</td>
                    <td style={{ padding: '12px 14px' }}>{r.open ? <Icons.Check size={14} color="#22c55e"/> : <span style={{ color: '#475569' }}>—</span>}</td>
                    <td style={{ padding: '12px 14px' }}>{r.reply ? <MOSBadge tone="indigo" dot>respondió</MOSBadge> : <span style={{ color: '#475569' }}>—</span>}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button style={{
                        padding: '4px 10px', borderRadius: 6,
                        background: 'transparent', border: '1px solid #1e293b',
                        color: '#a5b4fc', fontSize: 10, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>→ CRM</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </MOSCard>
        </div>
      </div>
    </div>
  );
};
window.ScreenAdminOutreach = ScreenAdminOutreach;
