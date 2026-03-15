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
            <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-500 bg-background/40 backdrop-blur-xl border-white/5 shadow-2xl">
              <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 blur-2xl rounded-full bg-gradient-to-br", card.color)} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                  {card.title}
                </CardTitle>
                <div className={cn("p-2 rounded-xl bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-all", card.color)}>
                   <card.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent mt-2">
                  {loading ? "..." : card.value}
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="grid gap-8 lg:grid-cols-7">
        <motion.div variants={cardVariants} className="lg:col-span-4">
          <Card className="h-full border-white/5 bg-background/20 backdrop-blur-lg shadow-xl group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
            <CardHeader className="pb-0 px-8 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
                  <CardDescription className="text-base mt-1">Jejak interaksi terakhir Anda di komunitas.</CardDescription>
                </div>
                <Activity className="w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="h-[350px] flex flex-col items-center justify-center text-muted-foreground/60 p-8">
              <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                 <Activity className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-medium text-lg">Belum ada aktivitas terbaru.</p>
              <p className="text-sm text-center max-w-xs mt-2">Mulai bergabung ke diskusi atau buka materi untuk melihat progres Anda di sini.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-3">
          <Card className="h-full border-white/5 bg-background/20 backdrop-blur-lg shadow-xl group overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-accent/40 group-hover:bg-accent transition-colors" />
            <CardHeader className="pb-0 px-8 pt-8">
               <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Upcoming Events</CardTitle>
                  <CardDescription className="text-base mt-1">Webinar dan Voice Rooms terjadwal.</CardDescription>
                </div>
                <Calendar className="w-8 h-8 text-accent/20 group-hover:text-accent/40 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="h-[350px] flex flex-col items-center justify-center text-muted-foreground/60 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                 <Calendar className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-medium text-lg">Tidak ada jadwal terdekat.</p>
              <p className="text-sm mt-2">Cek kembali nanti untuk mengikuti sesi live bersama mentor.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

