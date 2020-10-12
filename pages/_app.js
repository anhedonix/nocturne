import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline'
import packageJson from '../package.json'
import MainStateWrapper from '../src/wrappers/MainStateWrapper.jsx'

// import Layout from '../src/layout'

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <MainStateWrapper>
        <Head>
          <title key="title">{packageJson.name}</title>
          <meta
            name="viewport"
            content="minimum-scale=0.5, initial-scale=1, width=device-width"
          />
        </Head>
        <CssBaseline />
        <Component {...pageProps} />
      </MainStateWrapper>
    )
  }
}
