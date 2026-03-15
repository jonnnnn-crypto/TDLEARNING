import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default async function CommunityDiscoveryPage() {
  const supabase = await createClient()

  // Fetch all communities
  const { data: communities } = await supabase
    .from('communities')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground">Discover and join technology learning groups.</p>
        </div>
        <Button asChild>
          <Link href="/community/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Community
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search communities..." className="pl-10 max-w-md" />
      </div>

      {communities && communities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Card key={community.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{community.name}</span>
                  {community.is_verified && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                      V
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {community.description || 'No description provided.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                   <Users className="w-4 h-4 mr-2"/> members
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full">Join Community</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed">
          <h3 className="text-lg font-semibold">No Communities Found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">There are currently no active communities on the platform. Be the first to start one!</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/community/create">Build a Community</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
