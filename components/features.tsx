import { BookOpen, MessageSquare, Mic, ShieldCheck } from "lucide-react"

const features = [
  {
    name: "Community Learning",
    description: "Bergabung dengan komunitas lokal dan global untuk belajar bersama mentor dan teman sebaya.",
    icon: ShieldCheck,
  },
  {
    name: "Real-time Chat",
    description: "Diskusi tanpa hambatan dengan fitur chat real-time ala Discord, lengkap dengan thread dan emoji.",
    icon: MessageSquare,
  },
  {
    name: "Voice Learning Room",
    description: "Ruang belajar interaktif menggunakan Voice Channel WebRTC untuk diskusi langsung dan screen sharing.",
    icon: Mic,
  },
  {
    name: "Course System",
    description: "Sistem materi terstruktur dari level Beginner hingga Advanced yang dibuat oleh Community Admin.",
    icon: BookOpen,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/50 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center shrink-0">
          <h2 className="text-base font-semibold leading-7 text-primary">Accelerated Growth</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to master tech
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Fitur unggulan TD LEARNING dirancang khusus untuk memastikan pelajar di daerah seperti Lampung Barat memiliki akses ke lingkungan belajar standard industri.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
