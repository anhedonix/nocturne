import React from 'react'
import * as USER from '../constants/user'
import { setLocal, getLocalBool } from '../functions/local'
import authentication from '../functions/user'
import _ from 'lodash'

export const initialState = {
  user: null,
  userData: {
    type: null,
  },
  loading: {
    primary: false,
    secondary: false,
  },
  reauth: {
    state: false,
    function: null,
  },
  messages: getLocalBool('AcceptCookies')
    ? []
    : [
        {
          message: 'This site uses cookies',
          permanent: true,
          type: 'warning',
          action: 'Accept',
          actionFunction: () => setLocal('AcceptCookies', true),
        },
      ],
}

export const MainContext = React.createContext({
  state: undefined,
  dispatch: undefined,
})

export default MainContext

export const reducer = (state, action) => {
  switch (action.type) {
    case 'primaryLoading': {
      return {
        ...state,
        loading: {
          ...state.loading,
          primary: action.payload,
        },
      }
    }
    case 'secondaryLoading': {
      const cState = {
        ...state,
        loading: {
          ...state.loading,
          secondary: action.payload,
        },
      }
      return cState
    }
    // Auth
    case 'authChange': {
      return {
        ...state,
        user: action.payload,
      }
    }

    case 'authData': {
      if (!_.isEmpty(action.payload)) {
        authentication.saveUserInfo({ ...action.payload })
      }
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.payload,
        },
      }
    }

    case 'reauth': {
      return {
        ...state,
        reauth: {
          state: true,
          function: action.payload,
        },
      }
    }

    case 'reauthDone': {
      return {
        ...state,
        reauth: {
          state: false,
          function: null,
        },
      }
    }

    // UI
    case 'switchUi': {
      return {
        ...state,
        userData: {
          ...state.userData,
          darkUI: !state.userData.darkUI,
        },
      }
    }

    case 'setUi': {
      if (typeof window !== 'undefined') {
        setLocal('uiDark', action.payload)
      }
      return {
        ...state,
        uiDark: action.payload,
      }
    }

    // DEV
    case 'devSetUser': {
      return {
        ...state,
        userData: {
          ...state.userData,
          type: action.payload,
        },
      }
    }

    case 'newMsg': {
      const { messages } = state
      messages.push(action.payload)
      return {
        ...state,
        messages,
      }
    }

    case 'dismissMsg': {
      const { messages } = state
      const cMsgs = [...messages]
      cMsgs.shift()
      return {
        ...state,
        messages: cMsgs,
      }
    }

    default: {
      return state
    }
  }
}
