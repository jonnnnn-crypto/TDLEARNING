import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default async function CreateCommunityPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  async function createCommunityAction(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('communities')
      .insert({
        name,
        description,
        category,
        owner_id: user.id
      })
      .select()
      .single()

    if (!error && data) {
      // automatically join the user who created it
      await supabase.from('community_members').insert({
        community_id: data.id,
        user_id: user.id,
        role: 'admin'
      })
      
      // automatically create a #general text channel
       await supabase.from('channels').insert({
        community_id: data.id,
        name: 'general',
        type: 'text'
      })

      redirect(`/community/${data.id}`)
    }
  }

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a New Community</CardTitle>
          <CardDescription>
            Start a new learning group. Once created, you'll be the Community Admin and it will be sent for Verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCommunityAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name</Label>
              <Input id="name" name="name" placeholder="e.g., Web Developer Lambar" required />
            </div>
            <p className="text-muted-foreground">You&apos;re about to build a new space for learning and collaboration.</p>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="e.g., Web Development, Security, AI..." required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="What will your community learn?" 
                rows={4} 
              />
            </div>

            <div className="flex justify-end pt-4">
               <Button type="button" variant="outline" className="mr-2" onClick={() => window.history.back()}>
                 Cancel
               </Button>
               <Button type="submit">
                 Create Community
               </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
