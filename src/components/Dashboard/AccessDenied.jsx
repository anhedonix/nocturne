import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import NoEncryptionIcon from '@material-ui/icons/NoEncryption'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import AccountDialogue from '../User/AccountDialogue'
import * as USER from '../../constants/user'
import authentication from '../../functions/user'
import { MainContext } from '../../states/mainState'

const useStyles = makeStyles(theme => ({
  accesDeniedRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  warningIcon: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vw',
    maxHeight: '600px',
    margin: '56px',
  },

  lock: {
    width: '20vw',
    height: '20vw',
    maxWidth: '300px',
    color: '#ef5350',
  },
  circle: {
    width: '40vw',
    height: '40vw',
    maxWidth: '600px',
    position: 'absolute',
    color: '#8888',
  },
  message: {
    fontSize: '20px',
  },
}))

const AccessDenied = () => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  const { state, dispatch } = useContext(MainContext)
  const handleSubmit = parms => {
    if (type === USER.AD_SIGNUP) {
      authentication
        .signUp(parms)
        .then(() => {
          setOpen(false)
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
  }

  const [type, setType] = useState(USER.AD_SIGNIN)

  return (
    <div className={classes.accesDeniedRoot}>
      <div className={classes.warningIcon}>
        <NoEncryptionIcon className={classes.lock} />
        <RadioButtonUncheckedIcon className={classes.circle} />
      </div>
      <p className={classes.message}>
        {state.user
          ? 'You have to be an Admin to access this page'
          : 'You do not have permission to access this content'}
      </p>
      {!state.user ? (
        <>
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: '32px' }}
            onClick={() => {
              setType(USER.AD_SIGNIN)
              setOpen(true)
            }}
          >
            Sign In
          </Button>
          <AccountDialogue
            open={open}
            onClose={handleClose}
            onSubmit={handleSubmit}
            type={{ type, setType }}
          />
        </>
      ) : null}
    </div>
  )
}

export default AccessDenied
