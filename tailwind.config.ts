import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#020617',
          secondary: '#0a0f1f',
          card: '#0f172a',
        },
        border: '#1e293b',
        indigo: {
          DEFAULT: '#6366f1',
          light: '#a5b4fc',
          muted: 'rgba(99,102,241,0.12)',
        },
        whatsapp: '#25D366',
        slate: {
          50: '#f8fafc',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
