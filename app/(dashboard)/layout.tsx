import { Sidebar } from '@/components/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-60 min-h-screen">
        {children}
      </main>
    </>
  )
}
