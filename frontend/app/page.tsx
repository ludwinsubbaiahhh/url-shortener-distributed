'use client'

import UrlShortenerForm from '../src/components/UrlShortenerForm'

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Shorten URLs instantly</h1>
        <p className="mt-2 text-muted-foreground">
          Paste your long link, optionally choose a custom alias, and get a short link you can share.
        </p>
        <UrlShortenerForm />
      </section>
    </main>
  );
}
