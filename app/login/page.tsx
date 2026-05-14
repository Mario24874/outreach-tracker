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
            colorTextSecondary: '#64748b',
            colorInputBackground: '#0f172a',
            colorInputText: '#f8fafc',
            colorPrimary: '#6366f1',
            borderRadius: '8px',
          },
          elements: {
            card: { boxShadow: 'none', border: '1px solid #1e293b' },
            headerTitle: { color: '#f8fafc' },
            headerSubtitle: { color: '#64748b' },
            socialButtonsBlockButton: { border: '1px solid #1e293b' },
            dividerLine: { background: '#1e293b' },
            dividerText: { color: '#475569' },
            formFieldInput: { border: '1px solid #1e293b' },
            footerActionLink: { color: '#6366f1' },
          },
        }}
        forceRedirectUrl="/"
      />
    </div>
  )
}
