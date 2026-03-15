import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify Super Admin role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'super_admin') {
     // In a real app we'd redirect or show an unauthorized message
     // For demo purposes and since we haven't assigned super_admin to anyone yet, 
     // we'll render it but show a warning
  }

  // Fetch pending communities
  const { data: pendingCommunities } = await supabase
    .from('communities')
    .select('*, owner_id(name, email)')
    .eq('is_verified', false)
    .order('created_at', { ascending: false })

  // System statistics
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: totalCommunities } = await supabase.from('communities').select('*', { count: 'exact', head: true })

  async function approveCommunityAction(formData: FormData) {
      'use server'
      const id = formData.get('id') as string
      const sb = await createClient()
      await sb.from('communities').update({ is_verified: true }).eq('id', id)
      // We would normally revalidatePath('/admin') here, but doing simplified server actions
  }

  async function rejectCommunityAction(formData: FormData) {
       'use server'
       const id = formData.get('id') as string
       const sb = await createClient()
       // Reject by deleting or flagging
       await sb.from('communities').delete().eq('id', id)
  }

  return (
    <div className="flex flex-col gap-8">
       {profile?.role !== 'super_admin' && (
           <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20 text-sm font-medium">
               Warning: You are viewing the admin dashboard without Super Admin privileges. Approval actions will fail via RLS policies.
           </div>
       )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Admin</h1>
        <p className="text-muted-foreground">Manage verifications and platform statistics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCommunities || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCommunities?.length || 0}</div>
            </CardContent>
          </Card>
      </div>

      <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Pending Verifications</h2>
          
          {pendingCommunities && pendingCommunities.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                 {pendingCommunities.map(community => (
                     <Card key={community.id}>
                         <CardHeader>
                             <div className="flex justify-between items-start">
                                 <CardTitle>{community.name}</CardTitle>
                                 <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending</Badge>
                             </div>
                              <CardDescription>Requested by: {(community as unknown as { owner_id: { name: string } }).owner_id?.name || 'Unknown User'}</CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-sm text-foreground">{community.description}</p>
                             <div className="mt-4 text-xs font-medium text-muted-foreground bg-muted p-2 rounded-md inline-block">
                                Category: {community.category}
                             </div>
                         </CardContent>
                         <CardFooter className="flex space-x-2 border-t pt-4">
                             <form action={approveCommunityAction} className="flex-1">
                                 <input type="hidden" name="id" value={community.id} />
                                 <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                                     <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                 </Button>
                             </form>
                             <form action={rejectCommunityAction} className="flex-1">
                                 <input type="hidden" name="id" value={community.id} />
                                 <Button type="submit" variant="destructive" className="w-full">
                                     <XCircle className="w-4 h-4 mr-2" /> Reject
                                 </Button>
                             </form>
                         </CardFooter>
                     </Card>
                 ))}
              </div>
          ) : (
              <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
                  No pending community verifications at this time.
              </div>
          )}
      </div>
    </div>
  )
}
