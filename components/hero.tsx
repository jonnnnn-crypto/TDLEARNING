"use client"

import { ArrowRight, Zap, GraduationCap, Users as UsersIcon, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] as any 
      },
    } as const,
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-40 bg-background">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-32" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 opacity-40 blur-[120px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-primary mb-8 shadow-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Now Live: WebRTC Voice Learning Rooms
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-8xl max-w-5xl leading-[1.1]"
          >
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-accent animate-gradient-x">
              Tech Expertise
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
          >
            Platform pembelajaran teknologi digital berbasis komunitas untuk pelajar Indonesia. Belajar, diskusi, dan kembangkan skill dalam ekosistem premium yang terintegrasi.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mt-12 flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-300 group" asChild>
              <Link href="/register">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 hover:bg-white/5 backdrop-blur-sm transition-all duration-300" asChild>
              <Link href="/community">
                Explore Communities
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-24 grid grid-cols-2 gap-12 md:grid-cols-4 max-w-5xl w-full"
          >
            {[
              { label: "Community Driven", icon: UsersIcon },
              { label: "Expert Mentors", icon: Award },
              { label: "Interactive Labs", icon: Zap },
              { label: "Career Path", icon: GraduationCap }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group px-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors duration-500">
                  <stat.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

