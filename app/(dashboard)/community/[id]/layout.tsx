import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Hash, Mic, Settings } from 'lucide-react'

export default async function CommunityLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params;

  const { data: community } = await supabase
    .from('communities')
    .select('*')
    .eq('id', id)
    .single()

  if (!community) notFound()

  // Verify membership
  const { data: membership } = await supabase
    .from('community_members')
    .select('role')
    .eq('community_id', id)
    .eq('user_id', user.id)
    .single()

  // Fetch channels
  const { data: channels } = await supabase
    .from('channels')
    .select('*')
    .eq('community_id', id)
    .order('created_at', { ascending: true })

  const textChannels = channels?.filter(c => c.type === 'text') || []
  const voiceChannels = channels?.filter(c => c.type === 'voice') || []

  return (
    <div className="flex h-[calc(100vh-4rem)] border rounded-xl overflow-hidden bg-background">
      {/* Community Sidebar (Discord Style) */}
      <div className="w-64 bg-muted/30 border-r flex flex-col">
        {/* Header */}
        <div className="h-14 border-b flex items-center px-4 justify-between hover:bg-muted/50 transition-colors cursor-pointer">
          <h2 className="font-bold truncate">{community.name}</h2>
          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto py-4 px-2 select-none">
          {membership ? (
            <>
              {/* Text Channels Category */}
              <div className="mb-6">
                <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 hover:text-foreground cursor-pointer">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Text Channels
                </div>
                <div className="space-y-0.5">
                  {textChannels.map(channel => (
                    <Link 
                      key={channel.id} 
                      href={`/community/${community.id}/chat/${channel.id}`}
                      className="flex items-center px-2 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground group transition-colors"
                    >
                      <Hash className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" />
                      <span className="truncate">{channel.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Voice Channels Category */}
              <div>
                <div className="flex items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 hover:text-foreground cursor-pointer">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Voice Channels
                </div>
                <div className="space-y-0.5">
                  {voiceChannels.map(channel => (
                     <Link 
                     key={channel.id} 
                     href={`/community/${community.id}/voice/${channel.id}`}
                     className="flex items-center px-2 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground group transition-colors"
                   >
                     <Mic className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" />
                     <span className="truncate">{channel.name}</span>
                   </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <h3 className="text-sm font-medium mb-2">Not a member?</h3>
              <p className="text-xs text-muted-foreground mb-4">Join this community to access text and voice channels.</p>
              {/* Note: In a real app, wrap in a Client Component to handle the join action securely */}
              <form action="/api/community/join" method="POST">
                <input type="hidden" name="community_id" value={community.id} />
                <button type="submit" className="w-full bg-primary text-primary-foreground rounded-md py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors">
                  Join Community
                </button>
              </form>
            </div>
          )}
        </div>

        {/* User Control Panel */}
        <div className="h-14 bg-muted/50 border-t flex items-center px-3 justify-between">
            <div className="flex items-center space-x-2 overflow-hidden mr-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="truncate text-sm">
                    <div className="font-semibold truncate">{user.email?.split('@')[0]}</div>
                    <div className="text-xs text-muted-foreground truncate">{membership?.role || 'Guest'}</div>
                </div>
            </div>
            <div className="flex items-center space-x-1 shrink-0 text-muted-foreground">
                <button className="p-1.5 rounded-md hover:bg-muted hover:text-foreground"><Mic className="w-4 h-4"/></button>
                <button className="p-1.5 rounded-md hover:bg-muted hover:text-foreground"><Settings className="w-4 h-4"/></button>
            </div>
        </div>
      </div>

      {/* Main Content Area (Chat/Voice/Settings) */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {children}
      </div>

      {/* Optional: Right Members Sidebar (hidden on small screens) */}
      <div className="w-60 bg-muted/10 border-l hidden lg:flex flex-col">
          <div className="h-14 border-b flex items-center px-4 font-semibold shadow-sm z-10">
             Members
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              {/* Admins Placeholder */}
              <div>
                 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Admins — 1</div>
                 {membership?.role === 'admin' ? (
                     <div className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1.5 -mx-1.5 rounded-md">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">{user.email?.[0].toUpperCase()}</div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        </div>
                        <div className="font-medium text-sm text-blue-500 dark:text-blue-400">{user.email?.split('@')[0]}</div>
                     </div>
                 ) : null}
              </div>
          </div>
      </div>
    </div>
  )
}
