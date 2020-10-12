import React from 'react'
import { auth } from 'firebase/app'
import PeopleIcon from '@material-ui/icons/People'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import * as firebase from 'firebase/app'

import crud from '../../functions/crud'
// import * as USER from '../../constants/user'
import store from '../../functions/store'

const content = {
  ID: 'notification',
  label: 'Notification',
  token: 'field:users/notifications',
  fields: [
    { id: 'uid', label: 'UID', editable: false, type: 'uid' },
    { id: 'message', label: 'Message', editable: true, type: 'string' },
    { id: 'read', label: 'Read?', editable: false, type: 'bool' },
    { id: 'link', label: 'Link', editable: true, type: 'string' },
    { id: 'timestamp', label: 'Date/Time', editable: true, type: 'timestamp' },
  ],
  format: {
    default: () => {
      return {
        message: '',
        read: false,
        link: '',
        timestamp: moment().toDate(),
      }
    },
    adminDefault: () => {
      return {
        uid: uuid(),
        message: '',
        read: false,
        link: '',
        timestamp: firebase.firestore.Timestamp.now(),
      }
    },
    contentListStruct: data => {
      return {
        header: data.message.substring(0, 20) + '...',
        detail: data.uid,
        meta1: moment(data.timestamp.toDate()).format('YY MM DD LT'),
      }
    },
  },
}
content.extra = {
  icon: <PeopleIcon />,
}

/**
 * CRUD functions for the notifications of the current user.
 */
const currentUserCrud = type => {
  if (auth() && auth().currentUser) {
    const uid = auth().currentUser.uid
    return {
      /**
       * Create content
       * @param {Object} payload optional ID that has to be used.
       */
      create: payload => store.createContent(type, uid, payload),

      /**
       * Read all notifications
       */
      read: () => store.readContent(type, uid),

      /**
       * Read content snapshot.
       * @param {Function} SetterFunction Function to run with data
       */
      readSnap: fn => store.readContentSnapshot(type, fn, uid),

      /**
       * Update content
       * @param {string} Key Item to be updated.
       * @param {Object} Payload the data that is to be stored.
       */
      update: (key, payload = undefined) =>
        store.updateContent(type, auth().currentUser.uid, key, payload),

      /**
       * Delete content
       * @param {string} UID optional ID that has to be used.
       * @param {string} Key Item to be updated.
       */
      delete: id => store.deleteContent(type, auth().currentUser.uid, id),

      /**
       * Mark notifications read status
       * @param {string} Key Item to be updated.
       * @param {boolean} state optional ID that has to be used.
       */
      markRead: (key, state) =>
        store.updateContent(type, auth().currentUser.uid, key, { read: state }),
    }
  } else {
    return undefined
  }
}

const notification = {
  ...content,
  ...crud(content),
  currentUser: () => currentUserCrud(content),
}

export default notification
