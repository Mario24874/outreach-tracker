import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020617',
        padding: 24,
        flex: 1,
      }}
    >
      <SignIn
        appearance={{
          variables: {
            colorBackground: '#0a0f1f',
            colorText: '#f8fafc',
            colorTextSecondary: '#94a3b8',
            colorInputBackground: '#0f172a',
            colorInputText: '#f8fafc',
            colorPrimary: '#6366f1',
            colorNeutral: '#f8fafc',
            colorShimmer: 'rgba(99,102,241,0.1)',
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
          },
          elements: {
            card: { boxShadow: '0 0 0 1px #1e293b, 0 24px 48px rgba(0,0,0,0.4)', background: '#0a0f1f' },
            headerTitle: { color: '#f8fafc' },
            headerSubtitle: { color: '#94a3b8' },
            socialButtonsBlockButton: {
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
            },
            socialButtonsBlockButtonText: { color: '#f8fafc' },
            socialButtonsProviderIcon__apple: { filter: 'invert(1)' },
            dividerLine: { background: '#1e293b' },
            dividerText: { color: '#475569' },
            formFieldLabel: { color: '#94a3b8' },
            formFieldInput: {
              background: '#0f172a',
              border: '1px solid #1e293b',
              color: '#f8fafc',
            },
            formFieldInputShowPasswordButton: { color: '#64748b' },
            formButtonPrimary: {
              background: 'linear-gradient(180deg,#6366f1,#4f46e5)',
              boxShadow: '0 4px 14px -4px rgba(99,102,241,0.5)',
            },
            footerActionLink: { color: '#6366f1' },
            identityPreviewText: { color: '#f8fafc' },
            identityPreviewEditButton: { color: '#6366f1' },
            alternativeMethodsBlockButton: {
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
            },
          },
        }}
        forceRedirectUrl="/dashboard"
      />
    </div>
  )
}
