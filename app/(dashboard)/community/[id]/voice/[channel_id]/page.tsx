import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Mic } from 'lucide-react'

// Placeholder for the actual WebRTC Voice Component
import { VoiceRoom } from '@/app/(dashboard)/community/[id]/voice/[channel_id]/voice-room'

export default async function VoiceChannelPage({
  params
}: {
  params: Promise<{ id: string, channel_id: string }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id, channel_id } = await params;

  // Verify channel exists
  const { data: channel } = await supabase
    .from('channels')
    .select('*')
    .eq('id', channel_id)
    .eq('community_id', id)
    .single()

  if (!channel || channel.type !== 'voice') notFound()

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Top Header */}
      <div className="h-14 border-b flex items-center px-4 shrink-0 shadow-sm z-10 sticky top-0 bg-background/95 backdrop-blur">
        <Mic className="w-5 h-5 text-muted-foreground mr-2" />
        <h3 className="font-semibold">{channel.name}</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-muted/10 p-4">
          <VoiceRoom currentUser={{ id: user.id }} />
      </div>
    </div>
  )
}
