import { Users, GraduationCap, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const communities = [
  {
    name: "Cyber Security Lambar",
    memberCount: 156,
    verified: true,
    activity: "High",
  },
  {
    name: "Web Developer Lambar",
    memberCount: 320,
    verified: true,
    activity: "Very High",
  },
  {
    name: "AI Enthusiast ID",
    memberCount: 89,
    verified: false,
    activity: "Medium",
  },
]

export function CommunityHighlight() {
  return (
    <section id="community" className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Verified Communities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Bergabung dengan komunitas belajar yang telah diverifikasi untuk menjamin kualitas materi dan mentorship.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communities.map((community) => (
            <Card key={community.name} className="dark:bg-muted/10">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  {community.verified && (
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{community.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> {community.memberCount} members</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  Activity: <span className="ml-2 font-medium text-foreground">{community.activity}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
