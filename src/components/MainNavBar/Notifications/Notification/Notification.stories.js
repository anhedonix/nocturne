import React from 'react'
import Notification from './Notification'
import Wrapper from '../../../../../wrappers/StorybookWrapper'

export default {
  title: 'Notifications/Notification',
  component: Notification,
}

export const NotificationDefault = () => (
  <Wrapper>
    <Notification />
  </Wrapper>
)
