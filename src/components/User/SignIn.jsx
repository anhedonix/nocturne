import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import validate from 'validate.js'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import FilledInput from '@material-ui/core/FilledInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { FormHelperText } from '@material-ui/core'

import * as USER from '../../constants/user.js'
import ForgotPassword from './ForgotPassword'

// define styles
const useStyles = makeStyles(theme => ({
  root: {
    // width: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'roboto',
  },
  textField: {
    margin: '8px 0px',
  },
}))
// define constraints to check validation
const constraints = {
  email: {
    email: {
      message: '^E-mail address is invalid',
    },
    presence: {
      allowEmpty: false,
    },
    type: 'string',
  },
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

// create SignIn component
const SignIn = props => {
  //asign useStyle to classes
  const classes = useStyles()

  // state intialize
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [showPassword, setshowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)

  // set props to local variables
  const { setType } = props.type
  const { onSubmit } = props

  // function to handle show and hide password
  const handleClickShowPassword = () => {
    setshowPassword(!showPassword)
  }

  // function to run validation using constraints and set errors if exists
  const checkErrors = () => {
    const err = validate(
      {
        email,
        password,
      },
      constraints
    )

    if (err === undefined) {
      setErrors({})
      return false
    } else {
      setErrors(err)
      return true
    }
  }

  // function to handle sign in button
  const handleSignIn = () => {
    if (checkErrors()) {
      console.log(errors)
    } else {
      onSubmit({
        email,
        password,
      })
    }
  }

  // component body
  return (
    <>
      <DialogTitle id="form-dialog-title">Sign In</DialogTitle>
      <DialogContent>
        <form className={classes.root} noValidate onSubmit={handleSignIn}>
          <TextField
            label="Email"
            fullWidth
            autoComplete="email"
            variant="filled"
            className={classes.textField}
            value={email}
            helperText={errors.email && errors.email.join(', ')}
            error={errors.email ? true : false}
            onChange={e => setEmail(e.target.value)}
          />
          <FormControl
            variant="filled"
            fullWidth
            error={errors.password ? true : false}
          >
            <InputLabel htmlFor="filled-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              id="filled-password-input2"
              label="Confirm Password2"
              type={showPassword ? 'text' : 'password'}
              className={classes.textField}
              fullWidth
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password ? true : false}
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
            {errors.password && (
              <FormHelperText>{errors.password.join(', ')}</FormHelperText>
            )}
          </FormControl>
        </form>
        <div
          style={{
            margin: '8px auto',
          }}
        >
          <span>
            <Button onClick={() => setForgotPassword(true)} color="primary">
              Forgot your password?
            </Button>
          </span>
        </div>
        <Button
          style={{
            color: 'white',
          }}
          fullWidth
          onClick={handleSignIn}
          variant="contained"
          color="primary"
        >
          Sign In
        </Button>
        <div
          style={{
            margin: '14px auto 0 auto',
          }}
        >
          Don't have an account?{'  '}
          <span>
            <Button onClick={() => setType(USER.AD_SIGNUP)} color="primary">
              Sign Up Now
            </Button>
          </span>
        </div>
      </DialogContent>
      <ForgotPassword
        open={forgotPassword}
        onClose={() => setForgotPassword(false)}
      />
    </>
  )
}

// export signin component
export default SignIn
