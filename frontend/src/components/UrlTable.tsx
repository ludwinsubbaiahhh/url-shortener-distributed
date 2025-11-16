'use client'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

const MY_URLS = gql`
  query MyUrls {
    myUrls {
      id
      longUrl
      shortCode
      createdAt
      # clicks may be part of schema; if not, omit or add in backend
      clicks
    }
  }
`

const DELETE_URL = gql`
  mutation DeleteUrl($shortCode: String!) {
    deleteUrl(shortCode: $shortCode)
  }
`

export default function UrlTable() {
  const { data, loading, error, refetch } = useQuery(MY_URLS)
  const [deleteUrl, { loading: deleting }] = useMutation(DELETE_URL, {
    onCompleted: () => {
      toast.success('Link deleted')
      refetch()
    },
    onError: (err) => toast.error(err.message),
  })

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>
  if (error) return <div className="text-sm text-destructive">Error: {error.message}</div>

  const rows = data?.myUrls ?? []

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Short URL</TableHead>
          <TableHead>Original URL</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r: any) => {
          const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'}/${r.shortCode}`
          return (
            <TableRow key={r.id}>
              <TableCell className="max-w-[220px] truncate">
                <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {shortUrl}
                </a>
              </TableCell>
              <TableCell className="max-w-[360px] truncate">{r.longUrl}</TableCell>
              <TableCell>{r.clicks ?? 0}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting}
                  onClick={() => deleteUrl({ variables: { shortCode: r.shortCode } })}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}


