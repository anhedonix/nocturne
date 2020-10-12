import React, { useState, useEffect, useContext } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import validate from 'validate.js'
import InputLabel from '@material-ui/core/InputLabel'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FilledInput from '@material-ui/core/FilledInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import EditIcon from '@material-ui/icons/Edit'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import Divider from '@material-ui/core/Divider'
import { FormHelperText } from '@material-ui/core'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { Alert, AlertTitle } from '@material-ui/lab'
import Avatar from '@material-ui/core/Avatar'

import { MainContext } from '../../states/mainState'
import authentication from '../../functions/user'
import FileUploader from '../Dashboard/Uploader/FileUploader'
import user from '../../constants/contentTypes/user'
import store from '../../functions/store'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'roboto',
  },
  ribbon: {
    backgroundColor: theme.palette.primary.main,
    height: '10px',
    width: '100%',
  },
  textField: {
    margin: '8px 0px',
  },
  forgot: {
    color: theme.palette.text.hint,
    alignSelf: 'flex-start',
    margin: '8px 50px',
  },
  editButton: {
    position: 'relative',
    right: '0px',
    marginLeft: 'auto',
    display: 'block',
  },
  deleteButton: {
    color: 'red',
    borderColor: 'red',
    marginTop: '4rem',
  },
  value: {
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  heading: {},
  avatar: {
    width: '120px',
    height: '120px',
    margin: '24px auto 0 auto',
  },
  avatarButton: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

// create profile component
const Profile = props => {
  const { state, dispatch } = useContext(MainContext)
  const [edit, setEdit] = useState(false)
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState(' ')
  const [email, setEmail] = useState('')
  const [lastName, setLastName] = useState(' ')
  const [errors, setErrors] = useState(null)
  const [showPassword, setshowPassword] = useState(false)
  const [saveEnabled, setSaveEnabled] = useState(false)
  const [passwordError, setPasswordError] = useState()
  const [passwordUpdateDisabled, setPasswordUpdateDisabled] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    setFirstName(state.userData.firstName)
    setLastName(state.userData.lastName)
    setEmail(state.userData.email)
    if (state.userData.avatarUrl) {
      store
        .getFileUrl(state.userData.avatarUrl)
        .then(url => setAvatarUrl(url))
        .catch(err => console.log(err))
    } else {
      setAvatarUrl(null)
    }
  }, [state])

  const classes = useStyles(0)

  // define constraints for checking validation
  const profileConstraints = {
    firstName: {
      presence: {
        allowEmpty: false,
      },
      type: 'string',
    },
    lastName: {
      presence: {
        allowEmpty: false,
      },
      type: 'string',
    },
  }

  const passwordConstraints = {
    password: {
      length: {
        minimum: 6,
      },
      presence: {
        allowEmpty: false,
      },
      type: 'string',
    },
  }

  // function to handle show and hide password
  const handleClickShowPassword = () => {
    setshowPassword(!showPassword)
  }

  // function to run validation set errors if it exists
  const checkProfileErrors = () => {
    const err = validate(
      {
        firstName,
        lastName,
      },
      profileConstraints
    )

    if (err === undefined) {
      setErrors(null)
      return false
    } else {
      setErrors(err)
      return true
    }
  }

  const handlePasswordChange = e => {
    setPassword(e)
    const err = validate({ password: e }, passwordConstraints)
    if (err) {
      setPasswordError(err.password)
      setPasswordUpdateDisabled(true)
    } else {
      setPasswordError(null)
      setPasswordUpdateDisabled(false)
    }
  }

  const handleNameChange = e => {
    const data = state.userData
    setSaveEnabled(false)
    if (e.target.name === 'firstName') {
      setFirstName(e.target.value)
      if (e.target.value !== data.firstName || lastName !== data.lastName) {
        setSaveEnabled(true)
      }
    } else if (e.target.name === 'lastName') {
      setLastName(e.target.value)
      if (e.target.value !== data.lastName || firstName !== data.firstName) {
        setSaveEnabled(true)
      }
    }
  }

  const handleReset = () => {
    const data = state.userData
    setSaveEnabled(false)
    setFirstName(data.firstName)
    setLastName(data.lastName)
    setPassword('')
    setPasswordUpdateDisabled(true)
    setEdit(false)
  }

  // function to handle saveProfile
  const handleSaveProfile = () => {
    const err = checkProfileErrors()
    if (!err) {
      authentication
        .changeName({ firstName, lastName })
        .then(() => {
          dispatch({
            type: 'newMsg',
            payload: {
              message: 'Update successful',
              type: 'success',
            },
          })
          dispatch({ type: 'authData', payload: { firstName, lastName } })
        })
        .catch(reason => {
          dispatch({
            type: 'newMsg',
            payload: {
              message: reason,
              type: 'error',
            },
          })
        })
    }
  }

  // Handle password change
  const handlePasswordSave = () => {
    dispatch({
      type: 'reauth',
      payload: () => {
        authentication
          .changePassword(password)
          .then(() => {
            dispatch({
              type: 'newMsg',
              payload: {
                message: 'Your password has been successfully updated.',
                type: 'success',
              },
            })
            handleReset()
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
      },
    })
  }

  // Handle Account delete
  const handleDeleteAccount = () => {
    dispatch({
      type: 'reauth',
      payload: () => {
        authentication
          .deleteAccount()
          .then(() => {
            dispatch({
              type: 'newMsg',
              payload: {
                message:
                  'Your Account has been successfully deleted, and all your data safely removed.',
                type: 'success',
              },
            })
            handleReset()
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
      },
    })
  }

  const profileMode = (
    <>
      <Typography variant="h5" className={classes.heading}>
        <IconButton
          color="primary"
          onClick={() => setEdit(true)}
          /* className={classes.editButton} */
        >
          <EditIcon />
        </IconButton>
        Profile
      </Typography>
      <Divider />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  <Avatar src={avatarUrl} className={classes.avatar}>
                    {firstName && firstName.substring(0, 1)}
                    {lastName && lastName.substring(0, 1)}
                  </Avatar>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">First Name</TableCell>
                <TableCell className={classes.value}>
                  {state.userData.firstName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Last Name</TableCell>
                <TableCell className={classes.value}>
                  {state.userData.lastName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Email</TableCell>
                <TableCell className={classes.value}>
                  {state.userData.email}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
  const editMode = (
    <>
      <Typography variant="h5" className={classes.heading}>
        <IconButton onClick={handleReset} className={classes.backButton}>
          <ArrowBackIosIcon />
        </IconButton>
        Edit Profile
      </Typography>
      <Divider />
      <Avatar src={avatarUrl} className={classes.avatar}>
        {firstName && firstName.substring(0, 1)}
        {lastName && lastName.substring(0, 1)}
      </Avatar>
      <FileUploader
        path="Avatars"
        text={state.userData.avatarUrl ? 'Change Avatar' : 'Add Avatar'}
        variant="text"
        then={i => {
          user.currentUser().update(null, { avatarUrl: i })
        }}
        drop={state.userData.avatarUrl && state.userData.avatarUrl}
        className={classes.avatarButton}
        dropButton={state.userData.avatarUrl}
        dropThen={() => user.currentUser().update(null, { avatarUrl: null })}
      />
      <TextField
        label="First Name"
        autoFocus
        fullWidth
        autoComplete="given-name"
        className={classes.textField}
        helperText={errors && errors.firstName && errors.firstName.join(', ')}
        error={errors && errors.firstName && errors.firstName}
        name="firstName"
        value={firstName || ''}
        onChange={handleNameChange}
      />
      <TextField
        label="Last Name"
        fullWidth
        autoComplete="family-name"
        className={classes.textField}
        value={lastName || ''}
        name="lastName"
        helperText={errors && errors.lastName && errors.lastName.join(', ')}
        error={errors && errors.lastName}
        onChange={handleNameChange}
      />
      <Button
        /* variant="contained" */
        color="primary"
        style={{ margin: '0 0 0 auto', display: 'block' }}
        onClick={handleSaveProfile}
        disabled={!saveEnabled}
      >
        update profile
      </Button>
      <Divider style={{ marginTop: '2rem' }} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FormControl
          variant="filled"
          fullWidth
          error={passwordError ? true : false}
        >
          <InputLabel htmlFor="filled-adornment-password">
            Change Password
          </InputLabel>
          <FilledInput
            id="filled-password-input2"
            label="Confirm Password2"
            type={showPassword ? 'text' : 'password'}
            className={classes.textField}
            fullWidth
            value={password}
            onChange={e => handlePasswordChange(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {passwordError && (
            <FormHelperText>{passwordError.join(', ')}</FormHelperText>
          )}
        </FormControl>
        <Button
          disabled={passwordUpdateDisabled}
          style={{
            marginLeft: '8px',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
          onClick={handlePasswordSave}
        >
          Update Password
        </Button>
      </div>
      <Button
        variant="outlined"
        className={classes.deleteButton}
        onClick={() => setDeleteOpen(true)}
        fullWidth
      >
        Delete Account
      </Button>
      <Dialog
        onClose={() => setDeleteOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={deleteOpen}
      >
        <MuiDialogTitle disableTypography className={classes.root}>
          <Typography variant="h6">Delete Account</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setDeleteOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent dividers>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Deleting your account will remove all your data, it is not
            recoverable.
            <br />
            You will need to re-authenticate to perform this action.
          </Alert>
        </DialogContent>
        <MuiDialogActions>
          <Button
            autoFocus
            onClick={handleDeleteAccount}
            className={classes.deleteButton}
          >
            Confirm and Delete
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  )

  // component body
  return (
    <>
      {state.user ? (
        <>
          <DialogContent>{edit ? editMode : profileMode}</DialogContent>
        </>
      ) : null}
    </>
  )
}

// export profile component
export default Profile
