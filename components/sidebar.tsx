"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, MessageSquare, Calendar, User, LogOut, ShieldAlert, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

interface SidebarProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
    avatar?: string; // Standardized custom property
    role?: string;
    name?: string;
  } | null;
  className?: string;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community", href: "/community", icon: Users },
    { name: "Learning", href: "/learning", icon: BookOpen },
    { name: "Discussion", href: "/chat", icon: MessageSquare },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Profile", href: "/profile", icon: User },
  ]

  // Add Admin tab if user is super_admin
  const isAdmin = user?.role === 'super_admin'
  const adminItems = isAdmin ? [
    { name: "User Management", href: "/admin/users", icon: ShieldAlert },
  ] : []

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/5 bg-background/40 backdrop-blur-2xl md:flex shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)]">
      <div className="flex h-20 items-center px-8 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(var(--primary),0.4)] group-hover:scale-110 transition-transform duration-500">
             <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent group-hover:to-foreground transition-all duration-500">
            TD LRN
          </span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 px-4 mb-4">Platform</p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-500 magnetic-button",
                    isActive 
                      ? "bg-white/5 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                      : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn("h-5 w-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {isAdmin && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 px-4 mb-4">Admin Console</p>
            <nav className="flex flex-col gap-1">
              {adminItems.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-500 magnetic-button",
                      isActive 
                        ? "bg-primary/20 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                        : "text-primary/60 hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-admin"
                        className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn("h-5 w-5 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3", isActive ? "text-primary" : "text-primary/60")} />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      <div className="mt-auto p-4 flex flex-col gap-4 bg-white/5 border-t border-white/5">
         <div className="flex items-center gap-3 p-2 rounded-xl bg-background/40 border border-white/5 shadow-inner">
          <Avatar className="h-10 w-10 shrink-0 border border-primary/20 shadow-lg">
            <AvatarImage src={user?.avatar || ""} alt="User Avatar" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate min-w-0">
            <span className="text-sm font-semibold truncate text-foreground/90">{user?.name || user?.email?.split('@')[0]}</span>
            <div className="flex items-center gap-1.5">
               <span className={cn("text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full", user?.role === 'super_admin' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                 {user?.role || 'Member'}
               </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5 shrink-0" />
          <span className="font-medium">Logout Session</span>
        </Button>
      </div>
    </aside>
  )
}

