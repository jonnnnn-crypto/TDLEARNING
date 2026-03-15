import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Search, Signal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default async function LearningPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all courses
  // In a real app we might filter by communities the user has joined
  const { data: courses } = await supabase
    .from('courses')
    .select('*, communities(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
          <p className="text-muted-foreground">Akses materi belajar dari komunitas yang Anda ikuti.</p>
        </div>
        {/* Placeholder for Course Builder action for Admins */}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses..." className="pl-10 max-w-md" />
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">
                        {course.category || 'General'}
                    </span>
                    <span className="flex items-center text-xs text-muted-foreground">
                        <Signal className="w-3 h-3 mr-1" />
                        <span className="capitalize">{course.difficulty}</span>
                    </span>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {course.description || 'No description provided.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                   <BookOpen className="w-4 h-4 mr-2"/>
                   Community: {course.communities?.name || 'Global'}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                    <Link href={`/learning/${course.id}`}>Start Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No Courses Found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
             Belum ada materi pembelajaran yang dibuat oleh komunitas. Admin komunitas dapat membuat course baru.
          </p>
        </div>
      )}
    </div>
  )
}
