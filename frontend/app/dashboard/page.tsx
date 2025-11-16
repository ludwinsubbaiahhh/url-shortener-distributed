'use client'

import ProtectedRoute from '../../src/components/ProtectedRoute'
import dynamic from 'next/dynamic'

const UrlTable = dynamic(() => import('../../src/components/UrlTable'), { ssr: false })

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Your URLs</h1>
        <div className="mt-6">
          {/* @ts-ignore */}
          <UrlTable />
        </div>
      </main>
    </ProtectedRoute>
  )
}


