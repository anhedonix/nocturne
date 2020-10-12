import React from 'react'
import PeopleIcon from '@material-ui/icons/People'

import crud from '../../functions/crud'
import user from './user'

const content = {
  ID: 'users',
  label: 'Users',
  token: 'collection:users',
  format: user.format,
  fields: user.fields,
  element: user,
}

content.extra = {
  icon: <PeopleIcon />,
  adminActions: ['update'],
  filters: {
    type: {
      id: 'type',
      label: 'Type',
      default: 'ALL',
      options: ['DEV', 'ADMIN', 'PREMIUM', 'CLIENT', 'ALL'],
    },
  },
}

const users = { ...content, ...crud(content) }

export default users
