import React from 'react'
import moment from 'moment'
import NotificationsIcon from '@material-ui/icons/Notifications'
import * as firebase from 'firebase/app'

import crud from '../../functions/crud'
import notif from './notification'

const content = {
  ID: 'notifications_global',
  label: 'Global Notification',
  token: 'metaField:_meta/GlobalNotifications/notifications',

  fields: [
    { id: 'uid', label: 'UID', editable: false, type: 'string' },
    { id: 'message', label: 'Message', editable: true, type: 'string' },
    { id: 'link', label: 'Link', editable: true, type: 'string' },
    { id: 'timestamp', label: 'Date/Time', editable: true, type: 'timestamp' },
  ],
  format: {
    default: () => {
      return {
        message: '',
        link: '',
        timestamp: firebase.firestore.Timestamp.now(),
      }
    },
    contentListStruct: data => {
      return {
        header: data.message.substring(0, 30) + '...',
        // detail: data.uid,
        detail: moment(data.timestamp.toDate()).format('YY MM DD LT'),
        uid: data.uid,
      }
    },
  },
}
content.extra = {
  icon: <NotificationsIcon />,
  adminActions: ['create', 'update', 'delete'],
}

const notifications_global = {
  ...content,
  ...crud(content),
  element: { ...crud(content), ...content },
}

export default notifications_global
