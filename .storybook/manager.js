import { addons } from '@storybook/addons'
import { themes } from '@storybook/theming'
import { create } from '@storybook/theming/create'
import { name } from '../package.json'

const theme = create({
  base: 'dark',
  brandTitle: name,
  brandUrl: 'SaddlesIndia.Studio'
})

addons.setConfig({
  showPanel: false,
  theme: theme
})
