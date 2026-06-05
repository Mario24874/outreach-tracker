// Public screens: Landing + Login (theme + i18n aware, animated logo, beams bg)

const { MOSLogo, MOSLogoAnimated, MOSWordmark, MOSCard, MOSButton, MOSBadge, MOSAvatar,
        AuroraBG, AnimatedBeams, GridBG, Icons, MOSControls } = window;

// ============ LANDING ============
const ScreenLanding = () => {
  const T = window.useTheme();
  const t = window.useT();
  const { theme } = window.useApp();
  const dark = theme === 'dark';

  return (
    <div style={{
      width: '100%', height: '100%', background: T.bg, color: T.text,
      fontFamily: 'Inter, sans-serif', overflow: 'hidden', position: 'relative',
    }}>
      <AnimatedBeams style={{ position: 'absolute', inset: 0 }} dark={dark} intensity={1.1}/>

      {/* Controls top-right */}
      <MOSControls floating/>

      {/* Top nav */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 56px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MOSLogoAnimated size={42} halo={false}/>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: T.text }}>MarioOS</span>
            <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 500 }}>{t('tagline')}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingRight: 180 /* leave room for controls */ }}>
          <a style={navLinkStyle(T)}>{t('nav_product')}</a>
          <a style={navLinkStyle(T)}>{t('nav_clients')}</a>
          <a style={navLinkStyle(T)}>{t('nav_contact')}</a>
          <MOSButton variant={dark ? 'secondary' : 'secondary'} size="sm">{t('nav_signin')}</MOSButton>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '36px 56px 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 24,
      }}>
        {/* BIG animated logo */}
        <MOSLogoAnimated size={150}/>

        <MOSBadge tone="indigo" dot glow style={{ marginTop: 8 }}>
          {t('badge_v1')}
        </MOSBadge>

        <h1 style={{
          margin: 0, fontFamily: 'Inter, sans-serif',
          fontWeight: 700, fontSize: 60, lineHeight: 1.04,
          letterSpacing: '-0.035em', maxWidth: 900,
          background: T.headingGrad,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textWrap: 'balance',
        }}>
          {t('hero_h1_a')}<br/>{t('hero_h1_b')}
        </h1>

        <p style={{
          margin: 0, color: T.textDim, fontSize: 17, lineHeight: 1.55,
          maxWidth: 580, fontWeight: 400, textWrap: 'pretty',
        }}>{t('hero_sub')}</p>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <MOSButton variant="primary" size="lg" rightIcon={<Icons.ArrowRight size={16}/>}>
            {t('cta_primary')}
          </MOSButton>
          <MOSButton variant="secondary" size="lg" leftIcon={<Icons.Whatsapp size={16} color="#25D366"/>}
            style={dark ? {} : { background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0' }}>
            {t('cta_secondary')}
          </MOSButton>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4, color: T.textMuted, fontSize: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}/>
            {t('cta_status')}
          </span>
          <span>·</span>
          <span>{t('cta_host')}</span>
        </div>
      </div>

      {/* Hero preview card (peek at the portal) */}
      <div style={{
        position: 'relative', zIndex: 2, marginTop: 56, padding: '0 56px',
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          width: '100%', maxWidth: 980, height: 260,
          background: dark
            ? 'linear-gradient(180deg, rgba(15,23,42,0.85), rgba(2,6,23,0.85))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.92))',
          border: `1px solid ${dark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.25)'}`,
          borderRadius: 18,
          boxShadow: '0 30px 80px -20px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
          padding: 22,
          backdropFilter: 'blur(10px)',
          display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18,
          overflow: 'hidden',
        }}>
          {/* Mini sidebar mock */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <MOSLogo size={22}/>
              <span style={{ fontWeight: 700, fontSize: 13, color: T.text }}>MarioOS</span>
            </div>
            {['Dashboard','Clientes','Outreach','WhatsApp','Proyectos'].map((l,i) => (
              <div key={l} style={{
                padding: '8px 10px', borderRadius: 8, fontSize: 12,
                color: i===0 ? '#a5b4fc' : T.textMuted,
                background: i===0 ? 'rgba(99,102,241,0.12)' : 'transparent',
                fontWeight: i===0 ? 600 : 500,
              }}>{l}</div>
            ))}
          </div>
          {/* Mini canvas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10 }}>
            {[
              { l: 'Emails / sem', v: '347' },
              { l: 'Activos', v: '12' },
              { l: 'Apertura', v: '38%' },
              { l: 'Pipeline', v: '48' },
              { l: 'Próx. envío', v: 'mar 09:00' },
              { l: 'Conversiones', v: '4' },
            ].map((c, i) => (
              <div key={i} style={{
                background: dark ? 'rgba(30,41,59,0.6)' : 'rgba(241,245,249,0.8)',
                border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
                borderRadius: 10, padding: 12,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 500 }}>{c.l}</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: '-0.02em' }}>{c.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '70px 56px 56px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
      }}>
        {[
          { title: t('feat_1_t'), body: t('feat_1_b'), icon: <Icons.Sparkles size={18} color="#a5b4fc"/> },
          { title: t('feat_2_t'), body: t('feat_2_b'), icon: <Icons.Whatsapp size={18} color="#22c55e"/> },
          { title: t('feat_3_t'), body: t('feat_3_b'), icon: <Icons.File size={18} color="#67e8f9"/> },
        ].map((f, i) => (
          <div key={i} style={{
            position: 'relative',
            background: dark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.7)',
            border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
            borderRadius: 14, padding: 22,
            backdropFilter: 'blur(6px)',
            boxShadow: '0 8px 24px -10px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: T.text }}>{f.title}</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>{f.body}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '24px 56px 32px',
        borderTop: `1px solid ${T.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: T.textMuted, fontSize: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MOSLogo size={20}/>
          <span>MarioOS · app.mariomoreno.work</span>
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <span>mariomoreno.work</span>
          <span>info@mariomoreno.work</span>
          <span>WhatsApp</span>
        </div>
      </div>
    </div>
  );
};
const navLinkStyle = (T) => ({
  color: T.textDim, fontSize: 13, fontWeight: 500,
  cursor: 'pointer', transition: 'color .15s',
});
window.ScreenLanding = ScreenLanding;

// ============ LOGIN ============
const ScreenLogin = () => {
  const T = window.useTheme();
  const t = window.useT();
  const { theme } = window.useApp();
  const dark = theme === 'dark';

  return (
    <div style={{
      width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr',
      background: T.bg, color: T.text, fontFamily: 'Inter, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Controls top-right (over right panel) */}
      <MOSControls floating/>

      {/* Left — animated gradient panel */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#0a0f1f' }}>
        <div style={{
          position: 'absolute', inset: '-20%',
          backgroundImage: [
            `radial-gradient(circle 35% 30% at 30% 30%, rgba(99,102,241,0.55), transparent 60%)`,
            `radial-gradient(circle 30% 25% at 70% 60%, rgba(6,182,212,0.40), transparent 60%)`,
            `radial-gradient(circle 30% 30% at 50% 80%, rgba(79,70,229,0.55), transparent 60%)`,
          ].join(','),
          filter: 'blur(40px)',
          animation: 'mos-loginbg 14s ease-in-out infinite alternate',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}/>
        {/* sparkles */}
        {[...Array(22)].map((_, i) => {
          const x = (i * 137) % 100, y = (i * 79) % 100, s = (i % 3) + 1;
          return <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: s, height: s, borderRadius: s,
            background: '#f8fafc', boxShadow: `0 0 ${s*4}px #f8fafc`,
            opacity: 0.5 + (i % 5) * 0.1,
            animation: `mos-sparkle ${2 + (i%5)*0.6}s ease-in-out ${i*0.13}s infinite`,
          }}/>;
        })}
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <MOSLogoAnimated size={56}/>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>MarioOS</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{t('tagline')}</span>
            </div>
          </div>

          <div style={{ maxWidth: 480 }}>
            <h2 style={{
              margin: 0, fontFamily: 'Inter, sans-serif',
              fontSize: 44, lineHeight: 1.08, fontWeight: 700,
              letterSpacing: '-0.03em', color: '#f8fafc',
              textWrap: 'balance',
            }}>
              {t('login_quote_a')}<br/>
              <span style={{ color: '#a5b4fc' }}>{t('login_quote_b')}</span><span style={{ animation: 'blink 1s steps(2) infinite', color: '#a5b4fc' }}>|</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 15, marginTop: 18, lineHeight: 1.6 }}>
              {t('login_quote_sub')}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: 12 }}>
            <Icons.Sparkles size={14} color="#a5b4fc"/>
            <span>{t('login_secure')}</span>
          </div>
        </div>
        <style>{`
          @keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
          @keyframes mos-loginbg {
            0%   { transform: translate(0,0) scale(1); }
            100% { transform: translate(-3%,2%) scale(1.08); }
          }
          @keyframes mos-sparkle {
            0%,100% { opacity: .25; }
            50%     { opacity: 1; }
          }
        `}</style>
      </div>

      {/* Right — auth card */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: T.bg, padding: 48,
      }}>
        <GridBG opacity={dark ? 0.4 : 0.6}/>
        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: 380,
          background: T.cardBg,
          border: `1px solid ${T.cardBorder}`, borderRadius: 16,
          padding: 32, backdropFilter: 'blur(16px)',
          boxShadow: dark
            ? '0 30px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)'
            : '0 30px 80px -20px rgba(15,23,42,0.15), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}>
          <h3 style={{
            margin: 0, fontSize: 26, fontWeight: 700,
            letterSpacing: '-0.025em', textAlign: 'center', color: T.text,
          }}>{t('login_title')}</h3>
          <p style={{ margin: '6px 0 24px', color: T.textDim, fontSize: 13, textAlign: 'center' }}>
            {t('login_sub')}
          </p>

          {/* Magic link primary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            <label style={{ color: T.textDim, fontSize: 12, fontWeight: 500 }}>{t('login_email')}</label>
            <input
              defaultValue="cliente@empresa.com"
              style={{
                background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                borderRadius: 10, padding: '12px 14px', color: T.text,
                fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
              }}
            />
          </div>
          <MOSButton variant="primary" size="lg" style={{ width: '100%', marginBottom: 16 }}
            rightIcon={<Icons.Sparkles size={14}/>}>
            {t('login_magic')}
          </MOSButton>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            color: T.textMuted, fontSize: 11, fontWeight: 500,
            margin: '18px 0 14px',
          }}>
            <span style={{ flex: 1, height: 1, background: T.border }}/>
            {t('login_or')}
            <span style={{ flex: 1, height: 1, background: T.border }}/>
          </div>

          {/* Social */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <MOSButton variant="secondary" leftIcon={<Icons.Google size={16}/>}
              style={dark ? {} : { background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0' }}>Google</MOSButton>
            <MOSButton variant="secondary" leftIcon={<Icons.Github size={16}/>}
              style={dark ? {} : { background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0' }}>GitHub</MOSButton>
          </div>

          <div style={{ marginTop: 22, fontSize: 12, color: T.textMuted, textAlign: 'center' }}>
            {t('login_new')} <span style={{ color: '#a5b4fc', cursor: 'pointer', fontWeight: 500 }}>{t('login_new_link')}</span>
          </div>
        </div>

        {/* Multi-step loader hint */}
        <div style={{
          position: 'absolute', right: 24, bottom: 20,
          display: 'flex', alignItems: 'center', gap: 8,
          color: T.textMuted, fontSize: 11,
        }}>
          <span style={{ display: 'flex', gap: 4 }}>
            <span style={dotStyle('#6366f1')}/>
            <span style={dotStyle(T.border)}/>
            <span style={dotStyle(T.border)}/>
          </span>
          {t('login_steps')}
        </div>
      </div>
    </div>
  );
};
const dotStyle = (c) => ({ width: 6, height: 6, borderRadius: 3, background: c });
window.ScreenLogin = ScreenLogin;
