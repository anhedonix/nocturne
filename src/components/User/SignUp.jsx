import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
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
import validate from 'validate.js'

import * as USER from '../../constants/user'
import PrivacyPolicy from './PrivacyPolicy'
import TnC from './TnC'

//define styles
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
  heading: {
    fontSize: '24px',
    margin: '16px',
    color: theme.palette.text.primary,
  },
  forgot: {
    color: theme.palette.text.hint,
    alignSelf: 'flex-start',
    margin: '8px 50px',
  },
}))

//define constraints for checking validation
const constraints = {
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
  password2: {
    equality: {
      attribute: 'password',
      message: "didn't match",
    },
    presence: {
      allowEmpty: false,
    },
    type: 'string',
  },
  accept: {
    inclusion: {
      within: [true],
      message: 'You need to accept the T&C and Privacy Policy to continue',
    },
  },
}

//create Signup component
const SignUp = props => {
  //create states
  const classes = useStyles()
  const [firstName, setfirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [errors, setErrors] = useState({})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPassword, setshowPassword] = useState(false)
  const [accept, setAccept] = useState(false)

  //props as local varialbles
  const { onSubmit } = props
  const { setType } = props.type

  //function to handle show and hide password
  const handleClickShowPassword = () => {
    setshowPassword(!showPassword)
  }

  //function to run validation set errors if it exists
  const checkErrors = () => {
    const err = validate(
      {
        email,
        password,
        firstName,
        lastName,
        password2,
        accept,
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

  //function to handle signup button
  const handleSignUp = () => {
    if (checkErrors()) {
      console.log(errors)
    } else {
      onSubmit({
        email,
        firstName,
        lastName,
        password,
        accept,
      })
    }
  }
  // component body
  return (
    <>
      <DialogTitle id="form-dialog-title">SignUp</DialogTitle>
      <DialogContent>
        <form className={classes.root} noValidate>
          <TextField
            label="First Name"
            variant="filled"
            autoFocus
            fullWidth
            autoComplete="given-name"
            className={classes.textField}
            value={firstName}
            helperText={errors.firstName && errors.firstName.join(', ')}
            error={errors.firstName ? true : false}
            onChange={e => setfirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="filled"
            fullWidth
            autoComplete="family-name"
            className={classes.textField}
            value={lastName}
            helperText={errors.lastName && errors.lastName.join(', ')}
            error={errors.lastName ? true : false}
            onChange={e => setLastName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            variant="filled"
            autoComplete="email"
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
              autoComplete="password"
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
          <TextField
            id="filled-password-input"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            variant="filled"
            className={classes.textField}
            fullWidth
            value={password2}
            helperText={errors.password2 && errors.password2.join(', ')}
            error={errors.password2 ? true : false}
            onChange={e => setPassword2(e.target.value)}
          />
          <div
            style={{
              alignSelf: 'flex-start',
            }}
          >
            <Checkbox
              checked={accept}
              name="accept"
              onChange={e => setAccept(e.target.checked)}
            />
            I Accept <TnC />
            and <PrivacyPolicy />
            <div
              style={{
                color: 'red',
                margin: '0 0 0 0%',
                alignSelf: 'flex-start',
                fontSize: '12px',
              }}
            >
              {errors.accept && errors.accept.join(', ')}
            </div>
          </div>
        </form>
        <Button
          style={{
            color: 'white',
          }}
          fullWidth
          onClick={handleSignUp}
          variant="contained"
          color="primary"
        >
          Sign Up
        </Button>
        <div
          style={{
            margin: '14px auto',
          }}
        >
          Already have an account?
          <span>
            <Button onClick={() => setType(USER.AD_SIGNIN)} color="primary">
              Sign In Now
            </Button>
          </span>
        </div>
      </DialogContent>
    </>
  )
}
// export signup component
export default SignUp
