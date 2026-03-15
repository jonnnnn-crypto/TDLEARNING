import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ course_id: string }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { course_id } = await params;

  // Fetch course details
  const { data: course } = await supabase
    .from('courses')
    .select('*, communities(name, id)')
    .eq('id', course_id)
    .single()

  if (!course) notFound()

  // Fetch lessons for this course
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course_id)
    .order('order_index', { ascending: true })

  // Verify membership if it belongs to a community
  let isMember = true
  if (course.community_id) {
     const { data: membership } = await supabase
       .from('community_members')
       .select('role')
       .eq('community_id', course.community_id)
       .eq('user_id', user.id)
       .single()
     
     if (!membership) isMember = false
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto py-8">
      
      {/* Main Column - Course Overview */}
      <div className="flex-1 space-y-8">
         <div className="space-y-4">
             <div className="flex items-center space-x-2 text-sm text-primary font-medium">
                 <span>Learning Hub</span>
                 <span>/</span>
                 <span>{course.communities?.name || 'Global'}</span>
             </div>
             <h1 className="text-4xl font-extrabold tracking-tight">{course.title}</h1>
             <p className="text-lg text-muted-foreground whitespace-pre-wrap">{course.description}</p>
         </div>

         <div className="space-y-6">
             <h3 className="text-2xl font-bold">Course Content</h3>
             <div className="border rounded-xl overflow-hidden bg-muted/20">
                 {!lessons || lessons.length === 0 ? (
                     <div className="p-8 text-center text-muted-foreground">
                         Belum ada materi (lesson) untuk course ini.
                     </div>
                 ) : (
                     <div className="divide-y">
                         {lessons.map((lesson, idx) => (
                             <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                 <div className="flex items-center space-x-4">
                                     <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-sm font-medium">
                                         {idx + 1}
                                     </div>
                                     <div>
                                         <h4 className="font-semibold">{lesson.title}</h4>
                                         <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                                             <span className="flex items-center"><PlayCircle className="w-3 h-3 mr-1" /> Video</span>
                                             <span className="flex items-center"><BookOpen className="w-3 h-3 mr-1" /> Reading</span>
                                         </div>
                                     </div>
                                 </div>
                                 
                                 {isMember ? (
                                      <Button variant="ghost" asChild>
                                          <Link href={`/learning/${course.id}/lesson/${lesson.id}`}>Study</Link>
                                      </Button>
                                 ) : (
                                     <Lock className="w-5 h-5 text-muted-foreground opacity-50" />
                                 )}
                             </div>
                         ))}
                     </div>
                 )}
             </div>
         </div>
      </div>

       {/* Sidebar - Course Actions */}
       <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-20 border rounded-xl overflow-hidden bg-background shadow-sm">
             <div className="aspect-video bg-muted flex items-center justify-center">
                 <PlayCircle className="w-16 h-16 text-muted-foreground/50" />
             </div>
             <div className="p-6 space-y-6">
                 <div>
                     <div className="text-xl font-bold mb-4">Included in course:</div>
                     <ul className="space-y-3 text-sm text-muted-foreground">
                         <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-primary" /> {lessons?.length || 0} Lessons</li>
                         <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-primary" /> Self-paced learning</li>
                         <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-primary" /> Certificate of completion</li>
                     </ul>
                 </div>
                 
                 {isMember ? (
                     <Button className="w-full" size="lg" asChild>
                         <Link href={`/learning/${course.id}/lesson/${lessons?.[0]?.id || ''}`}>
                            Start Learning
                         </Link>
                     </Button>
                 ) : (
                     <div className="space-y-3">
                         <Button className="w-full" size="lg" disabled>Locked</Button>
                         <p className="text-xs text-center text-muted-foreground">
                            You must join the <b>{course.communities?.name}</b> community to access this course.
                         </p>
                         <Button variant="outline" className="w-full" asChild>
                             <Link href={`/community/${course.community_id}`}>Go to Community</Link>
                         </Button>
                     </div>
                 )}
             </div>
          </div>
       </div>

    </div>
  )
}
