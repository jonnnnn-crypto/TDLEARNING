'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, PlusCircle, Smile } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RoomChat({ 
  initialMessages, 
  channelId, 
  currentUser 
}: { 
  initialMessages: any[], 
  channelId: string, 
  currentUser: any 
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Subscribe to realtime inserts
    const channel = supabase
      .channel(`room:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        async (payload) => {
          // Fetch the user data for this new message
          const { data: userData } = await supabase
            .from('users')
            .select('id, name, avatar')
            .eq('id', payload.new.user_id)
            .single()

          const newMsg = {
            ...payload.new,
            user: userData
          }
          setMessages(prev => [...prev, newMsg])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelId, supabase])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const { error } = await supabase
      .from('messages')
      .insert({
        channel_id: channelId,
        user_id: currentUser.id,
        content: newMessage.trim(),
      })

    if (!error) {
      setNewMessage('')
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Welcome graphic at top of chat history */}
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                 <Hash className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-xl font-bold mb-2">Welcome to the beginning of this channel</h3>
             <p className="text-muted-foreground text-sm">Be the first to say hello!</p>
           </div>
        )}

        {messages.map((msg, idx) => {
          // Check if previous message is from same user within a short timeframe to group them
          const prevMsg = idx > 0 ? messages[idx - 1] : null
          const isSameUser = prevMsg && prevMsg.user_id === msg.user_id
          // Simple time grouping logic (within 5 minutes)
          const isSameTimeGroup = isSameUser && (new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() < 300000)

          if (isSameTimeGroup) {
             return (
                 <div key={msg.id} className="pl-[3.5rem] pr-4 group relative flex items-start -mt-5 hover:bg-muted/30 p-1">
                     <span className="absolute left-4 top-2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 select-none">
                         {formatTime(msg.created_at)}
                     </span>
                     <p className="text-foreground text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                 </div>
             )
          }

          return (
            <div key={msg.id} className="group relative flex items-start space-x-3 hover:bg-muted/30 p-1 rounded-md mt-4">
              <Avatar className="h-10 w-10 shrink-0 mt-0.5 cursor-pointer">
                <AvatarImage src={msg.user?.avatar || ''} />
                <AvatarFallback className="bg-primary/20 text-primary">
                    {msg.user?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium text-sm text-foreground hover:underline cursor-pointer">{msg.user?.name}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(msg.created_at)}</span>
                </div>
                <p className="text-foreground text-sm mt-0.5 whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background shrink-0 sticky bottom-0 z-10 w-full mb-2">
        <form 
            onSubmit={handleSendMessage} 
            className="relative flex items-center w-full bg-muted/50 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:bg-background transition-all"
        >
          <button type="button" className="absolute left-3 p-1 text-muted-foreground hover:text-foreground">
              <PlusCircle className="w-5 h-5" />
          </button>
          <Input 
            autoComplete="off"
            name="message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-12 py-6 text-base" 
            placeholder="Message #general" 
          />
          <div className="absolute right-3 flex items-center space-x-1">
              <button type="button" className="p-1.5 text-muted-foreground hover:text-foreground">
                  <Smile className="w-5 h-5" />
              </button>
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="p-1.5 text-muted-foreground hover:text-primary disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
                >
                  <Send className="w-5 h-5" />
              </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Hash({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
}
