import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import React, { useContext, useState, useEffect } from 'react'
import Switch from '@material-ui/core/Switch'
import Link from 'next/link'

import { loremIpsum } from 'lorem-ipsum'

import { MainContext } from '../states/mainState.js'
import { name } from '../../package.json'
import * as USER from '../constants/user.js'
import * as content from '../constants/contentTypes'

const useStyles = makeStyles(theme => ({
  root: {
    borderBottom: `1px dashed ${theme.palette.primary.main}`,
    width: '100%',
    minWidth: '100%',
  },
  header: {
    fontWeight: 'bold',
    marginLeft: '24px',
    marginRight: '24px',
    fontSize: '1.2em',
  },
}))

const DevToolbar = () => {
  const { state, dispatch } = useContext(MainContext)
  const [anchorEl, setAnchorEl] = useState(false)
  const [anchorEl2, setAnchorEl2] = useState(false)
  const [dark, setDark] = useState(false)
  const classes = useStyles()

  const handleUiChange = () => {
    dispatch({
      type: 'switchUi',
    })
  }

  useEffect(() => {
    setDark(state.userData.darkUI)
  }, [state.userData.darkUI])

  const handleUserMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleUserChange = props => {
    dispatch({
      type: 'devSetUser',
      payload: props,
    })
    handleUserMenuClose()
  }

  const handleNotifMenu = event => {
    setAnchorEl2(event.currentTarget)
  }

  const handleNotifMenuClose = () => {
    setAnchorEl2(null)
  }

  const handleNotifChange = props => {
    dispatch({
      type: 'devSetNotif',
      payload: props,
    })
    handleNotifMenuClose()
  }

  return state.userData.type === USER.DEV ? (
    <Paper square className={classes.root}>
      <a
        href="/"
        style={{ color: 'inherit', textDecoration: 'inherit' }}
        className={classes.header}
      >
        {name}
      </a>
      <Switch
        checked={dark || false}
        onChange={handleUiChange}
        name="checkedA"
      />
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleUserMenu}
      >
        Set User ({state.userData.type})
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={() => handleUserChange(USER.ADMIN)}>Admin</MenuItem>
        <MenuItem onClick={() => handleUserChange(USER.CLIENT)}>
          Client
        </MenuItem>
        <MenuItem onClick={() => handleUserChange(USER.ANON)}>Anon</MenuItem>
        <MenuItem onClick={() => handleUserChange(USER.PREMIUM)}>
          Premium
        </MenuItem>
      </Menu>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleNotifMenu}
      >
        Create Notification
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleNotifMenuClose}
      >
        <MenuItem
          onClick={() => {
            content.notification.currentUser().create({
              message: loremIpsum(),
            })
          }}
        >
          User
        </MenuItem>
        <MenuItem
          onClick={() => {
            content.notifications_global.create({
              message: loremIpsum(),
            })
          }}
        >
          Global
        </MenuItem>
      </Menu>
      <Button href="/api/defaults">API Defaults</Button>
      <Button href="/api/defaults/env">API Env</Button>
    </Paper>
  ) : null
}

export default DevToolbar
