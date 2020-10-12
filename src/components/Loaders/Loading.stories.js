import React from 'react'
import Wrapper from '../../../wrappers/StorybookWrapper'

import Loading from './Loading'

export default {
  title: 'UI/Loading',
  component: Loading,
}

export const LoadingDefault = () => (
  <Wrapper>
    <Loading />
  </Wrapper>
)
