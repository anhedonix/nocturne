import Head from 'next/head'
import MainLayout from '../src/layout/MainLayout'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Nocturne</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <MainLayout>
        <main>Nocturne base</main>
        <footer>Footer</footer>
      </MainLayout>
    </div>
  )
}
