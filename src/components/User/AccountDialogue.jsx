import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Profile from './Profile'

import * as USER from '../../constants/user'

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      width: '300px',
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'row',
    },
  },
  account: {
    [theme.breakpoints.up('md')]: {
      width: '350px',
    },
  },
  banner: {
    backgroundImage: `url(/BGs/AccountDialogueBanner.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'black',
    // background: `linear-gradient(90deg, \
    //               ${vars.variables.primaryColor} 0%, \
    //               ${vars.variables.secondaryColor} 100%)`,
    height: '100%',
    width: '100%',
    position: 'absolute',
    opacity: '.6',
    zIndex: '0',
  },
  bannerContent: {
    width: '350px',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debug: {
    backgroundColor: 'red',
    minHeight: '200px',
  },
  debug2: {
    backgroundColor: 'yellow',
    minHeight: '200px',
  },
  debug3: {
    backgroundColor: 'blue',
    minHeight: '200px',
  },
  logo: {
    width: '300px',
    margin: '0 auto',
    // display: 'block',
    // position: 'relative',
    // top: '15%',
    flexGrow: '0',
    zIndex: '1',
  },
}))

// create account dialog component
const AccountDialogue = props => {
  const classes = useStyles()
  const { type } = props.type

  // define logic for choosing content of the dialog
  const content =
    type === USER.AD_SIGNIN ? (
      <SignIn {...props} />
    ) : type === USER.AD_SIGNUP ? (
      <SignUp {...props} />
    ) : type === USER.AD_PROFILE ? (
      <Profile {...props} />
    ) : null

  // component body
  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={props.open}
      fullWidth
      maxWidth="md"
      onClose={props.onClose}
    >
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs={12} md={6}>
          {content}
        </Grid>
        <Hidden smDown>
          <Grid item xs={6} className={classes.banner}>
            <div className={classes.overlay} />
            <img src="/Logo.png" alt="logo" className={classes.logo} />
          </Grid>
        </Hidden>
      </Grid>
    </Dialog>
  )
}
// define proptypes
AccountDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.object.isRequired,
}
// export Account dialogue
export default AccountDialogue
