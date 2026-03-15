import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Hash, MessageSquarePlus } from 'lucide-react'

export default async function CommunityWelcomePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params;

  // Find the 'general' text channel or the first available one to redirect
  const { data: channels } = await supabase
    .from('channels')
    .select('id, name')
    .eq('community_id', id)
    .eq('type', 'text')
    .order('created_at', { ascending: true })

  if (channels && channels.length > 0) {
    // Attempt to prefer 'general', else pick first
    const general = channels.find(c => c.name.toLowerCase() === 'general')
    const targetId = general ? general.id : channels[0].id
    redirect(`/community/${id}/chat/${targetId}`)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
        <MessageSquarePlus className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to the Community</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        There are no text channels here yet. If you are the admin, you can create one to start the conversation!
      </p>
    </div>
  )
}
