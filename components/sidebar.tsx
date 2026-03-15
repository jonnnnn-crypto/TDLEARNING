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
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community", href: "/community", icon: Users },
    { name: "Learning", href: "/learning", icon: BookOpen },
    { name: "Discussion", href: "/chat", icon: MessageSquare },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Profile", href: "/profile", icon: User },
  ]

  // Add Admin tab if user is super_admin
  if (user?.role === 'super_admin') {
      navItems.push({ name: "Admin", href: "/admin", icon: ShieldAlert })
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/5 bg-background/60 backdrop-blur-xl md:flex shadow-2xl">
      <div className="flex h-20 items-center px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
             <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            TD LEARNING
          </span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-primary/15 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 flex flex-col gap-4 bg-white/5 border-t border-white/5">
         <div className="flex items-center gap-3 p-2 rounded-xl bg-background/40 border border-white/5 shadow-inner">
          <Avatar className="h-10 w-10 shrink-0 border border-primary/20 shadow-lg">
            <AvatarImage src={user?.avatar || ""} alt="User Avatar" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase() || "U"}
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

