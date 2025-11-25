'use client'

import React from 'react'
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setContext } from '@apollo/client/link/context'
import { useAuthStore } from '../store/auth.store'

type ProvidersProps = {
	children: React.ReactNode
}

function createApolloClient() {
	const httpLink = new HttpLink({ uri: 'http://localhost:3001/graphql' })
	const authLink = setContext((_, { headers }) => {
		const token = useAuthStore.getState().token
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : '',
			},
		}
	})
	return new ApolloClient({
		link: ApolloLink.from([authLink, httpLink]),
		cache: new InMemoryCache(),
	})
}

const queryClient = new QueryClient()

export function Providers({ children }: ProvidersProps) {
	const [client] = React.useState(() => createApolloClient())
	return (
		<ApolloProvider client={client}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ApolloProvider>
	)
}


