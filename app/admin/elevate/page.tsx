import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ElevatePage() {
  const adminClient = createAdminClient()
  const userId = '43135578-1f1f-4923-85c3-7092e32f7a50'

  console.log(`Attempting to elevate user: ${userId}`)

  // Using raw update for reliability
  const { data, error } = await adminClient
    .from('users')
    .update({ role: 'super_admin' })
    .eq('id', userId)
    .select()

  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-red-500 text-2xl font-bold">Elevation Failed</h1>
        <pre className="mt-4 p-4 bg-red-100 rounded text-sm overflow-auto max-w-full">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
         <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
         </svg>
      </div>
      <h1 className="text-3xl font-bold">Elevation Successful!</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        User <span className="font-mono text-primary">{userId}</span> has been promoted to <span className="font-bold">super_admin</span>.
      </p>
      <div className="mt-8 p-6 bg-white/5 border border-white/5 rounded-2xl max-w-md w-full text-left">
         <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Debug Info</p>
         <pre className="text-[10px] font-mono whitespace-pre-wrap opacity-60">
            {JSON.stringify(data, null, 2)}
         </pre>
      </div>
      <a href="/dashboard" className="mt-10 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity">
         Back to Dashboard
      </a>
    </div>
  )
}
