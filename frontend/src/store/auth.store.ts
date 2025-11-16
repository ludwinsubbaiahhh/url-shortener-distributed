'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
	token: string | null
	user: Record<string, any> | null
	login: (token: string, user: Record<string, any>) => void
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			login: (token, user) => set({ token, user }),
			logout: () => set({ token: null, user: null }),
		}),
		{ name: 'auth-store' },
	),
)


