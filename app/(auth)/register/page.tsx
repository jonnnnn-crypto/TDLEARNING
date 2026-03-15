import { signup } from '../login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Daftar Akun</h1>
          <p className="text-muted-foreground">Bergabung dengan TD LEARNING hari ini.</p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2 pt-2">
            <Button formAction={signup} className="w-full">
              Buat Akun
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="underline hover:text-primary">
            Masuk
          </Link>
        </div>
      </div>
    </div>
  )
}
