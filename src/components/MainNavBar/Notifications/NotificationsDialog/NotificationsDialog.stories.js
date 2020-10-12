import React from 'react'
import NotificationsDialog from './NotificationsDialog'
import Wrapper from '../../../../../wrappers/StorybookWrapper'

export default {
  title: 'Notifications/NotificationDialog',
  component: NotificationsDialog,
}

export const NotificationsDialogDefault = () => (
  <Wrapper>
    <NotificationsDialog />
  </Wrapper>
)
