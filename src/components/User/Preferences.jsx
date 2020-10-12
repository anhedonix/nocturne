import { Scrollbars as Scroll } from 'react-custom-scrollbars'
import { Typography, Divider } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Input from '@material-ui/core/Input'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useContext, useState, useEffect } from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
import Switch from '@material-ui/core/Switch'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'

import { MainContext } from '../../states/mainState'

const PreferencesDialog = props => {
  const { state, dispatch } = useContext(MainContext)
  const [uiDark, setUiDark] = useState(false)
  const [messageTimeOut, setMessageTimeOut] = useState(6)

  const handleUIChange = () => {
    setUiDark(!uiDark)
    dispatch({ type: 'switchUi' })
  }

  useEffect(() => {
    setUiDark(state.userData.darkUI)
    setMessageTimeOut(state.userData.messageTimeOut)
  }, [state.userData])

  const { onClose, open } = props

  const handleClose = () => {
    onClose()
  }

  const handleSavePreferences = () => {
    onClose()
    dispatch({ type: 'authData', payload: { darkUI: uiDark, messageTimeOut } })
  }

  const sendTestMessage = () => {
    dispatch({
      type: 'newMsg',
      payload: {
        message: `This is a test message which will last for ${messageTimeOut}secs`,
        type: 'info',
        duration: messageTimeOut,
      },
    })
  }

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="xs">
      <Typography variant="h5" style={{ padding: '16px' }}>
        <SettingsIcon
          style={{
            marginRight: '12px',
            top: '4px',
            position: 'relative',
            display: 'inline-block',
          }}
        />
        Preferences
      </Typography>
      <Divider />
      <TableContainer style={{ height: '50vh', maxHeight: '230px' }}>
        <Scroll>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell align="left">
                  <Typography>Dark UI</Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{ color: '#888888' }}
                  >
                    Use dark interface for this site?
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Switch onChange={handleUIChange} checked={uiDark || false} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">
                  <Typography>Message Timout(sec)</Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    gutterBottom
                    style={{ color: '#888888' }}
                  >
                    How long a message is shown on screen before it disappears.
                    Only one message is shown at any given time.
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    /* style={{ marginLeft: '-5px' }} */
                    onClick={sendTestMessage}
                  >
                    Show test message
                  </Button>
                </TableCell>
                <TableCell align="left">
                  <Input
                    type="number"
                    value={messageTimeOut || 6}
                    onChange={e =>
                      setMessageTimeOut(
                        parseInt(e.target.value) <= 3
                          ? 3
                          : parseInt(e.target.value)
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Scroll>
      </TableContainer>
      <Button
        color="primary"
        size="large"
        variant="contained"
        onClick={handleSavePreferences}
        style={{ color: '#ffffff', borderRadius: '0' }}
      >
        Save
      </Button>
    </Dialog>
  )
}

const Preferences = () => {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <MenuItem onClick={handleClickOpen}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <Typography variant="inherit">Preferences</Typography>
      </MenuItem>
      <PreferencesDialog open={open} onClose={handleClose} />
    </>
  )
}

export default Preferences
