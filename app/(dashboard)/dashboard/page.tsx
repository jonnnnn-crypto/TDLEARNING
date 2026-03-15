"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, MessageSquare, Activity, Sparkles, TrendingUp, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function DashboardHomePage() {
  const [stats, setStats] = useState({
    communityCount: 0,
    joinedCount: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const { count: cCount } = await supabase
        .from('communities')
        .select('*', { count: 'exact', head: true })
      
      const { count: jCount } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
      
      setStats({
        communityCount: cCount || 0,
        joinedCount: jCount || 0
      })
      setLoading(false)
    }
    fetchStats()
  }, [supabase])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 260, 
        damping: 20 
      }
    }
  }

  const statCards = [
    { 
      title: "Joined Communities", 
      value: stats.joinedCount, 
      description: "Active learning groups", 
      icon: Users,
      color: "from-blue-500 to-indigo-500"
    },
    { 
      title: "Available Communities", 
      value: stats.communityCount, 
      description: "Total platform communities", 
      icon: Activity,
      color: "from-purple-500 to-pink-500"
    },
    { 
      title: "Active Courses", 
      value: 0, 
      description: "In progress courses", 
      icon: BookOpen,
      color: "from-orange-500 to-red-500"
    },
    { 
      title: "Unread Discussions", 
      value: 0, 
      description: "New messages awaiting", 
      icon: MessageSquare,
      color: "from-emerald-500 to-teal-500"
    }
  ]

  return (
    <motion.div 
      className="flex flex-col gap-10 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={cardVariants} className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
           <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5 animate-pulse" />
           </div>
           <span className="text-sm font-bold uppercase tracking-widest text-primary/80">Overview</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg italic">
          Selamat datang kembali! Mari lanjutkan perjalanan belajar Anda hari ini.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <motion.div key={i} variants={cardVariants}>
            <div className="premium-card p-6 group cursor-default h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-2xl bg-gradient-to-br opacity-90 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg", card.color)}>
                   <card.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Metric</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-500">
                  {card.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/40 bg-clip-text text-transparent mt-2">
                    {loading ? "..." : card.value}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-[10px] font-bold">100%</span>
                  </div>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-tight mt-2">{card.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid gap-8 lg:grid-cols-7">
        <motion.div variants={cardVariants} className="lg:col-span-4">
          <div className="premium-card p-8 group relative overflow-hidden h-[450px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
                  <p className="text-muted-foreground text-sm mt-1">Real-time update of your learning journey.</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors duration-500">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                   <Activity className="w-10 h-10 text-primary/30" />
                </div>
                <p className="font-bold text-xl tracking-tight">Syncing Activity...</p>
                <p className="text-sm text-muted-foreground max-w-xs mt-3 leading-relaxed">
                  Kami sedang menyinkronkan data terbaru Anda. Aktivitas akan muncul di sini secara otomatis.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-3">
          <div className="premium-card p-8 group relative overflow-hidden h-[450px]">
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] -ml-32 -mb-32 rounded-full" />
             <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Events</h2>
                  <p className="text-muted-foreground text-sm mt-1">Upcoming live sessions.</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent/40 group-hover:text-accent transition-colors duration-500">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center mb-8">
                   <Calendar className="w-10 h-10 text-accent/30" />
                </div>
                <p className="font-bold text-xl tracking-tight">No Events Scheduled</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Belum ada sesi live yang terjadwal. Ikuti channel komunitas untuk mendapatkan update terbaru.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

