'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BarChart2, Mail, Target, Settings, Menu, X, MessageSquare } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'

const navItems = [
  { href: '/', label: 'Dashboard', icon: BarChart2 },
  { href: '/outreach', label: 'Outreach Log', icon: Mail },
  { href: '/prospects', label: 'Prospectos', icon: Target },
  { href: '/messages', label: 'Mensajes', icon: MessageSquare },
  { href: '/settings', label: 'Configuración', icon: Settings },
]

function MMLogo() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/favicon.ico" alt="Mario Moreno" width={36} height={36} style={{ objectFit: 'cover', display: 'block' }} />
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex flex-col h-full">
      {/* Brand */}
      <div style={{
        padding: '18px 18px',
        borderBottom: '1px solid #1e293b',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <MMLogo />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>MarioOS</span>
          <span style={{ color: '#64748b', fontWeight: 500, fontSize: 10 }}>Outreach Dashboard</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 12px 6px' }}>
          Workspace
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 9,
                cursor: 'pointer', position: 'relative',
                background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: active ? '#a5b4fc' : '#94a3b8',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
              className={!active ? 'hover:bg-slate-700/50 hover:text-slate-50' : ''}
            >
              {active && (
                <span style={{
                  position: 'absolute', left: 0, top: 8, bottom: 8, width: 2,
                  background: '#6366f1', borderRadius: 2,
                  boxShadow: '0 0 6px #6366f1',
                }} />
              )}
              <Icon size={18} />
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{label}</span>
            </Link>
          )
        })}
      </div>

      {/* User footer */}
      <div style={{
        padding: '14px', borderTop: '1px solid #1e293b',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 16,
          background: 'linear-gradient(135deg, hsl(220 55% 35%), hsl(260 55% 50%))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>MM</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#f8fafc' }}>Mario Moreno</div>
          <div style={{ fontSize: 10, color: '#64748b' }}>Admin</div>
        </div>
        <LogoutButton />
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden rounded-md p-2"
        style={{ color: '#94a3b8', background: 'rgba(15,23,42,0.8)' }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 transition-transform md:hidden`}
        style={{
          background: '#0a0f1f',
          borderRight: '1px solid #1e293b',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {nav}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-60 md:flex-col"
        style={{ background: '#0a0f1f', borderRight: '1px solid #1e293b' }}
      >
        {nav}
      </aside>
    </>
  )
}
