import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Notification from '../Notification/Notification'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // maxHeight: '400px',
    minHeight: '80px',
  },
  title: {
    backgroundColor: theme.palette.action.disabled,
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    // overflowY: 'scroll'
  },
}))

const notificationSection = props => {
  const createNotificationsList = () => {
    const end = props.data.length - 1
    return props.data.map((el, i) => {
      return (
        <React.Fragment key={el[0]}>
          <Notification data={el[1]} dynamic={props.dynamic} index={el[0]} />
          {i !== end && <Divider />}
        </React.Fragment>
      )
    })
  }

  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Paper className={classes.title} square>
        {props.title}
      </Paper>
      <div className={classes.content}>{createNotificationsList()}</div>
    </div>
  )
}

export default notificationSection
