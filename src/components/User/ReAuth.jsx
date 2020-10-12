import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import { blue } from '@material-ui/core/colors'

import { MainContext } from '../../states/mainState'
import authentication from '../../functions/user'

export default function FormDialog() {
  const { state, dispatch } = useContext(MainContext)
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setOpen(state.reauth.state)
    setEmail(state.userData.email)
  }, [state])

  const handleClose = () => {
    dispatch({
      type: 'newMsg',
      payload: {
        message: 'Re-Authentication Cancelled.',
        type: 'error',
      },
    })
    dispatch({ type: 'reauthDone' })
  }

  const handleSubmit = () => {
    authentication
      .reauth(email, password)
      .then(() => {
        dispatch({
          type: 'newMsg',
          payload: {
            message: 'Re-Authentication Successful',
            type: 'success',
            duration: 1,
          },
        })
        state.reauth.function()
        dispatch({ type: 'reauthDone' })
      })
      .catch(reason => {
        dispatch({
          type: 'newMsg',
          payload: {
            message: reason.message,
            type: 'error',
          },
        })
      })
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="re-auth-dialogue">Re-Authentication</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have to authenticate to perform that action.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          value={email}
          disabled
          fullWidth
        />
        <TextField
          margin="dense"
          id="name"
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
