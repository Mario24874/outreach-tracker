'use client'

export const dynamic = 'force-dynamic'

import { SignOutButton } from '@clerk/nextjs'

export default function UnauthorizedPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020617',
        color: '#f8fafc',
        gap: 24,
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f87171' }}>Acceso denegado</h1>
      <p style={{ color: '#64748b', textAlign: 'center', maxWidth: 360 }}>
        Tu cuenta no tiene permisos para acceder a este panel.
        Cierra sesión e inicia con la cuenta correcta.
      </p>
      <SignOutButton redirectUrl="/login">
        <button
          style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Cerrar sesión
        </button>
      </SignOutButton>
    </div>
  )
}
