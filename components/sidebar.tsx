"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, MessageSquare, Calendar, User, LogOut, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar({ user }: { user: any }) {
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
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">TD LEARNING</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 flex flex-col gap-4 border-t">
         <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user?.avatar || ""} alt="User Avatar" />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate min-w-0">
            <span className="text-sm font-medium truncate" title={user?.name || user?.email}>{user?.name || user?.email?.split('@')[0]}</span>
            <span className="text-xs text-muted-foreground capitalize truncate">{user?.role || 'Member'}</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4 shrink-0" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
