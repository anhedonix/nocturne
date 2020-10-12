import { Container, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useContext } from 'react'

import MainNavBar from '../components/MainNavBar'
import DevToolbar from '../dev/DevToolbar'
import MainContext from '../states/mainState'

// define styles
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    padding: '0',
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    alignItems: 'center',
  },
}))

const MainLayout = props => {
  const { state } = useContext(MainContext)
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <DevToolbar />
      <MainNavBar />
      <Container maxWidth={false} className={classes.container}>
        {props.children}
      </Container>
    </div>
  )
}

export default MainLayout
