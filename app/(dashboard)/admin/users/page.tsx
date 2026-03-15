"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, User, Loader2, Search, MoreVertical, Trash2, CheckCircle, XCircle } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

interface UserProfile {
  id: string
  email: string
  name: string | null
  role: string
  avatar: string | null
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error("Failed to fetch users")
      } else {
        setUsers(data || [])
      }
      setLoading(false)
    }

    fetchUsers()

    // Realtime subscription for all user changes
    const channel = supabase
      .channel('admin-users-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUsers(prev => [payload.new as UserProfile, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setUsers(prev => prev.map(u => u.id === payload.new.id ? payload.new as UserProfile : u))
          } else if (payload.eventType === 'DELETE') {
            setUsers(prev => prev.filter(u => u.id === payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      toast.error("Failed to update role")
    } else {
      toast.success(`Role updated to ${newRole}`)
    }
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    (u.name?.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage roles and permissions in real-time.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 bg-white/5 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white/10 group-hover:border-primary/50 transition-colors">
                          <AvatarImage src={user.avatar || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary uppercase">
                            {user.name?.[0] || user.email[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{user.name || "Anonymous User"}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                        user.role === 'super_admin' 
                          ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]' 
                          : user.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-white/5 text-muted-foreground'
                      }`}>
                        {user.role === 'super_admin' && <Shield className="h-3 w-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 min-w-[160px]">
                          <DropdownMenuItem onClick={() => updateUserRole(user.id, 'super_admin')} className="gap-2 cursor-pointer">
                            <Shield className="h-4 w-4 text-primary" /> Make Super Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(user.id, 'admin')} className="gap-2 cursor-pointer">
                            <CheckCircle className="h-4 w-4 text-amber-500" /> Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateUserRole(user.id, 'member')} className="gap-2 cursor-pointer">
                            <User className="h-4 w-4 text-muted-foreground" /> Make Member
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                            <XCircle className="h-4 w-4" /> Suspended Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
