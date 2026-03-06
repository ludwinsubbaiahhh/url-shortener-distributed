'use client'

import axios from 'axios'
import { useAuthStore } from '../store/auth.store'

function parseJwt(token: string): any | null {
	try {
		const payload = token.split('.')[1]
		const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
		return JSON.parse(json)
	} catch {
		return null
	}
}

export function useAuthApi() {
	const loginAction = useAuthStore((s) => s.login)
	const logout = useAuthStore((s) => s.logout)

	async function registerUser(email: string, password: string) {
		const res = await axios.post('/auth/register', { email, password }, { withCredentials: true })
		return res.data
	}

	async function loginUser(email: string, password: string) {
		const res = await axios.post<{ access_token: string }>('/auth/login', { email, password }, { withCredentials: true })
		const token = res.data?.access_token
		if (token) {
			const payload = parseJwt(token)
			const user = payload ? { id: payload.sub, email: payload.email } : { email }
			loginAction(token, user)
		}
		return res.data
	}

	return { registerUser, loginUser, logout }
}


