"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function RealtimeRoleListener({ children, userId }: { children: React.ReactNode, userId: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    // Get initial role
    const fetchRole = async () => {
      const { data } = await supabase.from('users').select('role').eq('id', userId).maybeSingle()
      if (data) setCurrentRole(data.role)
    }
    fetchRole()

    // Subscribe to realtime changes for the SPECIFIC user
    const channel = supabase
      .channel(`user-role-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          const newRole = payload.new.role
          if (newRole !== currentRole) {
            console.log('Realtime Role Update Detected:', newRole)
            router.refresh() // Refresh layout/components to reflect role change
            setCurrentRole(newRole)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, currentRole, router, supabase])

  return <>{children}</>
}
