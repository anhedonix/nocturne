import React from 'react'
import Account from './Account'
import Wrapper from '../../../wrappers/StorybookWrapper'

export default {
  title: 'Account',
  component: Account,
}

export const AccountDefault = () => (
  <Wrapper>
    <Account />
  </Wrapper>
)
