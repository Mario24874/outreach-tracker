import { redirect } from 'next/navigation'
import { getPortalUser } from '@/lib/portal-user'
import { PortalSidebar } from '@/components/portal-sidebar'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getPortalUser()
  if (!user) redirect('/login')

  return (
    <>
      <PortalSidebar userName={user.full_name} userEmail={user.email} />
      <main className="flex-1 ml-0 md:ml-60 min-h-screen">
        {children}
      </main>
    </>
  )
}
