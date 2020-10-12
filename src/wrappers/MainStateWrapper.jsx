import CssBaseline from '@material-ui/core/CssBaseline'
import PropTypes from 'prop-types'
import React, { useEffect, useReducer } from 'react'

import { MainContext, reducer, initialState } from '../states/mainState'
import Messages from '../components/pop-msg/message'
import ReAuth from '../components/User/ReAuth'
import ThemeContainer from '../config/theme'
import * as content from '../constants/contentTypes'
import firebase from '../firebase/firebase'
import _ from 'lodash'

const MainStateWrapper = props => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: 'loading', payload: true })
    let snap = () => {}
    const authListner = firebase.auth().onAuthStateChanged(e => {
      dispatch({
        type: 'authChange',
        payload: e,
      })
      if (e) {
        content.user
          .currentUser()
          .readSnap(d => {
            dispatch({
              type: 'authData',
              payload: _.omit(d, ['uid']),
            })
            dispatch({ type: 'loading', payload: false })
          })
          .then(unsub => (snap = unsub))
      } else {
        snap()
        dispatch({
          type: 'authData',
          payload: null,
        })
        dispatch({ type: 'loading', payload: false })
      }
    })
    return () => {
      authListner()
    }
  }, [])

  return (
    <MainContext.Provider value={{ state, dispatch }}>
      <ThemeContainer>
        <CssBaseline />
        {props.children}
        <Messages />
        <ReAuth />
      </ThemeContainer>
    </MainContext.Provider>
  )
}

MainStateWrapper.propTypes = {
  children: PropTypes.any,
}

export default MainStateWrapper
