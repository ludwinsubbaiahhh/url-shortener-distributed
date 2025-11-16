'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/auth.store'

type Props = { children: React.ReactNode }

export default function ProtectedRoute({ children }: Props) {
	const router = useRouter()
	const token = useAuthStore((s) => s.token)
	const [isClient, setIsClient] = React.useState(false)

	React.useEffect(() => {
		setIsClient(true)
	}, [])

	React.useEffect(() => {
		if (isClient && !token) {
			router.replace('/login')
		}
	}, [isClient, token, router])

	if (!isClient) return null
	if (!token) return null
	return <>{children}</>
}


