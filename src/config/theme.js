import React, { useState, useEffect, useContext } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { MainContext } from '../states/mainState.js'
import packageJson from '../../package.json'

const color_primary = '#00aaff'
const color_secondary = '#0088ff'
const ui_dense = false

const themes = {
  light: createMuiTheme({
    palette: {
      primary: {
        main: color_primary,
      },
      secondary: {
        main: color_secondary,
      },
      type: 'light',
      dense: ui_dense,
    },
  }),
  dark: createMuiTheme({
    palette: {
      primary: {
        main: color_primary,
      },
      secondary: {
        main: color_secondary,
      },
      type: 'dark',
      dense: ui_dense,
      divider: 'rgba(255,255,255,0.2)',
    },
  }),
}

const ThemeContainer = props => {
  const { state, dispatch } = useContext(MainContext)

  return (
    <ThemeProvider
      {...props}
      theme={
        state.userData.darkUI === undefined
          ? // Default theme for all users
            themes.dark
          : // Theme for logged in users
          state.userData.darkUI
          ? themes.dark
          : themes.light
      }
    >
      {props.children}
    </ThemeProvider>
  )
}

const DarkThemeContainer = props => {
  return (
    <ThemeProvider {...props} theme={themes.dark}>
      {props.children}
    </ThemeProvider>
  )
}

export default ThemeContainer
export { DarkThemeContainer }
