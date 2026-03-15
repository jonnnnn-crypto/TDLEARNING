import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar || ''} />
              <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                {profile?.name?.[0]?.toUpperCase() || user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold">{profile?.name || 'TD Learner'}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 mt-2 text-xs font-semibold bg-secondary text-secondary-foreground">
                 {profile?.role || 'Member'}
              </div>
            </div>
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="communities" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm mb-6">
          <TabsTrigger value="communities">My Communities</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        <TabsContent value="communities" className="bg-background border rounded-lg p-8 text-center text-muted-foreground">
           Daftar komunitas yang diikuti akan muncul di sini.
        </TabsContent>
        <TabsContent value="certificates" className="bg-background border rounded-lg p-8 text-center text-muted-foreground">
           Sertifikat kelulusan Course akan muncul di sini.
        </TabsContent>
      </Tabs>
    </div>
  )
}
