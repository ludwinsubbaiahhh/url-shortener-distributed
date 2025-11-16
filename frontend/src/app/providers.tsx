'use client'

import React from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type ProvidersProps = {
	children: React.ReactNode
}

const apolloClient = new ApolloClient({
	link: new HttpLink({
		uri: 'http://localhost:3001/graphql',
	}),
	cache: new InMemoryCache(),
})

const queryClient = new QueryClient()

export function Providers({ children }: ProvidersProps) {
	return (
		<ApolloProvider client={apolloClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ApolloProvider>
	)
}


