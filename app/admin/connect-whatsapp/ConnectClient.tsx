'use client';

import { useCallback, useEffect, useState } from 'react';

// Graph API version used to init the Facebook JS SDK. Embedded Signup v4.
const GRAPH_VERSION = 'v23.0';

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

type Result = { phone_number_id?: string; waba_id?: string };

export default function ConnectClient({
  appId,
  configId,
  userEmail,
}: {
  appId: string;
  configId: string;
  userEmail: string;
}) {
  const [sdkReady, setSdkReady] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const append = useCallback(
    (m: string) =>
      setLog((l) => [...l, `${new Date().toLocaleTimeString()}  ${m}`]),
    []
  );

  useEffect(() => {
    // Capture Embedded Signup session info messages from the Meta popup.
    function onMessage(event: MessageEvent) {
      if (!event.origin.endsWith('facebook.com')) return;
      let data: any;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return; // non-JSON postMessage (SDK noise) — ignore
      }
      if (data?.type !== 'WA_EMBEDDED_SIGNUP') return;
      append(`event: ${data.event} ${JSON.stringify(data.data ?? {})}`);
      // Coexistence onboarding completes with FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING,
      // which returns phone_number_id + waba_id. (FINISH is the classic flow.)
      if (
        data.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING' ||
        data.event === 'FINISH'
      ) {
        setResult({
          phone_number_id: data.data?.phone_number_id,
          waba_id: data.data?.waba_id,
        });
      }
    }
    window.addEventListener('message', onMessage);

    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        autoLogAppEvents: true,
        xfbml: false,
        version: GRAPH_VERSION,
      });
      setSdkReady(true);
      append(`FB SDK inicializado (${GRAPH_VERSION})`);
    };

    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      document.body.appendChild(js);
    }

    return () => window.removeEventListener('message', onMessage);
  }, [appId, append]);

  const launch = useCallback(() => {
    if (!window.FB) {
      append('FB SDK aún no está listo, espera unos segundos.');
      return;
    }
    setResult(null);
    setAuthCode(null);
    append('Lanzando Embedded Signup (coexistence)…');
    window.FB.login(
      (response: any) => {
        if (response?.authResponse?.code) {
          setAuthCode(response.authResponse.code);
          append('Auth code recibido (response_type=code).');
        } else {
          append(`login finalizó sin code: ${JSON.stringify(response?.status ?? response)}`);
        }
      },
      {
        config_id: configId,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          featureType: 'whatsapp_business_app_onboarding',
          sessionInfoVersion: '3',
        },
      }
    );
  }, [configId, append]);

  const labelStyle = { color: '#94a3b8', fontSize: 13 } as const;
  const codeStyle = {
    color: '#a5b4fc',
    background: '#0f172a',
    padding: '2px 8px',
    borderRadius: 6,
    fontFamily: 'monospace',
    fontSize: 14,
    wordBreak: 'break-all' as const,
  } as const;

  return (
    <div
      style={{
        background: '#020617',
        minHeight: '100vh',
        color: '#f8fafc',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
          Connect WhatsApp — Coexistence
        </h1>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 28 }}>
          Embedded Signup v4 · featureType: whatsapp_business_app_onboarding · {userEmail}
        </p>

        {!configId && (
          <div
            style={{
              border: '1px solid #7f1d1d',
              background: '#1f0b0b',
              color: '#fecaca',
              borderRadius: 10,
              padding: 16,
              marginBottom: 24,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong>Falta configuración.</strong> Define la env var{' '}
            <code style={codeStyle}>META_ES_CONFIG_ID</code> con el ID de la
            configuración de Embedded Signup (App Dashboard → WhatsApp → Embedded
            Signup → Configurations). Sin ella el flujo no puede lanzarse.
          </div>
        )}

        <button
          onClick={launch}
          disabled={!sdkReady || !configId}
          style={{
            background: !sdkReady || !configId ? '#1e293b' : '#25D366',
            color: !sdkReady || !configId ? '#64748b' : '#04210f',
            border: 'none',
            borderRadius: 10,
            padding: '14px 22px',
            fontSize: 15,
            fontWeight: 700,
            cursor: !sdkReady || !configId ? 'not-allowed' : 'pointer',
          }}
        >
          {sdkReady ? 'Conectar WhatsApp Business App' : 'Cargando SDK…'}
        </button>

        {result && (
          <div
            style={{
              marginTop: 28,
              border: '1px solid #14532d',
              background: '#04210f',
              borderRadius: 10,
              padding: 18,
            }}
          >
            <p style={{ color: '#86efac', fontWeight: 700, marginBottom: 12 }}>
              ✓ Onboarding completado
            </p>
            <p style={{ marginBottom: 8 }}>
              <span style={labelStyle}>phone_number_id: </span>
              <span style={codeStyle}>{result.phone_number_id ?? '—'}</span>
            </p>
            <p>
              <span style={labelStyle}>waba_id: </span>
              <span style={codeStyle}>{result.waba_id ?? '—'}</span>
            </p>
            <p style={{ color: '#64748b', fontSize: 12, marginTop: 12 }}>
              Pásale estos valores al admin para actualizar META_PHONE_NUMBER_ID
              si cambió. NO se ejecuta el paso de register (el número ya está
              registrado).
            </p>
          </div>
        )}

        {authCode && (
          <p style={{ marginTop: 16 }}>
            <span style={labelStyle}>auth code: </span>
            <span style={codeStyle}>{authCode}</span>
          </p>
        )}

        <div style={{ marginTop: 32 }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Log</p>
          <pre
            style={{
              background: '#0b1120',
              border: '1px solid #1e293b',
              borderRadius: 8,
              padding: 12,
              fontSize: 12,
              color: '#94a3b8',
              whiteSpace: 'pre-wrap',
              minHeight: 80,
              maxHeight: 280,
              overflow: 'auto',
            }}
          >
            {log.length ? log.join('\n') : 'Esperando…'}
          </pre>
        </div>
      </div>
    </div>
  );
}
