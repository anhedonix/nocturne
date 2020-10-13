import Head from 'next/head'
import MainLayout from '../src/layout/MainLayout'
import { PrivacyPolicy } from '../src/components/User/PrivacyPolicy'

import package_names from '../package.json'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Privacy Policy | {package_names.name}</title>
      </Head>

      <MainLayout>
        <main>
          <PrivacyPolicy />
        </main>
      </MainLayout>
    </div>
  )
}
