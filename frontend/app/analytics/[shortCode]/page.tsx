'use client'

import React from 'react'
import ProtectedRoute from '../../../src/components/ProtectedRoute'
import { useParams } from 'next/navigation'
import io from 'socket.io-client'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

type UrlAnalyticsRow = {
  id: string
  clickedAt: string
  ipAddress: string | null
  country: string | null
  city: string | null
  device: string | null
  browser: string | null
  referrer: string | null
}

const URL_ANALYTICS = gql`
  query UrlAnalytics($shortCode: String!) {
    urlAnalytics(shortCode: $shortCode) {
      id
      clickedAt
      ipAddress
      country
      city
      device
      browser
      referrer
    }
  }
`

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

export default function AnalyticsPage() {
  const params = useParams<{ shortCode: string }>()
  const shortCode = params?.shortCode
  const [liveClicks, setLiveClicks] = React.useState<UrlAnalyticsRow[]>([])

  const { data, loading, error } = useQuery<{ urlAnalytics: UrlAnalyticsRow[] }>(URL_ANALYTICS, {
    variables: { shortCode },
    skip: !shortCode,
    fetchPolicy: 'cache-and-network',
  })

  React.useEffect(() => {
    if (!shortCode) return
    const socket = io({ path: '/socket.io/', transports: ['websocket'] })
    socket.on('connect', () => {
      socket.emit('join_room', { shortCode })
    })
    socket.on('analytics_update', (payload: any) => {
      setLiveClicks((prev) => [payload, ...prev])
    })
    return () => {
      socket.disconnect()
    }
  }, [shortCode])

  const analytics = data?.urlAnalytics ?? []

  // Aggregate helpers
  const byDateMap = new Map<string, number>()
  for (const a of analytics) {
    const d = new Date(a.clickedAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    byDateMap.set(key, (byDateMap.get(key) ?? 0) + 1)
  }
  const overTimeData = Array.from(byDateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const byCountryMap = new Map<string, number>()
  for (const a of analytics) {
    const key = a.country || 'Unknown'
    byCountryMap.set(key, (byCountryMap.get(key) ?? 0) + 1)
  }
  const countryData = Array.from(byCountryMap.entries()).map(([name, value]) => ({ name, value }))

  const byDeviceMap = new Map<string, number>()
  for (const a of analytics) {
    const key = a.device || 'Unknown'
    byDeviceMap.set(key, (byDeviceMap.get(key) ?? 0) + 1)
  }
  const deviceData = Array.from(byDeviceMap.entries()).map(([name, value]) => ({ name, value }))

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <h1 className="text-2xl font-semibold">Analytics for {shortCode}</h1>

        <Card>
          <CardHeader>
            <CardTitle>Live Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{liveClicks.length}</div>
            <div className="text-sm text-muted-foreground">Real-time clicks since you opened this page</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading…</div>
              ) : error ? (
                <div className="text-sm text-destructive">Error: {error.message}</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overTimeData}>
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clicks by Country</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={countryData} outerRadius={100} label>
                    {countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clicks by Device</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}


