import React from 'react'
import Profile from './Profile'
import Wrapper from '../../../../wrappers/StorybookWrapper'

export default {
  title: 'Profile',
  component: 'Profile',
}

export const ProfileDefault = () => (
  <Wrapper>
    <Profile />
  </Wrapper>
)
