'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../store/auth.store'

export default function Header() {
	const token = useAuthStore((s) => s.token)
	const logout = useAuthStore((s) => s.logout)

	return (
		<header className="w-full border-b bg-background">
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
				<Link href="/" className="font-semibold">URL Shortener</Link>
				<nav className="flex items-center gap-3">
					{!token ? (
						<>
							<Link href="/login" className="text-sm underline">Login</Link>
							<Link href="/register" className="text-sm underline">Register</Link>
						</>
					) : (
						<>
							<Link href="/dashboard" className="text-sm underline">Dashboard</Link>
							<Button variant="outline" size="sm" onClick={logout}>Logout</Button>
						</>
					)}
				</nav>
			</div>
		</header>
	)
}


