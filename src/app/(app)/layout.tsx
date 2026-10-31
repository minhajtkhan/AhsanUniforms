import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/sidebar'

export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect('/auth/login')
  if (!user.is_active) redirect('/auth/login?error=account_disabled')

  const isOwner = user.role === 'owner'

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar isOwner={isOwner} />
      <main
        className="flex-1 min-h-screen overflow-x-hidden"
        style={{ marginLeft: 'var(--sidebar-width)' }}
      >
        <div className="w-full h-full p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
