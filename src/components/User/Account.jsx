import { RiLogoutCircleRLine } from 'react-icons/ri'
import { auth } from 'firebase/app'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Link from 'next/link'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import React, { useState, useContext } from 'react'
import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent'
import Tooltip from '@material-ui/core/Tooltip'
import DashboardIcon from '@material-ui/icons/Dashboard'

import { MainContext } from '../../states/mainState'
import AccountDialogue from './AccountDialogue'
import Preferences from '../User/Preferences'
import * as USER from '../../constants/user'
import authentication from '../../functions/user'

// create account component
const Account = ({ CType = Button }) => {
  // get main state
  const { state, dispatch } = useContext(MainContext)
  // create local states
  const [open, setOpen] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [type, setType] = useState(USER.AD_SIGNIN)
  const [pMenu, setPMenu] = useState(null)

  // function to close dialogue
  const handleClose = () => {
    setOpen(false)
    setOpenProfile(false)
  }

  const handleProfileMenu = event => {
    setPMenu(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setPMenu(null)
  }

  const handleProfileOpen = () => {
    setType(USER.AD_PROFILE)
    setOpenProfile(true)
  }

  // function to run on submit(signin and signup)
  const handleSubmit = parms => {
    if (type === USER.AD_SIGNUP) {
      authentication
        .signUp(parms)
        .then(() => {
          setOpen(false)
          setOpenProfile(false)
          dispatch({
            type: 'newMsg',
            payload: {
              message: 'Sign Up Successful',
              type: 'success',
            },
          })
          dispatch({
            type: 'newMsg',
            payload: {
              message:
                'A verification email has been sent to you. ' +
                'Please verify your email to gain full access to the site features.',
              type: 'info',
            },
          })
        })
        .catch(e => {
          dispatch({
            type: 'newMsg',
            payload: {
              message: e.message,
              type: 'error',
            },
          })
        })
    } else if (type === USER.AD_SIGNIN) {
      authentication
        .signIn(parms.email, parms.password)
        .then(() => {
          setOpen(false)
          setOpenProfile(false)
          dispatch({
            type: 'newMsg',
            payload: {
              message: 'Sign In Successful',
              type: 'success',
            },
          })
        })
        .catch(e => {
          dispatch({
            type: 'newMsg',
            payload: {
              message: e.message,
              type: 'error',
            },
          })
        })
    }
    setOpen(false)
    setOpenProfile(false)
  }

  // component body
  return (
    <>
      {!auth().currentUser ? (
        <>
          <Tooltip title="Sign In">
            <CType
              onClick={() => {
                setType(USER.AD_SIGNIN)
                setOpen(true)
              }}
              color="inherit"
            >
              <AccountCircleIcon />
            </CType>
          </Tooltip>
          <AccountDialogue
            open={open}
            onClose={handleClose}
            onSubmit={handleSubmit}
            type={{ type, setType }}
          />
        </>
      ) : (
        <>
          <Tooltip title="Profile">
            <CType onClick={handleProfileMenu} color="inherit">
              <AccountCircleIcon />
            </CType>
          </Tooltip>
          <Menu
            id="simple-menu"
            anchorEl={pMenu}
            keepMounted
            open={Boolean(pMenu)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            getContentAnchorEl={null}
          >
            <MenuItem onClick={handleProfileOpen}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              Profile
            </MenuItem>
            {(state.userData.type === 'ADMIN' ||
              state.userData.type === 'DEV') && (
              <Link href="/dashboard" as="/dashboard">
                <MenuItem>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>
              </Link>
            )}
            <Preferences />
            <MenuItem
              onClick={() => {
                authentication
                  .signOut()
                  .then(() => {
                    dispatch({
                      type: 'newMsg',
                      payload: {
                        message: 'sign out successful',
                        variant: 'success',
                      },
                    })
                    setOpen(false)
                    setPMenu(false)
                  })
                  .catch(e => {
                    dispatch({
                      type: 'newMsg',
                      payload: {
                        message: e.message,
                        variant: 'error',
                      },
                    })
                    setOpen(false)
                  })
              }}
            >
              <ListItemIcon>
                <RiLogoutCircleRLine
                  style={{ height: '24px', width: '24px' }}
                />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          <AccountDialogue
            open={openProfile}
            onClose={handleClose}
            onSubmit={handleSubmit}
            type={{ type, setType }}
          />
        </>
      )}
    </>
  )
}
// define proptypes
Account.propTypes = {
  CType: PropTypes.object,
}

Account.defaultProps = {
  CType: IconButton,
}
// export account component
export default Account
