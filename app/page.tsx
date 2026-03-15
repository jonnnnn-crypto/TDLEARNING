import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero"
import { FeaturesSection } from "@/components/features"
import { CommunityHighlight } from "@/components/community-highlight"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CommunityHighlight />
      </main>
      <Footer />
    </div>
  )
}
