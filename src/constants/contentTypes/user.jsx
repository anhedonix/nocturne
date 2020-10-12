import React from 'react'
import { auth } from 'firebase/app'
import PeopleIcon from '@material-ui/icons/People'

import * as USER from '../../constants/user'
import notification from './notification'
import store from '../../functions/store'
import crud from '../../functions/crud'
import authentication from '../../functions/user'

const content = {
  ID: 'user',
  label: 'User',
  token: 'doc:users',
  extra: {
    icon: <PeopleIcon />,
  },
  fields: [
    { id: 'uid', label: 'UID', editable: false, type: 'uid' },
    { id: 'email', label: 'E-Mail', editable: false, type: 'string' },
    {
      id: 'avatarUrl',
      label: 'Avatar',
      editable: true,
      type: 'avatar',
      path: 'Avatars',
    },
    { id: 'firstName', label: 'First Name', editable: true, type: 'string' },
    { id: 'lastName', label: 'Last Name', editable: true, type: 'string' },
    {
      id: 'type',
      label: 'User Type',
      editable: true,
      type: 'stringList',
      options: [...USER.TYPES],
    },
    { id: 'darkUI', label: 'Dark Theme', editable: false, type: 'bool' },
    {
      id: 'messageTimeOut',
      label: 'Message Timeout (secs)',
      editable: true,
      type: 'int',
      min: 1.5,
      max: 12,
      step: 0.5,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      editable: true,
      type: 'content',
      content: notification,
      format: input => {
        const data = []
        if (input) {
          Object.keys(input).map(i => data.push({ ...input[i], uid: i }))
        }
        return data
      },
      reformat: input => {
        const data = {}
        if (input) {
          input.map(el => {
            const { uid, ...vals } = { ...el }
            data[uid] = { ...vals }
          })
        }
        return data
      },
    },
  ],
  format: {
    default: () => {
      return {
        avatarUrl: null,
        firstName: '',
        lastName: '',
        email: '',
        darkUI: false,
        messageTimeOut: 6,
        type: USER.CLIENT,
        notifications: {},
      }
    },
    contentListStruct: data => {
      return {
        detail: data.firstName + ' ' + data.lastName,
        header: data.email,
        meta1: undefined,
        meta2: data.type,
        uid: data.uid,
      }
    },
  },
}

content.extra = {
  icon: <PeopleIcon />,
}

const currentUserCrud = type => {
  if (auth() && auth().currentUser) {
    const uid = auth().currentUser.uid
    return {
      /**
       * Read current user
       */
      read: () => store.readContent(type, uid),

      /**
       * Read user snapshot.
       * @param {Function} SetterFunction Function to run with data
       */
      readSnap: fn => store.readContentSnapshot(type, fn, uid),

      /**
       * Update user
       * @param {string} Key Item to be updated.
       * @param {Object} Payload the data that is to be stored.
       */
      update: (key, payload = undefined) =>
        store.updateContent(type, auth().currentUser.uid, key, payload),

      delete: () => {
        authentication.deleteAccount(uid)
      },
    }
  } else {
    return {}
  }
}

const user = {
  ...content,
  ...crud(content),
  delete: id => authentication.deleteAccount(id),
  currentUser: () => currentUserCrud(content),
}

export default user
