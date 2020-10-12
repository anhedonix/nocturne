import React from 'react'
import Preferences from './Preferences'
import Wrapper from '../../../../wrappers/StorybookWrapper'

export default {
  title: 'Preferences',
  component: Preferences,
}

export const PreferencesDefault = () => (
  <Wrapper>
    <Preferences />
  </Wrapper>
)
