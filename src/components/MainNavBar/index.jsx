import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Link from 'next/link'
import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { name } from '../../../package.json'
// TODO: Implement Account
import Account from '../User/Account'
import Notification from './Notifications/Notifications'

const useStyles = makeStyles(theme => ({
  mainNavBar: {
    width: '100%',
    display: 'flex',
  },
  navBar: {
    width: '100%',
    display: 'flex',
    background: '#000000',
    color: '#ffffff',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}))

export default function PrimarySearchAppBar() {
  const classes = useStyles()

  return (
    <div className={classes.mainNavBar}>
      <AppBar position="static">
        <Toolbar className={classes.navBar}>
          <Link href="/">
            <a
              style={{ color: 'inherit', textDecoration: 'inherit' }}
              className={classes.header}
            >
              <Typography className={classes.title} variant="h6" noWrap>
                {name[0].toUpperCase() + name.substr(1).toLowerCase()}
              </Typography>
            </a>
          </Link>
          <div className={classes.grow} />
          <div>
            <Notification />
            <Account />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}
