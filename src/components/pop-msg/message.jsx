import React, { useState, useContext } from 'react'
import { MainContext } from '../../states/mainState.js'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import Slide from '@material-ui/core/Slide'
import Alert from '@material-ui/lab/Alert'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />
}

const MessageStructure = {
  message: 'Message text', // Contents of the message
  duration: 1, // Duration of the message
  permanent: false, // Should the message wait till user action?
  action: 'Action', // String to be shown in the action button
  actionFunction: () => {}, // The function to be run when the action button is clicked
}

const Messages = () => {
  const { state, dispatch } = useContext(MainContext)
  const [open, setOpen] = useState(true)

  const close = () => {
    setOpen(false)
    const tmp = state.messages[0]
    if (tmp) {
      if (tmp.actionFunction) {
        tmp.actionFunction()
      }
    }
  }

  const removeMsg = () => {
    dispatch({
      type: 'dismissMsg',
    })
    setOpen(true)
  }

  if (state.messages.length) {
    const msg = state.messages[0]
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        TransitionComponent={TransitionUp}
        autoHideDuration={
          msg.duration
            ? msg.duration * 1000
            : state.userData.messageTimeOut
            ? state.userData.messageTimeOut * 1000
            : 8000
        }
        onClose={msg.permanent ? null : close}
        onExited={removeMsg}
      >
        <Alert severity={msg.type ? msg.type : 'info'}>
          {msg.message}
          {msg.action ? (
            <Button color="secondary" size="small" onClick={close}>
              {msg.action}
            </Button>
          ) : (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={close}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Alert>
      </Snackbar>
    )
  } else {
    return null
  }
}

export default Messages
