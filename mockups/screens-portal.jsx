// Client portal screens: Dashboard + Messages

const { MOSLogo, MOSWordmark, MOSCard, MOSButton, MOSBadge, MOSAvatar, Icons } = window;

// ============ CLIENT PORTAL DASHBOARD ============
const ScreenPortalDash = () => {
  const milestones = [
    { t: 'Kickoff & alineación', d: '14 abr', s: 'done' },
    { t: 'Diseño & wireframes',  d: '28 abr', s: 'done' },
    { t: 'Desarrollo iterativo', d: '12 may', s: 'active', pct: 65 },
    { t: 'QA & pruebas',         d: '26 may', s: 'pending' },
    { t: 'Deploy a producción',  d: '02 jun', s: 'pending' },
  ];
  const messages = [
    { who: 'Mario', when: 'hace 2h', body: 'Ya terminamos la pantalla de onboarding. Te dejé un Loom con el recorrido.', unread: true },
    { who: 'Mario', when: 'ayer',    body: 'Confirmado el ajuste del color primario. Vamos con el indigo.', unread: false },
    { who: 'Mario', when: 'lun',     body: 'Listo el ambiente de staging. Te paso credenciales por WhatsApp.', unread: false },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', background: '#020617', color: '#f8fafc',
      fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top nav */}
      <div style={{
        height: 64, padding: '0 40px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1e293b', background: '#020617',
      }}>
        <MOSWordmark size={28}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={iconBtn}><Icons.Search size={16} color="#94a3b8"/></button>
          <button style={{ ...iconBtn, position: 'relative' }}>
            <Icons.Bell size={16} color="#94a3b8"/>
            <span style={{
              position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: 4,
              background: '#ef4444', boxShadow: '0 0 8px #ef4444',
            }}/>
          </button>
          <div style={{ width: 1, height: 22, background: '#1e293b' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MOSAvatar name="Laura Restrepo" size={30}/>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Hola, Laura</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>Clínica Dental Sonríe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 40px', overflow: 'auto' }}>
        {/* Hero card */}
        <MOSCard glow padding={28} style={{ marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          {/* spotlight gradient bg */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(ellipse 60% 80% at 90% 0%, rgba(99,102,241,0.15), transparent 60%)',
            pointerEvents: 'none',
          }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Tu proyecto
              </span>
              <h1 style={{
                margin: 0, fontSize: 32, fontWeight: 700,
                letterSpacing: '-0.025em', lineHeight: 1.15,
              }}>Sitio web + reservas online</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <MOSBadge tone="indigo" dot glow>En Progreso</MOSBadge>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  Última actualización · hace 2 horas
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Avance global</span>
              <span style={{
                fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1,
                background: 'linear-gradient(180deg, #f8fafc, #a5b4fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>65<span style={{ fontSize: 22, color: '#64748b', WebkitTextFillColor: '#64748b' }}>%</span></span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 22, position: 'relative' }}>
            <div style={{
              height: 8, background: '#1e293b', borderRadius: 8, overflow: 'hidden',
              border: '1px solid #1e293b',
            }}>
              <div style={{
                width: '65%', height: '100%',
                background: 'linear-gradient(90deg, #4f46e5, #6366f1, #06b6d4)',
                borderRadius: 8,
                boxShadow: '0 0 12px rgba(99,102,241,0.6)',
              }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: '#64748b' }}>
              <span>Kickoff · 14 abr</span>
              <span>Deploy · 02 jun</span>
            </div>
          </div>
        </MOSCard>

        {/* 2 cols */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
          {/* Timeline (tracing beam) */}
          <MOSCard padding={24}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={sectionTitle}>Timeline del proyecto</h3>
              <span style={{ fontSize: 11, color: '#64748b' }}>5 hitos</span>
            </div>
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              {/* beam */}
              <div style={{
                position: 'absolute', left: 8, top: 8, bottom: 8, width: 2,
                background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 40%, #1e293b 40%, #1e293b 100%)',
              }}/>
              {milestones.map((m, i) => (
                <div key={i} style={{
                  position: 'relative', paddingBottom: i === milestones.length-1 ? 0 : 22,
                  paddingLeft: 4,
                }}>
                  {/* Node */}
                  <div style={{
                    position: 'absolute', left: -22, top: 2,
                    width: 18, height: 18, borderRadius: 9,
                    background: m.s === 'done' ? '#4f46e5' : m.s === 'active' ? '#020617' : '#020617',
                    border: m.s === 'active' ? '2px solid #6366f1' : m.s === 'done' ? '2px solid #4f46e5' : '2px solid #334155',
                    boxShadow: m.s === 'active' ? '0 0 0 4px rgba(99,102,241,0.15), 0 0 12px rgba(99,102,241,0.6)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {m.s === 'done' && <Icons.Check size={10} color="#fff" strokeWidth={3}/>}
                    {m.s === 'active' && <span style={{ width: 6, height: 6, borderRadius: 3, background: '#6366f1' }}/>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{
                      fontSize: 14, fontWeight: m.s === 'pending' ? 500 : 600,
                      color: m.s === 'pending' ? '#64748b' : '#f8fafc',
                    }}>{m.t}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{m.d}</span>
                  </div>
                  {m.s === 'active' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <div style={{ flex: 1, height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          width: `${m.pct}%`, height: '100%',
                          background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                        }}/>
                      </div>
                      <span style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 600 }}>{m.pct}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </MOSCard>

          {/* Communication panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <MOSCard padding={20}>
              <h3 style={sectionTitle}>Hablemos</h3>
              <p style={{ margin: '6px 0 16px', color: '#94a3b8', fontSize: 12, lineHeight: 1.5 }}>
                ¿Algo urgente? WhatsApp es lo más rápido.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <MOSButton variant="whatsapp" leftIcon={<Icons.Whatsapp size={16}/>} style={{ width: '100%', justifyContent: 'flex-start' }}
                  rightIcon={<Icons.ArrowUpRight size={14} style={{ marginLeft: 'auto' }}/>}>
                  Escribir por WhatsApp
                </MOSButton>
                <MOSButton variant="secondary" leftIcon={<Icons.Mail size={16}/>} style={{ width: '100%', justifyContent: 'flex-start' }}>
                  Enviar mensaje
                </MOSButton>
                <MOSButton variant="secondary" leftIcon={<Icons.Upload size={16}/>} style={{ width: '100%', justifyContent: 'flex-start' }}>
                  Subir archivo
                </MOSButton>
              </div>
            </MOSCard>

            {/* File drop / share */}
            <MOSCard padding={18}>
              <h3 style={{ ...sectionTitle, marginBottom: 12 }}>Archivos compartidos</h3>
              {[
                { n: 'brief-v3.pdf', s: '1.2 MB', d: '02 may' },
                { n: 'logo-finales.zip', s: '8.4 MB', d: '24 abr' },
              ].map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0', borderTop: i ? '1px solid #1e293b' : 'none',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: 'rgba(99,102,241,0.10)', border: '1px solid #1e293b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icons.File size={14} color="#a5b4fc"/></div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{f.n}</span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>{f.s} · {f.d}</span>
                  </div>
                  <Icons.ArrowUpRight size={14} color="#64748b"/>
                </div>
              ))}
            </MOSCard>
          </div>
        </div>

        {/* Recent messages */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={sectionTitle}>Mensajes recientes</h3>
            <span style={{ fontSize: 12, color: '#a5b4fc', cursor: 'pointer', fontWeight: 500 }}>Ver todos →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {messages.map((m, i) => (
              <MOSCard key={i} padding={16} glow={m.unread}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <MOSAvatar name={m.who} size={26}/>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{m.who}</span>
                  {m.unread && <span style={{ width: 6, height: 6, borderRadius: 3, background: '#6366f1', boxShadow: '0 0 6px #6366f1' }}/>}
                  <span style={{ fontSize: 11, color: '#64748b', marginLeft: 'auto' }}>{m.when}</span>
                </div>
                <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>{m.body}</div>
              </MOSCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const iconBtn = {
  width: 34, height: 34, borderRadius: 8,
  border: '1px solid #1e293b', background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const sectionTitle = {
  margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1',
  letterSpacing: '-0.005em',
};
window.ScreenPortalDash = ScreenPortalDash;

// ============ CLIENT PORTAL MESSAGES ============
const ScreenPortalMessages = () => {
  const threads = [
    { id: 1, subj: 'Onboarding finalizado', last: 'Te dejé un Loom con el recorrido…', when: '14:22', unread: 2, active: true, from: 'Mario' },
    { id: 2, subj: 'Color primario', last: 'Confirmado, indigo se queda.', when: 'ayer', unread: 0, from: 'Mario' },
    { id: 3, subj: 'Credenciales staging', last: 'Listo, te paso por WhatsApp.', when: 'lun', unread: 0, from: 'Mario' },
    { id: 4, subj: 'Fotos del local', last: 'Recibidas, gracias!', when: '07 may', unread: 0, from: 'Mario' },
    { id: 5, subj: 'Propuesta económica', last: 'PDF adjunto.', when: '03 may', unread: 0, from: 'Mario' },
  ];
  const chat = [
    { from: 'mario', body: '¡Hola Laura! Buenas noticias.', when: '14:18' },
    { from: 'mario', body: 'Ya terminamos la pantalla de onboarding con el flujo completo de captura.', when: '14:19' },
    { from: 'mario', body: 'Te dejo un Loom de 3 min con el recorrido. Cualquier ajuste me dices y lo metemos antes del QA.', when: '14:22' },
    { from: 'me',    body: '¡Genial Mario! Lo veo esta tarde y te confirmo. ¿El tema del calendario de citas quedó cerrado?', when: '14:30' },
    { from: 'mario', body: 'Sí, ya está integrado con Google Calendar. Funciona en dos sentidos. Lo verás en el Loom.', when: '14:31' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', background: '#020617', color: '#f8fafc',
      fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top nav (slim) */}
      <div style={{
        height: 56, padding: '0 32px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1e293b',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <MOSWordmark size={24}/>
          <span style={{ color: '#1e293b' }}>/</span>
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Mensajes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MOSAvatar name="Laura Restrepo" size={28}/>
        </div>
      </div>

      {/* Body: thread list + chat */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden' }}>
        {/* Threads */}
        <div style={{ borderRight: '1px solid #1e293b', overflow: 'auto', background: '#020617' }}>
          <div style={{ padding: '16px 16px 12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#0f172a', border: '1px solid #1e293b',
              borderRadius: 10, padding: '8px 12px',
            }}>
              <Icons.Search size={14} color="#64748b"/>
              <input placeholder="Buscar conversación" style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#f8fafc', fontSize: 13, flex: 1, fontFamily: 'inherit',
              }}/>
            </div>
          </div>
          {threads.map(t => (
            <div key={t.id} style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              cursor: 'pointer', position: 'relative',
              background: t.active ? 'rgba(99,102,241,0.08)' : 'transparent',
              borderLeft: t.active ? '2px solid #6366f1' : '2px solid transparent',
            }}>
              <MOSAvatar name={t.from} size={36}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: t.unread ? 700 : 600, color: '#f8fafc' }}>{t.subj}</span>
                  <span style={{ fontSize: 11, color: t.unread ? '#a5b4fc' : '#64748b', fontWeight: t.unread ? 600 : 400 }}>{t.when}</span>
                </div>
                <div style={{
                  fontSize: 12, color: t.unread ? '#cbd5e1' : '#64748b',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{t.last}</div>
              </div>
              {t.unread > 0 && (
                <span style={{
                  position: 'absolute', right: 12, bottom: 16,
                  minWidth: 18, height: 18, padding: '0 5px',
                  background: '#6366f1', color: '#fff', borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  boxShadow: '0 0 10px rgba(99,102,241,0.6)',
                }}>{t.unread}</span>
              )}
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#0a0f1f', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{
            padding: '14px 28px', borderBottom: '1px solid #1e293b',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#020617',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Onboarding finalizado</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Con Mario · proyecto Sonríe</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <MOSBadge tone="indigo" dot>activa</MOSBadge>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chat.map((m, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: m.from === 'me' ? 'row-reverse' : 'row',
                gap: 10, alignItems: 'flex-end',
              }}>
                {m.from === 'mario' && <MOSAvatar name="Mario M" size={26}/>}
                <div style={{
                  maxWidth: '60%',
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: m.from === 'me'
                    ? 'linear-gradient(180deg, #6366f1, #4f46e5)'
                    : '#1e293b',
                  color: '#f8fafc', fontSize: 13, lineHeight: 1.5,
                  borderBottomRightRadius: m.from === 'me' ? 4 : 14,
                  borderBottomLeftRadius: m.from === 'me' ? 14 : 4,
                  boxShadow: m.from === 'me'
                    ? '0 4px 14px -4px rgba(99,102,241,0.5)'
                    : '0 1px 0 rgba(255,255,255,0.03) inset',
                }}>{m.body}</div>
                <span style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>{m.when}</span>
              </div>
            ))}
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 11, marginTop: 4 }}>
              <span style={{ display: 'flex', gap: 3 }}>
                <span style={typingDot(0)}/><span style={typingDot(0.15)}/><span style={typingDot(0.3)}/>
              </span>
              Mario está escribiendo…
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: 20, borderTop: '1px solid #1e293b', background: '#020617' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#0f172a', border: '1px solid #334155',
              borderRadius: 12, padding: '6px 6px 6px 14px',
            }}>
              <button style={chatIcon}><Icons.Paperclip size={16} color="#64748b"/></button>
              <input placeholder="Escribe algo…" style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#f8fafc', fontSize: 14, fontFamily: 'inherit', padding: '8px 4px',
              }}/>
              <button style={chatIcon}><Icons.Smile size={16} color="#64748b"/></button>
              <button style={chatIcon}><Icons.Mic size={16} color="#64748b"/></button>
              <MOSButton variant="primary" size="sm" rightIcon={<Icons.Send size={14}/>}>Enviar</MOSButton>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typingDot { 0%,80%,100%{ transform: translateY(0); opacity:0.4 } 40%{ transform: translateY(-3px); opacity:1 } }
      `}</style>
    </div>
  );
};
const typingDot = (delay) => ({
  width: 4, height: 4, borderRadius: 2, background: '#64748b',
  display: 'inline-block', animation: `typingDot 1.2s ${delay}s infinite ease-in-out`,
});
const chatIcon = {
  width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
window.ScreenPortalMessages = ScreenPortalMessages;

// ============ MOBILE PORTAL DASHBOARD ============
const ScreenPortalMobile = () => {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#020617', color: '#f8fafc',
      fontFamily: 'Inter, sans-serif', overflow: 'hidden', position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Status bar */}
      <div style={{
        height: 44, padding: '0 22px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 14, fontWeight: 600,
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10 }}>●●●●</span>
          <span style={{ fontSize: 10 }}>📶</span>
          <span style={{
            width: 22, height: 11, borderRadius: 2.5, border: '1px solid #94a3b8',
            padding: 1, display: 'flex',
          }}>
            <span style={{ flex: 1, background: '#f8fafc', borderRadius: 1 }}/>
          </span>
        </div>
      </div>
      {/* Header */}
      <div style={{
        padding: '8px 20px 14px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Hola,</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Laura ✨</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...iconBtn, width: 36, height: 36 }}>
            <Icons.Bell size={16} color="#94a3b8"/>
          </button>
          <MOSAvatar name="Laura" size={36}/>
        </div>
      </div>

      {/* Hero card */}
      <div style={{ padding: '0 20px', flex: 1, overflow: 'auto' }}>
        <MOSCard glow padding={18} style={{ marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(99,102,241,0.18), transparent 60%)',
          }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
              Tu proyecto
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>
              Sitio web + reservas
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <MOSBadge tone="indigo" dot glow>En Progreso</MOSBadge>
              <span style={{ fontSize: 10, color: '#64748b' }}>hace 2h</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 6, background: '#1e293b', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #4f46e5, #06b6d4)', borderRadius: 6 }}/>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#a5b4fc' }}>65%</span>
            </div>
          </div>
        </MOSCard>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <button style={{
            ...quickAction, background: 'linear-gradient(180deg, #25D366, #1FAB54)',
            color: '#fff', boxShadow: '0 4px 14px -4px rgba(37,211,102,0.5)',
            border: '1px solid #1FAB54',
          }}>
            <Icons.Whatsapp size={18}/>
            <span>WhatsApp</span>
          </button>
          <button style={quickAction}>
            <Icons.Mail size={16} color="#a5b4fc"/>
            <span style={{ color: '#cbd5e1' }}>Mensaje</span>
          </button>
        </div>

        {/* Mini timeline */}
        <MOSCard padding={16} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 12 }}>Próximo hito</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              background: 'rgba(99,102,241,0.15)', border: '2px solid #6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 4px rgba(99,102,241,0.1), 0 0 12px rgba(99,102,241,0.4)',
            }}>
              <Icons.Clock size={14} color="#a5b4fc"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Desarrollo iterativo</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>cierra el 12 de mayo</div>
            </div>
            <Icons.ChevronRight size={16} color="#64748b"/>
          </div>
        </MOSCard>

        {/* Recent */}
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Reciente
        </div>
        <MOSCard padding={14} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <MOSAvatar name="Mario" size={28}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Mario</span>
                <span style={{ width: 5, height: 5, borderRadius: 3, background: '#6366f1' }}/>
                <span style={{ fontSize: 10, color: '#64748b', marginLeft: 'auto' }}>2h</span>
              </div>
              <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4, lineHeight: 1.4 }}>
                Ya terminamos la pantalla de onboarding. Te dejé un Loom con el recorrido.
              </div>
            </div>
          </div>
        </MOSCard>
      </div>

      {/* Floating dock */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, right: 16,
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid #334155',
        borderRadius: 22, padding: '8px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        boxShadow: '0 12px 30px -8px rgba(0,0,0,0.5)',
      }}>
        {[
          { i: <Icons.Dashboard size={18}/>, l: 'Inicio', a: true },
          { i: <Icons.Calendar size={18}/>, l: 'Timeline' },
          { i: <Icons.Mail size={18}/>, l: 'Mensajes', b: true },
          { i: <Icons.File size={18}/>, l: 'Archivos' },
          { i: <Icons.Whatsapp size={18}/>, l: 'WhatsApp' },
        ].map((d, i) => (
          <button key={i} style={{
            position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '8px 4px', border: 'none', background: 'transparent',
            color: d.a ? '#a5b4fc' : '#64748b', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 9, fontWeight: 600,
            borderRadius: 12,
            ...(d.a ? { background: 'rgba(99,102,241,0.12)' } : {}),
          }}>
            {d.i}
            <span>{d.l}</span>
            {d.b && <span style={{
              position: 'absolute', top: 6, right: 8,
              width: 7, height: 7, borderRadius: 4, background: '#ef4444',
            }}/>}
          </button>
        ))}
      </div>
    </div>
  );
};
const quickAction = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  height: 46, borderRadius: 12,
  background: '#0f172a', border: '1px solid #1e293b',
  color: '#f8fafc', fontWeight: 600, fontSize: 13,
  cursor: 'pointer', fontFamily: 'inherit',
};
window.ScreenPortalMobile = ScreenPortalMobile;
