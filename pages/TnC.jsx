import Head from 'next/head'
import MainLayout from '../src/layout/MainLayout'
import { TnC } from '../src/components/User/TnC'

import package_names from '../package.json'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Terms & Conditions | {package_names.name}</title>
      </Head>

      <MainLayout>
        <main>
          <TnC />
        </main>
      </MainLayout>
    </div>
  )
}
