const setLocal = (property, value) => {
  if (typeof window !== 'undefined') {
    return localStorage.setItem(property, value)
  } else {
    return null
  }
}

const getLocalBool = (property, defValue = false) => {
  if (
    typeof window !== 'undefined' &&
    typeof localStorage.getItem(property) !== 'undefined'
  ) {
    if (localStorage.getItem(property) === 'false') {
      return false
    } else if (localStorage.getItem(property) === 'true') {
      return true
    } else {
      // TODO: Throw an error on screen, instead of a console log?
      console.log('Not a boolean value')
      return defValue
    }
  } else {
    return defValue
  }
}

const getLocal = (property, defValue = null) => {
  if (
    typeof window !== 'undefined' &&
    typeof localStorage.getItem(property) !== 'undefined'
  ) {
    return localStorage.getItem(property)
  } else {
    return defValue
  }
}

export { setLocal, getLocal, getLocalBool }
