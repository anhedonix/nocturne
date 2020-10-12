import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import LaunchIcon from '@material-ui/icons/Launch'
import Moment from 'react-moment'
import PropTypes from 'prop-types'
import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'

import * as content from '../../../../constants/contentTypes'

const useStyles = makeStyles(theme => ({
  bar: {
    display: 'flex',
    minHeight: '80px',
    padding: '10px 0',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: theme.palette.action.focus,
    },
  },
  grow: {
    flexGrow: '1',
  },
  unread: read => ({
    color: !read ? '#0091ea' : theme.palette.action.focus,
    marginLeft: '8px',
  }),
  read: {
    color: theme.palette.text.primary,
    marginLeft: '8px',
  },
  message: read => ({
    marginLeft: '12px',
    minWidth: '200px',
    color: !read ? theme.palette.text.primary : theme.palette.action.disabled,
  }),
  time: {
    fontSize: '10px',
    color: theme.palette.action.disabled,
    marginLeft: '12px',
  },
  gMessage: {
    marginLeft: '12px',
    minWidth: '200px',
    color: theme.palette.text.primary,
  },
}))

const Notification = props => {
  const classes = useStyles(props.data.read)

  const handleRead = () => {
    content.notification.currentUser().markRead(props.index, !props.data.read)
  }

  const deleteNotification = () => {
    content.notification.currentUser().delete(props.index)
  }

  return (
    <div className={classes.bar}>
      <IconButton
        onClick={props.dynamic ? handleRead : null}
        className={props.dynamic ? classes.unread : classes.read}
      >
        <FiberManualRecordIcon />
      </IconButton>
      <div>
        <div className={classes.time}>
          <Moment format="YYYY MMM DD dd HH:mm">
            {props.data.timestamp.toDate()}
          </Moment>
        </div>
        <div className={!props.dynamic ? classes.gMessage : classes.message}>
          {props.data.message}
        </div>
      </div>
      <div className={classes.grow} />
      {props.data.link && (
        <Tooltip title="open link">
          <a href={`${props.data.link}`} target="_blank">
            <IconButton>
              <LaunchIcon color={!props.data.read ? 'primary' : 'disabled'} />
            </IconButton>
          </a>
        </Tooltip>
      )}
      {props.dynamic && (
        <Tooltip title="delete notification">
          <IconButton
            onClick={deleteNotification}
            style={{ marginLeft: props.data.link ? null : '50px' }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

Notification.propTypes = {
  index: PropTypes.string,
  data: PropTypes.object,
  dynamic: PropTypes.bool,
}

export default Notification
