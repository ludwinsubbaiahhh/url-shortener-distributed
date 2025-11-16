'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthApi } from '../../src/hooks/useAuthApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LoginPage() {
	const router = useRouter()
	const { loginUser } = useAuthApi()
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [loading, setLoading] = React.useState(false)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		try {
			await loginUser(email, password)
			toast.success('Logged in successfully')
			router.push('/dashboard')
		} catch (err: any) {
			const message = err?.response?.data?.message || 'Login failed'
			toast.error(message)
		} finally {
			setLoading(false)
		}
	}

	return (
    <div className="mx-auto mt-16 max-w-md px-4">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


