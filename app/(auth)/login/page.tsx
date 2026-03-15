import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Masuk ke pembelajaran teknologi Anda</p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Lupa password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2 pt-2">
            <Button formAction={login} className="w-full">
              Log in
            </Button>
            <Button formAction={signup} variant="outline" className="w-full">
              Daftar akun
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/register" className="underline hover:text-primary">
            Daftar
          </Link>
        </div>
      </div>
    </div>
  )
}
