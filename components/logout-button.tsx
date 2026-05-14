'use client'

import { SignOutButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <SignOutButton redirectUrl="/login">
      <button
        title="Cerrar sesión"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 6,
          borderRadius: 6,
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        className="hover:text-red-400"
      >
        <LogOut size={15} />
      </button>
    </SignOutButton>
  )
}
