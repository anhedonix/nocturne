import Head from 'next/head'
import React from 'react'

import { name } from '../../package.json'
import MainLayout from '../../src/layout/MainLayout'
import Dashboard from '../../src/components/Dashboard'

export default function designer() {
  return (
    <div className="container">
      <Head>
        <title>{name[0].toUpperCase() + name.substr(1).toLowerCase()}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <MainLayout>
        <Dashboard />
      </MainLayout>
    </div>
  )
}
