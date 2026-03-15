import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
          Now Live: WebRTC Voice Learning Rooms
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl max-w-4xl text-foreground">
          Technology Digital <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
            Learning Platform
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Platform pembelajaran teknologi digital berbasis komunitas untuk pelajar Indonesia. Belajar, diskusi, dan kembangkan skill dalam satu ekosistem terpadu.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto group" asChild>
            <Link href="/register">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/community">
              Join Community
            </Link>
          </Button>
        </div>
        
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 max-w-4xl opacity-50">
           {/* Decorative elements representing technologies */}
           <div className="flex justify-center items-center"><span className="text-xl font-bold">React</span></div>
           <div className="flex justify-center items-center"><span className="text-xl font-bold">Next.js</span></div>
           <div className="flex justify-center items-center"><span className="text-xl font-bold">Supabase</span></div>
           <div className="flex justify-center items-center"><span className="text-xl font-bold">WebRTC</span></div>
        </div>
      </div>
      
      {/* Background gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
      </div>
    </section>
  )
}
