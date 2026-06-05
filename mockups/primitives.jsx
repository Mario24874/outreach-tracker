// Shared primitives for MarioOS screens.
// Logo, icons (inline SVG), badges, glowing cards, basic UI elements.
// Exported to window so all screen files can use them.

const { useState, useEffect, useRef, useMemo } = React;

// ---------- DESIGN TOKENS ----------
const MOS_TOKENS = {
  bg: '#020617',        // slate-950
  surface: '#0f172a',   // slate-900
  card: '#1e293b',      // slate-800
  border: '#334155',    // slate-700
  borderDim: '#1e293b',
  accent: '#6366f1',    // indigo-500
  accentHi: '#818cf8',  // indigo-400
  accentLo: '#4f46e5',  // indigo-600
  cyan: '#06b6d4',
  text: '#f8fafc',
  textDim: '#94a3b8',
  textMuted: '#64748b',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  whatsapp: '#25D366',
};
window.MOS_TOKENS = MOS_TOKENS;

// ---------- APP STATE (lang + theme) ----------
const MOSContext = React.createContext({
  lang: 'es', theme: 'dark',
  setLang: () => {}, setTheme: () => {},
});
window.MOSContext = MOSContext;

const MOSProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('mos.lang') || 'es');
  const [theme, setTheme] = useState(() => localStorage.getItem('mos.theme') || 'dark');
  useEffect(() => { localStorage.setItem('mos.lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('mos.theme', theme); }, [theme]);
  return (
    <MOSContext.Provider value={{ lang, theme, setLang, setTheme }}>
      {children}
    </MOSContext.Provider>
  );
};
window.MOSProvider = MOSProvider;
const useApp = () => React.useContext(MOSContext);
window.useApp = useApp;

// i18n dictionary — covers landing + login + a few shared strings.
// For other screens we keep Spanish (brief base) but they still respect the lang flag in select labels.
const MOS_I18N = {
  es: {
    nav_product: 'Producto', nav_clients: 'Clientes', nav_contact: 'Contacto',
    nav_signin: 'Iniciar sesión',
    badge_v1: 'v1.0 · El portal está en línea',
    hero_h1_a: 'Tu espacio para seguir',
    hero_h1_b: 'cada detalle del proyecto.',
    hero_sub: 'Un portal privado donde ves el avance, hablas conmigo por WhatsApp y guardas todo el historial en un solo lugar.',
    cta_primary: 'Acceder a mi portal',
    cta_secondary: 'Escribir a Mario',
    cta_status: 'Acceso por magic link',
    cta_host: 'Hospedado en app.mariomoreno.work',
    feat_1_t: 'Estado en tiempo real',
    feat_1_b: 'Hitos, porcentaje de avance y última actualización siempre visibles.',
    feat_2_t: 'WhatsApp directo',
    feat_2_b: 'Habla conmigo desde el mismo portal. Sin formularios, sin tickets.',
    feat_3_t: 'Historial completo',
    feat_3_b: 'Cada mensaje, archivo y solicitud queda guardado y buscable.',
    login_quote_a: 'Construyamos algo',
    login_quote_b: 'extraordinario',
    login_quote_sub: 'Tu portal MarioOS te conecta directamente al equipo. Acceso seguro, comunicación clara y todo tu proyecto en un solo lugar.',
    login_secure: 'Autenticación protegida · cifrado de extremo a extremo',
    login_title: 'Accede a tu portal',
    login_sub: 'Inicia sesión con tu correo o cuenta social',
    login_email: 'Correo electrónico',
    login_magic: 'Enviar magic link',
    login_or: 'O CONTINÚA CON',
    login_new: '¿Eres nuevo cliente?', login_new_link: 'Contacta a Mario',
    login_steps: 'Verificando · Cargando datos · Bienvenido',
    tagline: 'Tu proyecto, bajo control',
  },
  en: {
    nav_product: 'Product', nav_clients: 'Clients', nav_contact: 'Contact',
    nav_signin: 'Sign in',
    badge_v1: 'v1.0 · The portal is live',
    hero_h1_a: 'Your space to follow',
    hero_h1_b: 'every detail of the project.',
    hero_sub: 'A private portal where you see progress, message me on WhatsApp, and keep every conversation in one place.',
    cta_primary: 'Access my portal',
    cta_secondary: 'Message Mario',
    cta_status: 'Magic-link access',
    cta_host: 'Hosted at app.mariomoreno.work',
    feat_1_t: 'Real-time status',
    feat_1_b: 'Milestones, progress percentage and the latest update — always visible.',
    feat_2_t: 'Direct WhatsApp',
    feat_2_b: 'Chat with me right from the portal. No forms, no tickets.',
    feat_3_t: 'Full history',
    feat_3_b: 'Every message, file and request is stored and searchable.',
    login_quote_a: "Let's build something",
    login_quote_b: 'extraordinary',
    login_quote_sub: 'MarioOS connects you directly to the team. Secure access, clear communication, your whole project in one place.',
    login_secure: 'Secured authentication · end-to-end encrypted',
    login_title: 'Access your portal',
    login_sub: 'Sign in with email or a social account',
    login_email: 'Email address',
    login_magic: 'Send magic link',
    login_or: 'OR CONTINUE WITH',
    login_new: 'New client?', login_new_link: 'Reach Mario',
    login_steps: 'Verifying · Loading data · Welcome',
    tagline: 'Your project, under control',
  },
};
window.MOS_I18N = MOS_I18N;
const useT = () => {
  const { lang } = useApp();
  return (k) => (MOS_I18N[lang] && MOS_I18N[lang][k]) || k;
};
window.useT = useT;

// Theme palettes for public screens (dark = brand default, light = inverted)
const MOS_THEMES = {
  dark: {
    bg: '#020617', surface: '#0f172a', card: '#0f172a', border: '#1e293b',
    text: '#f8fafc', textDim: '#94a3b8', textMuted: '#64748b',
    cardBg: 'rgba(15,23,42,0.7)', cardBorder: '#1e293b',
    inputBg: '#020617', inputBorder: '#334155',
    controlsBg: 'rgba(15,23,42,0.7)', controlsBorder: '#1e293b',
    gridColor: 'rgba(148,163,184,0.05)',
    auroraOpacity: 1.0,
    headingGrad: 'linear-gradient(180deg, #f8fafc 0%, #94a3b8 130%)',
  },
  light: {
    bg: '#f8fafc', surface: '#ffffff', card: '#ffffff', border: '#e2e8f0',
    text: '#0f172a', textDim: '#475569', textMuted: '#64748b',
    cardBg: 'rgba(255,255,255,0.85)', cardBorder: '#e2e8f0',
    inputBg: '#f8fafc', inputBorder: '#cbd5e1',
    controlsBg: 'rgba(255,255,255,0.85)', controlsBorder: '#e2e8f0',
    gridColor: 'rgba(15,23,42,0.06)',
    auroraOpacity: 0.45,
    headingGrad: 'linear-gradient(180deg, #0f172a 0%, #475569 140%)',
  },
};
window.MOS_THEMES = MOS_THEMES;
const useTheme = () => MOS_THEMES[useApp().theme] || MOS_THEMES.dark;
window.useTheme = useTheme;

// ---------- LANG + THEME CONTROLS PILL ----------
const MOSControls = ({ floating = false, style = {} }) => {
  const { lang, setLang, theme, setTheme } = useApp();
  const T = useTheme();
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: T.controlsBg, border: `1px solid ${T.controlsBorder}`,
      borderRadius: 999, padding: 4,
      backdropFilter: 'blur(12px)',
      boxShadow: floating ? '0 8px 24px -8px rgba(0,0,0,0.3)' : 'none',
      ...(floating ? { position: 'absolute', top: 24, right: 24, zIndex: 10 } : {}),
      ...style,
    }}>
      {/* Lang segmented */}
      <div style={{ display: 'flex', background: theme === 'dark' ? '#020617' : '#f1f5f9', borderRadius: 999, padding: 2 }}>
        {['es','en'].map(code => (
          <button key={code} onClick={() => setLang(code)} style={{
            padding: '5px 12px', fontSize: 11, fontWeight: 700,
            borderRadius: 999, border: 'none', cursor: 'pointer',
            background: lang === code
              ? 'linear-gradient(180deg, #6366f1, #4f46e5)'
              : 'transparent',
            color: lang === code ? '#fff' : T.textDim,
            boxShadow: lang === code ? '0 2px 8px -2px rgba(99,102,241,0.5)' : 'none',
            fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.06em',
            transition: 'all .15s',
          }}>{code}</button>
        ))}
      </div>
      {/* Divider */}
      <span style={{ width: 1, height: 18, background: T.border }}/>
      {/* Theme toggle */}
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{
        width: 32, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: theme === 'dark' ? '#020617' : '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: T.text, transition: 'background .15s',
      }} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
        {theme === 'dark' ? (
          // moon
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
          </svg>
        ) : (
          // sun
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
        )}
      </button>
    </div>
  );
};
window.MOSControls = MOSControls;

// ---------- ANIMATED LOGO (the GIF) ----------
const MOSLogoAnimated = ({ size = 96, halo = true, style = {} }) => (
  <div style={{
    position: 'relative', width: size, height: size, flexShrink: 0, ...style,
  }}>
    {halo && (
      <>
        <div style={{
          position: 'absolute', inset: '-12%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.45), transparent 65%)',
          filter: 'blur(20px)', animation: 'mos-halo 3.6s ease-in-out infinite',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', inset: '-25%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)',
          filter: 'blur(30px)', animation: 'mos-halo 5s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}/>
      </>
    )}
    <img
      src="assets/logo-animated.gif"
      alt="MarioOS"
      width={size} height={size}
      style={{
        position: 'relative',
        width: size, height: size, borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        filter: 'drop-shadow(0 8px 24px rgba(99,102,241,0.4))',
      }}
    />
    <style>{`
      @keyframes mos-halo {
        0%,100% { transform: scale(1); opacity: .9; }
        50%     { transform: scale(1.1); opacity: 1; }
      }
    `}</style>
  </div>
);
window.MOSLogoAnimated = MOSLogoAnimated;

// ---------- LOGO ----------
// Static MM monogram (kept for nav/sidebar where the GIF would be too heavy).
const MOSLogo = ({ size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: size/2,
    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 18px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
    color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 800,
    fontSize: size * 0.42, letterSpacing: '-0.04em',
    flexShrink: 0,
    position: 'relative', overflow: 'hidden',
  }}>
    {/* Subtle code glyph behind MM */}
    <span style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.12)', fontSize: size * 0.34, fontFamily: 'JetBrains Mono, monospace',
      fontWeight: 700, letterSpacing: '-0.06em',
    }}>{'</>'}</span>
    <span style={{ position: 'relative' }}>MM</span>
  </div>
);
window.MOSLogo = MOSLogo;

const MOSWordmark = ({ size = 32, withTagline = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <MOSLogo size={size} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <span style={{ color: '#f8fafc', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: size * 0.52, letterSpacing: '-0.02em', lineHeight: 1 }}>MarioOS</span>
      {withTagline && (
        <span style={{ color: '#64748b', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: size * 0.32, lineHeight: 1.2, marginTop: 3 }}>
          Tu proyecto, bajo control
        </span>
      )}
    </div>
  </div>
);
window.MOSWordmark = MOSWordmark;

// ---------- ICON SET ---------- (Lucide-ish, stroke-based, 1.5w)
const I = (path, viewBox = '0 0 24 24') => ({ size = 16, color = 'currentColor', strokeWidth = 1.7, style = {} }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {path}
  </svg>
);

const Icons = {
  Dashboard: I(<><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>),
  Users: I(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
  Mail: I(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></>),
  Whatsapp: I(<><path d="M3 21l1.6-5.8A8.5 8.5 0 1 1 8.2 19L3 21z"/><path d="M8.5 9.5c.2 2 2 4 4 4.5l1-1.5 2.5 1.2c-.3 1.4-1.4 2.3-2.8 2.3a5 5 0 0 1-5-5c0-1.4.9-2.5 2.3-2.8L11.5 11l-1.5 1c-.5-.5-1.3-1.5-1.5-2.5z"/></>),
  Folder: I(<><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></>),
  Settings: I(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>),
  Bell: I(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>),
  Search: I(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>),
  Plus: I(<><path d="M12 5v14M5 12h14"/></>),
  Check: I(<><path d="M20 6 9 17l-5-5"/></>),
  ArrowRight: I(<><path d="M5 12h14M13 5l7 7-7 7"/></>),
  ArrowUpRight: I(<><path d="M7 17 17 7M7 7h10v10"/></>),
  Clock: I(<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>),
  Pause: I(<><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></>),
  Sparkles: I(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>),
  Send: I(<><path d="m22 2-11 11M22 2l-7 20-4-9-9-4 20-7z"/></>),
  Paperclip: I(<><path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 1 1-2.8-2.8l8.5-8.5"/></>),
  Mic: I(<><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></>),
  Smile: I(<><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></>),
  Upload: I(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></>),
  Menu: I(<><path d="M3 6h18M3 12h18M3 18h18"/></>),
  ChevronRight: I(<><path d="m9 6 6 6-6 6"/></>),
  ChevronDown: I(<><path d="m6 9 6 6 6-6"/></>),
  Globe: I(<><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></>),
  Building: I(<><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M10 22v-4h4v4"/></>),
  Phone: I(<><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.9 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6A2 2 0 0 1 22 16.9z"/></>),
  Calendar: I(<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>),
  Flame: I(<><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c2 0 3-2 3-4 0-1-.5-2-1.5-3 0 1-1 2-2 2.5-1 .5-2 1-2 3 0-1.5-1-2.5-2-3-1 0-2 1.5-2 4 0 4.5 3.5 8 8 8s8-3.5 8-8c0-3-2.5-7-6-9 .5 3-1 5-3 7"/></>),
  TrendUp: I(<><path d="m3 17 6-6 4 4 8-8M14 7h7v7"/></>),
  File: I(<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M10 13h4M10 17h4"/></>),
  Logout: I(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></>),
  Eye: I(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>),
  X: I(<><path d="M18 6 6 18M6 6l12 12"/></>),
  CircleDot: I(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></>),
  Github: I(<><path d="M15 22v-4a4 4 0 0 0-1-3c3 0 6-2 6-5 0-1.3-.5-2.5-1.4-3.4.4-1 .4-2.2-.1-3.2 0 0-1 0-3 1.5a10.4 10.4 0 0 0-5 0C8.5 3.4 7.5 3.4 7.5 3.4c-.5 1-.5 2.2-.1 3.2A4.7 4.7 0 0 0 6 10c0 3 3 5 6 5a4 4 0 0 0-1 3v4"/><path d="M9 18c-4 1.3-4-2-6-2"/></>),
  Google: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c2-1.8 3.1-4.5 3.1-7.8z"/>
      <path fill="#34A853" d="M12 22c2.7 0 5-1 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22z"/>
      <path fill="#FBBC04" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6z"/>
      <path fill="#EA4335" d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 12 2 10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.6 9.4 5.8 12 5.8z"/>
    </svg>
  ),
};
window.Icons = Icons;

// ---------- BADGES / PILLS ----------
const MOSBadge = ({ children, tone = 'slate', dot = false, glow = false, style = {} }) => {
  const { theme } = useApp();
  const light = theme === 'light';
  // Two palettes per tone: dark theme keeps the pale-on-dark vibe; light theme uses
  // saturated text + tinted bg so badges stay legible on white.
  const tonesDark = {
    slate:   { bg: 'rgba(51,65,85,0.5)',  fg: '#cbd5e1', ring: 'rgba(100,116,139,0.4)' },
    indigo:  { bg: 'rgba(99,102,241,0.15)', fg: '#a5b4fc', ring: 'rgba(99,102,241,0.4)' },
    green:   { bg: 'rgba(34,197,94,0.13)',  fg: '#86efac', ring: 'rgba(34,197,94,0.4)'   },
    amber:   { bg: 'rgba(245,158,11,0.13)', fg: '#fcd34d', ring: 'rgba(245,158,11,0.4)'  },
    red:     { bg: 'rgba(239,68,68,0.13)',  fg: '#fca5a5', ring: 'rgba(239,68,68,0.4)'   },
    cyan:    { bg: 'rgba(6,182,212,0.13)',  fg: '#67e8f9', ring: 'rgba(6,182,212,0.4)'   },
    rose:    { bg: 'rgba(244,63,94,0.13)',  fg: '#fda4af', ring: 'rgba(244,63,94,0.4)'   },
    purple:  { bg: 'rgba(168,85,247,0.13)', fg: '#d8b4fe', ring: 'rgba(168,85,247,0.4)'  },
    blue:    { bg: 'rgba(59,130,246,0.13)', fg: '#93c5fd', ring: 'rgba(59,130,246,0.4)'  },
    orange:  { bg: 'rgba(249,115,22,0.13)', fg: '#fdba74', ring: 'rgba(249,115,22,0.4)'  },
  };
  const tonesLight = {
    slate:   { bg: 'rgba(100,116,139,0.10)', fg: '#334155', ring: 'rgba(100,116,139,0.35)' },
    indigo:  { bg: 'rgba(99,102,241,0.10)',  fg: '#4338ca', ring: 'rgba(99,102,241,0.4)'   },
    green:   { bg: 'rgba(34,197,94,0.10)',   fg: '#15803d', ring: 'rgba(34,197,94,0.4)'    },
    amber:   { bg: 'rgba(245,158,11,0.12)',  fg: '#92400e', ring: 'rgba(245,158,11,0.4)'   },
    red:     { bg: 'rgba(239,68,68,0.10)',   fg: '#b91c1c', ring: 'rgba(239,68,68,0.4)'    },
    cyan:    { bg: 'rgba(6,182,212,0.10)',   fg: '#0e7490', ring: 'rgba(6,182,212,0.4)'    },
    rose:    { bg: 'rgba(244,63,94,0.10)',   fg: '#be123c', ring: 'rgba(244,63,94,0.4)'    },
    purple:  { bg: 'rgba(168,85,247,0.10)',  fg: '#6b21a8', ring: 'rgba(168,85,247,0.4)'   },
    blue:    { bg: 'rgba(59,130,246,0.10)',  fg: '#1d4ed8', ring: 'rgba(59,130,246,0.4)'   },
    orange:  { bg: 'rgba(249,115,22,0.10)',  fg: '#c2410c', ring: 'rgba(249,115,22,0.4)'   },
  };
  const tones = light ? tonesLight : tonesDark;
  const t = tones[tone] || tones.slate;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999,
      background: t.bg, color: t.fg,
      fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.01em',
      boxShadow: `inset 0 0 0 1px ${t.ring}` + (glow ? `, 0 0 18px ${t.ring}` : ''),
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 3, background: t.fg, boxShadow: glow ? `0 0 8px ${t.fg}` : 'none' }} />}
      {children}
    </span>
  );
};
window.MOSBadge = MOSBadge;

// Industry badges with brief-defined sector colors.
const INDUSTRY_TONE = {
  'Dental': 'rose', 'Clínica': 'rose', 'Salud': 'rose',
  'Hoteles': 'amber', 'Turismo': 'amber',
  'Educación': 'blue',
  'Inmobiliaria': 'green',
  'Legal': 'purple', 'Contable': 'purple',
  'Software': 'cyan', 'Marketing': 'cyan', 'SaaS': 'cyan',
  'Agencia viajes': 'orange',
};
window.INDUSTRY_TONE = INDUSTRY_TONE;

// ---------- CARD WITH GLOW (Card Spotlight style) ----------
const MOSCard = ({ children, glow = false, hover = true, padding = 20, style = {}, ...rest }) => {
  const [pos, setPos] = useState({ x: -200, y: -200, active: false });
  return (
    <div
      onMouseMove={(e) => {
        if (!hover) return;
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top, active: true });
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, active: false }))}
      style={{
        position: 'relative', overflow: 'hidden',
        background: '#0f172a',
        border: `1px solid ${glow ? 'rgba(99,102,241,0.45)' : '#1e293b'}`,
        borderRadius: 14,
        padding,
        boxShadow: glow
          ? '0 0 0 1px rgba(99,102,241,0.3), 0 12px 40px -8px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.03)'
          : '0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px -10px rgba(0,0,0,0.6)',
        transition: 'border-color .2s, box-shadow .2s',
        ...style,
      }}
      {...rest}
    >
      {hover && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity: pos.active ? 1 : 0, transition: 'opacity .25s',
          background: `radial-gradient(220px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.10), transparent 60%)`,
        }} />
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
};
window.MOSCard = MOSCard;

// ---------- BUTTON ----------
const MOSButton = ({ children, variant = 'primary', size = 'md', leftIcon, rightIcon, style = {}, ...rest }) => {
  const sizes = {
    sm: { p: '7px 12px', fs: 12, h: 30 },
    md: { p: '10px 16px', fs: 13, h: 38 },
    lg: { p: '13px 22px', fs: 14, h: 46 },
  };
  const s = sizes[size];
  const variants = {
    primary: {
      background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
      color: '#fff', border: '1px solid #4f46e5',
      boxShadow: '0 4px 14px -4px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
    },
    secondary: {
      background: 'rgba(30,41,59,0.6)', color: '#f8fafc',
      border: '1px solid #334155',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    },
    ghost: {
      background: 'transparent', color: '#cbd5e1',
      border: '1px solid transparent',
    },
    whatsapp: {
      background: 'linear-gradient(180deg, #25D366 0%, #1FAB54 100%)',
      color: '#fff', border: '1px solid #1FAB54',
      boxShadow: '0 4px 14px -4px rgba(37,211,102,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
    },
  };
  const v = variants[variant];
  return (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: s.p, height: s.h, borderRadius: 10,
        fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: s.fs,
        letterSpacing: '-0.005em', cursor: 'pointer',
        transition: 'transform .12s ease, filter .15s ease',
        ...v, ...style,
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
      onMouseUp={(e) => e.currentTarget.style.transform = ''}
      onMouseLeave={(e) => e.currentTarget.style.transform = ''}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};
window.MOSButton = MOSButton;

// ---------- AVATAR ----------
const initials = (name) => name.split(' ').map(s => s[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
const avatarHue = (s) => {
  let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};
const MOSAvatar = ({ name, size = 32, ring = false, src }) => {
  const h = avatarHue(name || 'X');
  return (
    <div style={{
      width: size, height: size, borderRadius: size/2,
      background: src ? `center/cover url(${src})` : `linear-gradient(135deg, hsl(${h} 55% 35%), hsl(${(h+40)%360} 55% 50%))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700,
      fontSize: size * 0.4, letterSpacing: '-0.02em',
      flexShrink: 0,
      boxShadow: ring ? '0 0 0 2px #0f172a, 0 0 0 3px rgba(99,102,241,0.5)' : 'inset 0 1px 0 rgba(255,255,255,0.15)',
    }}>{!src && initials(name || '?')}</div>
  );
};
window.MOSAvatar = MOSAvatar;

// ---------- ANIMATED BEAMS BG (Aceternity-style "Background Beams") ----------
// Diagonal animated beams + radial spotlight that follows cursor + grid.
// Theme-aware: brightens for light mode.
const AnimatedBeams = ({ children, style = {}, intensity = 1, dark = true }) => {
  const ref = useRef(null);
  const [mp, setMp] = useState({ x: '50%', y: '30%' });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setMp({ x: `${e.clientX - r.left}px`, y: `${e.clientY - r.top}px` });
      }}
      style={{
        position: 'relative', overflow: 'hidden',
        background: dark ? '#020617' : '#f8fafc',
        ...style,
      }}
    >
      {/* Aurora blobs */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: dark ? [
          `radial-gradient(ellipse 55% 45% at 20% 15%, rgba(99,102,241,${0.30*intensity}), transparent 60%)`,
          `radial-gradient(ellipse 45% 35% at 85% 25%, rgba(6,182,212,${0.24*intensity}), transparent 60%)`,
          `radial-gradient(ellipse 65% 45% at 50% 105%, rgba(79,70,229,${0.32*intensity}), transparent 60%)`,
        ].join(',') : [
          `radial-gradient(ellipse 55% 45% at 20% 15%, rgba(99,102,241,0.18), transparent 60%)`,
          `radial-gradient(ellipse 45% 35% at 85% 25%, rgba(6,182,212,0.14), transparent 60%)`,
          `radial-gradient(ellipse 65% 45% at 50% 105%, rgba(99,102,241,0.16), transparent 60%)`,
        ].join(','),
        filter: 'blur(10px)',
        animation: 'mos-aurora 18s ease-in-out infinite alternate',
      }}/>

      {/* Animated diagonal beams */}
      <svg style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', opacity: dark ? 0.55 : 0.35,
      }} preserveAspectRatio="none" viewBox="0 0 1000 700">
        <defs>
          {[0,1,2,3,4,5].map(i => (
            <linearGradient key={i} id={`beam-${i}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="50%" stopColor={['#6366f1','#06b6d4','#818cf8','#22d3ee','#4f46e5','#67e8f9'][i]} stopOpacity="0.6"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          ))}
        </defs>
        {[0,1,2,3,4,5].map(i => {
          const x = 60 + i * 160;
          const dur = 6 + (i % 3) * 2.5;
          const delay = -i * 1.6;
          return (
            <line key={i} x1={x} y1="-200" x2={x + 80} y2="900" stroke={`url(#beam-${i})`} strokeWidth="1.4">
              <animate attributeName="y1" values="-300;700" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite"/>
              <animate attributeName="y2" values="-50;950" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite"/>
            </line>
          );
        })}
      </svg>

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: [
          `linear-gradient(${dark ? 'rgba(148,163,184,0.05)' : 'rgba(15,23,42,0.05)'} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${dark ? 'rgba(148,163,184,0.05)' : 'rgba(15,23,42,0.05)'} 1px, transparent 1px)`,
        ].join(','),
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, #000 30%, transparent 90%)',
      }}/>

      {/* Cursor spotlight */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(circle 380px at ${mp.x} ${mp.y}, rgba(99,102,241,${dark ? 0.18 : 0.10}), transparent 70%)`,
        transition: 'background .12s',
      }}/>

      {/* Dotted noise overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 1px, transparent 0)`,
        backgroundSize: '28px 28px',
      }}/>

      <div style={{ position: 'relative', height: '100%' }}>{children}</div>

      <style>{`
        @keyframes mos-aurora {
          0%   { transform: translate3d(0,0,0) scale(1); }
          50%  { transform: translate3d(-2%, 2%, 0) scale(1.05); }
          100% { transform: translate3d(2%, -1%, 0) scale(1.03); }
        }
      `}</style>
    </div>
  );
};
window.AnimatedBeams = AnimatedBeams;

// ---------- AURORA BG (radial gradients, subtle motion) ----------
const AuroraBG = ({ intensity = 1, children, style = {} }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: '#020617', ...style }}>
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: [
        `radial-gradient(ellipse 60% 50% at 20% 10%, rgba(99,102,241,${0.28*intensity}), transparent 60%)`,
        `radial-gradient(ellipse 50% 40% at 85% 30%, rgba(6,182,212,${0.22*intensity}), transparent 60%)`,
        `radial-gradient(ellipse 70% 50% at 50% 110%, rgba(79,70,229,${0.30*intensity}), transparent 60%)`,
      ].join(','),
      filter: 'blur(10px)',
    }} />
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
      backgroundSize: '32px 32px',
      maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 80%)',
    }} />
    <div style={{ position: 'relative', height: '100%' }}>{children}</div>
  </div>
);
window.AuroraBG = AuroraBG;

// ---------- GRID OVERLAY (subtle background pattern) ----------
const GridBG = ({ opacity = 0.5, style = {} }) => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
    backgroundImage: [
      `linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px)`,
      `linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)`,
    ].join(','),
    backgroundSize: '40px 40px',
    maskImage: 'radial-gradient(ellipse 60% 70% at 50% 30%, #000 40%, transparent 90%)',
    ...style,
  }} />
);
window.GridBG = GridBG;

// ---------- INDUSTRY HELPER ----------
window.industryTone = (name) => INDUSTRY_TONE[name] || 'slate';

// ---------- FAUX SPARK / MICRO-CHART ----------
const Sparkline = ({ data, color = '#6366f1', width = 120, height = 32, fill = true }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = (max - min) || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 4) - 2]);
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const fillPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const fillId = useMemo(() => 'spark-' + Math.random().toString(36).slice(2,9), []);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && (
        <>
          <defs>
            <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={fillPath} fill={`url(#${fillId})`} />
        </>
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
window.Sparkline = Sparkline;

// ---------- BAR CHART ----------
const BarChart = ({ data, color = '#6366f1', width = 320, height = 90, gap = 2 }) => {
  const max = Math.max(...data);
  const bw = (width - gap * (data.length - 1)) / data.length;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 2);
        return (
          <rect key={i} x={i * (bw + gap)} y={height - h} width={bw} height={h} rx="2"
            fill={color} opacity={0.35 + 0.65 * (v / max)} />
        );
      })}
    </svg>
  );
};
window.BarChart = BarChart;

// ---------- DONUT ----------
const Donut = ({ segments, size = 120, thickness = 18 }) => {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size/2} ${size/2}) rotate(-90)`}>
        <circle r={r} fill="none" stroke="#1e293b" strokeWidth={thickness}/>
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = `${(c * frac).toFixed(2)} ${c.toFixed(2)}`;
          const off = -c * (acc / total);
          acc += s.value;
          return <circle key={i} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
            strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="butt"/>;
        })}
      </g>
    </svg>
  );
};
window.Donut = Donut;
