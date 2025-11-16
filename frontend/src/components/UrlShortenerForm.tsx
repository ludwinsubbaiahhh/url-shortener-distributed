'use client'

import React from 'react'
import axios from 'axios'
import QRCode from 'react-qr-code'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ShortenResponse = {
	id: string
	shortCode: string
	longUrl: string
	shortUrl: string
	expiresAt?: string
	createdAt: string
}

export default function UrlShortenerForm() {
	const [longUrl, setLongUrl] = React.useState('')
	const [customAlias, setCustomAlias] = React.useState('')
	const [result, setResult] = React.useState<ShortenResponse | null>(null)

	const mutation = useMutation({
		mutationFn: async (payload: { longUrl: string; customAlias?: string }) => {
			const res = await axios.post<ShortenResponse>('http://localhost:3001/api/shorten', payload, {
				withCredentials: true,
			})
			return res.data
		},
		onSuccess: (data) => {
			setResult(data)
			toast.success('URL shortened successfully!')
		},
		onError: (err: any) => {
			const message = err?.response?.data?.message || 'Failed to shorten URL'
			toast.error(message)
		},
	})

	function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setResult(null)
		mutation.mutate({
			longUrl,
			customAlias: customAlias || undefined,
		})
	}

	return (
		<div className="max-w-xl mx-auto w-full">
			<form onSubmit={onSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="longUrl">Long URL</Label>
					<Input
						id="longUrl"
						placeholder="https://example.com/very/long/url"
						value={longUrl}
						onChange={(e) => setLongUrl(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="customAlias">Custom alias (optional)</Label>
					<Input
						id="customAlias"
						placeholder="my-custom-code"
						value={customAlias}
						onChange={(e) => setCustomAlias(e.target.value)}
					/>
				</div>
				<Button type="submit" disabled={mutation.isPending} className="w-full">
					{mutation.isPending ? 'Shortening…' : 'Shorten URL'}
				</Button>
			</form>

			{result && (
				<Card className="mt-6">
					<CardHeader>
						<CardTitle>Your short link</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<a className="text-blue-600 underline break-all" href={result.shortUrl} target="_blank" rel="noreferrer">
							{result.shortUrl}
						</a>
						<div className="bg-white p-4 inline-block">
							<QRCode value={result.shortUrl} size={128} />
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}


