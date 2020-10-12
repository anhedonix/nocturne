import React from 'react'
import Wrapper from '../../../wrappers/StorybookWrapper'
import FileUploader from './FileUploader'

export default {
  title: 'Admin/Uploaders',
  component: FileUploader,
}

export const DefaultImageUploader = () => (
  <Wrapper>
    <FileUploader path="trial" then={i => console.log(i)} />
    <FileUploader
      path="trial2"
      type=".sdm"
      text="Upload SDM"
      then={i => console.log(i)}
    />
  </Wrapper>
)
