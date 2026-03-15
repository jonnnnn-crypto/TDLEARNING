import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Hash } from 'lucide-react'

// Note: For real-time capability, we need a Client Component for the inner chat mechanics.
// This is the outer Server Component shell.
import { RoomChat } from '@/app/(dashboard)/community/[id]/chat/[channel_id]/room-chat'

export default async function TextChannelPage({
  params
}: {
  params: Promise<{ id: string, channel_id: string }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id, channel_id } = await params;

  // Verify channel exists and belongs to community
  const { data: channel } = await supabase
    .from('channels')
    .select('*')
    .eq('id', channel_id)
    .eq('community_id', id)
    .single()

  if (!channel) notFound()

  // Fetch initial messages (last 50)
  const { data: messages } = await supabase
    .from('messages')
    .select('*, user:users(id, name, avatar)')
    .eq('channel_id', channel_id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Re-order to chronological
  const formattedMessages = (messages || []).reverse()

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Top Header */}
      <div className="h-14 border-b flex items-center px-4 shrink-0 shadow-sm z-10 sticky top-0 bg-background/95 backdrop-blur">
        <Hash className="w-5 h-5 text-muted-foreground mr-2" />
        <h3 className="font-semibold">{channel.name}</h3>
      </div>

      {/* Main Chat Area (Client Component) */}
      <RoomChat 
        initialMessages={formattedMessages} 
        channelId={channel.id} 
        currentUser={{ id: user.id }} 
      />
    </div>
  )
}
