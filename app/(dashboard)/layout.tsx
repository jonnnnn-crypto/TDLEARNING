import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { RealtimeRoleListener } from '@/components/realtime-role-listener'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Guard: Redirect to login if unauthenticated
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Pre-fetch user role/profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <RealtimeRoleListener userId={user.id}>
      <div className="flex min-h-screen bg-transparent text-foreground">
        {/* Sidebar Component */}
        <Sidebar user={profile || { name: user.email, email: user.email, avatar: null }} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/5 bg-background/20 backdrop-blur-md px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
            <div className="md:hidden">
               {/* Mobile Sheet Trigger Placeholder */}
            </div>
            <div className="w-full flex-1">
              {/* Global Search / Command Palette Placeholder */}
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </RealtimeRoleListener>
  )
}
