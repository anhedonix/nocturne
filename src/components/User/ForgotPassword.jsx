import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import authentication from '../../functions/user'
import { MainContext } from '../../states/mainState'

const ForgotPassword = props => {
  const [email, setEmail] = useState('')
  const { dispatch } = useContext(MainContext)

  const open = props.open

  const handleClose = () => {
    props.onClose()
  }

  const handleRecovery = () => {
    authentication
      .resetPassword(email)
      .then(() => {
        dispatch({
          type: 'newMsg',
          payload: {
            message: 'Recovery Email sent successfully',
            type: 'success',
          },
        })
        handleClose()
      })
      .catch(reason =>
        dispatch({
          type: 'newMsg',
          payload: {
            message: reason.message,
            type: 'error',
          },
        })
      )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="forgot-password-dialogue"
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To recover your password, enter your registered email to receive
          password reset instructions.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRecovery} color="primary">
          Recover
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ForgotPassword
