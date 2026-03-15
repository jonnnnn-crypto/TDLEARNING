import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Presentation } from 'lucide-react'

export default async function LessonPage({
  params
}: {
  params: Promise<{ course_id: string, lesson_id: string }>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { course_id, lesson_id } = await params;

  // Fetch the lesson
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, courses(title, id, community_id)')
    .eq('id', lesson_id)
    .single()

  if (!lesson) notFound()

  // Ensure user is allowed (member of community or global course)
  if (lesson.courses?.community_id) {
    const { data: membership } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', lesson.courses.community_id)
        .eq('user_id', user.id)
        .single()
    
    if (!membership) {
        redirect(`/learning/${course_id}`)
    }
  }

  // Get index / navigation
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title')
    .eq('course_id', course_id)
    .order('order_index', { ascending: true })

  const currentIdx = allLessons?.findIndex(l => l.id === lesson_id) ?? -1
  const prevLesson = currentIdx > 0 ? allLessons?.[currentIdx - 1] : null
  const nextLesson = currentIdx !== -1 && allLessons && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  return (
    <div className="flex flex-col h-full lg:flex-row -m-4 sm:-m-6">
      
      {/* Left Sidebar Table of Contents */}
      <div className="w-full lg:w-80 bg-background border-r lg:min-h-[calc(100vh-4rem)] flex flex-col shrink-0">
          <div className="p-4 border-b">
              <Link href={`/learning/${course_id}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
              </Link>
              <h2 className="font-bold">{lesson.courses?.title}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {allLessons?.map((l, index) => {
                  const isActive = l.id === lesson_id
                  return (
                      <Link 
                          key={l.id} 
                          href={`/learning/${course_id}/lesson/${l.id}`}
                          className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                      >
                          <span className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-full text-xs font-medium ${isActive ? 'bg-primary-foreground/20' : 'bg-muted'}`}>
                              {index + 1}
                          </span>
                          <span className={`text-sm mt-0.5 ${isActive ? 'font-medium' : ''}`}>
                              {l.title}
                          </span>
                      </Link>
                  )
              })}
          </div>
      </div>

      {/* Main Lesson Content Area */}
      <div className="flex-1 bg-muted/20 min-h-screen overflow-y-auto p-4 sm:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
             <div className="bg-background rounded-2xl border p-8 shadow-sm">
                 <h1 className="text-3xl font-bold mb-8">{lesson.title}</h1>
                 
                 {/* Video Player Placeholder */}
                 {lesson.video_url || true ? ( // true to force show the placeholder
                     <div className="aspect-video bg-black rounded-xl mb-12 flex items-center justify-center border shadow-inner">
                         <div className="text-center">
                             <Presentation className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                             <p className="text-muted-foreground text-lg font-medium">Video Player Module</p>
                             <p className="text-xs text-muted-foreground/50 mt-2">Integrating with Supabase Storage / YouTube</p>
                         </div>
                     </div>
                 ) : null}

                 {/* Article Content / Markdown Wrapper */}
                 <div className="prose prose-zinc dark:prose-invert max-w-none">
                     {lesson.content ? (
                         <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                     ) : (
                         <p className="text-muted-foreground italic">No article content provided for this lesson.</p>
                     )}
                 </div>
             </div>

             {/* Bottom Navigation */}
             <div className="flex items-center justify-between pt-8 pb-16">
                 {prevLesson ? (
                     <Link href={`/learning/${course_id}/lesson/${prevLesson.id}`} className="group flex items-center text-muted-foreground hover:text-foreground">
                         <ArrowLeft className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
                         <div>
                             <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Previous</div>
                             <div className="font-medium text-foreground">{prevLesson.title}</div>
                         </div>
                     </Link>
                 ) : <div></div>}

                 {nextLesson ? (
                     <Link href={`/learning/${course_id}/lesson/${nextLesson.id}`} className="group flex items-center text-right text-muted-foreground hover:text-foreground">
                         <div>
                             <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Next Lesson</div>
                             <div className="font-medium text-foreground">{nextLesson.title}</div>
                         </div>
                         <ArrowLeft className="w-5 h-5 ml-3 rotate-180 transition-transform group-hover:translate-x-1" />
                     </Link>
                 ) : (
                     <div className="text-right">
                         <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Up Next</div>
                         <div className="font-medium text-primary flex items-center">
                            Course Completed <BookOpen className="w-4 h-4 ml-2" />
                         </div>
                     </div>
                 )}
             </div>
          </div>
      </div>

    </div>
  )
}
