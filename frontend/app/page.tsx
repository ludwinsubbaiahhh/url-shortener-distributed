import dynamic from 'next/dynamic'
const UrlShortenerForm = dynamic(() => import('../src/components/UrlShortenerForm'), { ssr: false })
export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Shorten URLs instantly</h1>
        <p className="mt-2 text-muted-foreground">
          Paste your long link, optionally choose a custom alias, and get a short link you can share.
        </p>
        {/* @ts-expect-error Server component imports client component */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <UrlShortenerForm />
      </section>
    </main>
  );
}
