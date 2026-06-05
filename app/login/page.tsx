'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#020617' }}>
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="#6366f1"/>
              <rect x="13" y="3" width="8" height="8" rx="2" fill="#a5b4fc" opacity="0.7"/>
              <rect x="3" y="13" width="8" height="8" rx="2" fill="#a5b4fc" opacity="0.7"/>
              <rect x="13" y="13" width="8" height="8" rx="2" fill="#6366f1" opacity="0.4"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#f8fafc' }}>MarioOS</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>WhatsApp Business Platform</p>
        </div>

        {sent ? (
          <div className="text-center p-6 rounded-xl" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <div className="text-3xl mb-3">✉️</div>
            <p className="font-semibold mb-1" style={{ color: '#f8fafc' }}>Check your email</p>
            <p className="text-sm" style={{ color: '#64748b' }}>
              We sent a login link to <span style={{ color: '#a5b4fc' }}>{email}</span>
            </p>
          </div>
        ) : (
          <div className="rounded-xl p-6" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5"
                  style={{ color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
                  style={{
                    background: '#020617',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = '#1e293b')}
                />
              </div>

              {error && (
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(244,63,94,0.1)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.2)' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity"
                style={{ background: '#6366f1', color: '#fff', opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: '#1e293b' }}/>
              <span className="text-xs" style={{ color: '#475569' }}>or</span>
              <div className="flex-1 h-px" style={{ background: '#1e293b' }}/>
            </div>

            <button
              onClick={handleGoogle}
              className="w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              style={{ background: '#0a0f1f', border: '1px solid #1e293b', color: '#f8fafc' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
