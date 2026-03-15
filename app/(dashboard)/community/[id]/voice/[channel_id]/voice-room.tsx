'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, PhoneOff, Users } from 'lucide-react'

export function VoiceRoom({ channelId, currentUser }: { channelId: string, currentUser: any }) {
  const [isJoined, setIsJoined] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])

  useEffect(() => {
     // Here we would initialize WebRTC and Supabase Broadcast
     // For this mockup, we'll simulate it.
     if (isJoined) {
         setParticipants([{ id: currentUser.id, isMuted }])
     } else {
         setParticipants([])
     }
  }, [isJoined, currentUser.id, isMuted])

  if (!isJoined) {
      return (
          <div className="flex flex-col items-center max-w-sm text-center">
             <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                 <Mic className="w-10 h-10 text-primary" />
             </div>
             <h2 className="text-2xl font-bold mb-2">Voice Lounge</h2>
             <p className="text-muted-foreground mb-8">
                 Bergabung ke ruang diskusi suara ini untuk mengobrol langsung dengan member dan mentor.
             </p>
             <Button size="lg" onClick={() => setIsJoined(true)} className="w-full">
                 Simulate Join Voice Action
             </Button>
          </div>
      )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex items-center space-x-2 text-muted-foreground mb-8">
            <Users className="w-5 h-5" />
            <span>{participants.length} Participant(s)</span>
        </div>
        
        <div className="flex flex-wrap gap-6 justify-center max-w-3xl mb-12">
            {participants.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                    <div className="relative">
                        <div className={`w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center border-4 ${isMuted ? 'border-transparent' : 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'}`}>
                             <Users className="w-12 h-12 text-primary" />
                        </div>
                        {p.isMuted && (
                            <div className="absolute -bottom-2 -right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full border-[3px] border-background">
                                <MicOff className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                    <span className="mt-4 font-medium text-sm">You</span>
                </div>
            ))}
        </div>

        <div className="flex items-center space-x-4">
            <Button 
                variant={isMuted ? "destructive" : "secondary"} 
                size="icon" 
                className="w-14 h-14 rounded-full"
                onClick={() => setIsMuted(!isMuted)}
             >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            <Button 
                variant="destructive" 
                size="icon" 
                className="w-14 h-14 rounded-full"
                onClick={() => setIsJoined(false)}
             >
                 <PhoneOff className="w-6 h-6" />
            </Button>
        </div>
    </div>
  )
}
