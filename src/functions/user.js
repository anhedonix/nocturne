import firebase, { analytics, auth, firestore } from 'firebase/app'
import user from '../constants/contentTypes/user'
import contentTypeUser from '../constants/contentTypes/user'
import store from './store'

const authentication = {}

authentication.signUp = fields => {
  return new Promise((resolve, reject) => {
    if (!fields) {
      reject('All the fields are required.')
      return
    }

    if (auth().currentUser) {
      reject('You are already logged in.')
      return
    }

    const firstName = fields.firstName
    const lastName = fields.lastName
    const email = fields.email
    const password = fields.password

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        const user = value.user

        if (!user) {
          reject('User does not exist.')
          return
        }

        user.sendEmailVerification()

        const uid = user.uid

        if (!uid) {
          reject('Could not fetch user UID.')
          return
        }

        const userDocumentReference = firestore().collection('users').doc(uid)

        const data = {
          ...contentTypeUser.format.default(),
          firstName,
          lastName,
          email,
        }

        userDocumentReference
          .set(data, { merge: false })
          .then(() => {
            resolve(user)
          })
          .catch(reason => {
            reject(reason)
          })
      })
      .catch(reason => reject(reason))
  })
}

authentication.signIn = (emailAddress, password) => {
  return new Promise((resolve, reject) => {
    if (!emailAddress || !password) {
      reject('No email or password provided.')
      return
    }

    if (auth().currentUser) {
      reject('Already logged in.')
      return
    }

    auth()
      .signInWithEmailAndPassword(emailAddress, password)
      .then(value => {
        const user = value.user
        if (!user) {
          reject('No user available')
          return
        }

        const uid = user.uid

        if (!uid) {
          reject('No user uid available')
          return
        }

        const userDocumentReference = firestore().collection('users').doc(uid)

        userDocumentReference
          .get({
            source: 'server',
          })
          .then(value => {
            resolve(value)
          })
          .catch(reason => {
            reject(reason)
          })
      })
      .catch(reason => {
        reject(reason)
      })
  })
}

authentication.reauth = (emailAddress, password) => {
  return new Promise((resolve, reject) => {
    if (!emailAddress || !password) {
      reject('No email or password provided.')
      return
    }

    auth()
      .signInWithEmailAndPassword(emailAddress, password)
      .then(value => {
        const user = value.user
        if (!user) {
          reject('No user available')
          return
        }

        const uid = user.uid

        if (!uid) {
          reject('No user uid available')
          return
        }

        const userDocumentReference = firestore().collection('users').doc(uid)

        userDocumentReference
          .get({
            source: 'server',
          })
          .then(value => {
            resolve(value)
          })
          .catch(reason => {
            reject(reason)
          })
      })
      .catch(reason => {
        reject(reason)
      })
  })
}

authentication.signOut = () => {
  return new Promise((resolve, reject) => {
    const currentUser = auth().currentUser

    if (!currentUser) {
      reject('No current user available.')
      return
    }

    auth()
      .signOut()
      .then(value => {
        resolve(value)
      })
      .catch(reason => {
        reject(reason)
      })
  })
}

authentication.resetPassword = emailAddress => {
  return new Promise((resolve, reject) => {
    if (!emailAddress) {
      reject({ message: 'Email address not provided.' })
      return
    }

    if (auth().currentUser) {
      reject({ message: 'You are already logged in.' })
      return
    }

    auth()
      .sendPasswordResetEmail(emailAddress)
      .then(value => {
        resolve(value)
      })
      .catch(reason => {
        reject(reason)
      })
  })
}

authentication.deleteAccount = (id = null) => {
  return new Promise((resolve, reject) => {
    const uid = id || auth().currentUser.uid
    if (!uid) {
      reject({
        code: 'data/no-uid',
        message: 'No uid provided.',
      })
      return
    }

    const userRef = firestore().collection('users').doc(uid)

    userRef
      .get()
      .then(doc => {
        const files = []
        const data = doc.data()
        for (var i = 0; i < user.fields.length; i++) {
          if (['image', 'file'].includes(user.fields[i].type)) {
            if (data[user.fields[i].id]) {
              files.push(data[user.fields[i].id])
            }
          }
        }
        for (var i = 0; i < files.length; i++) {
          store.dropFile(files[i])
        }
      })
      .then(() => {
        userRef
          .delete()
          .then(() => {
            auth()
              .currentUser.delete()
              .then(value => {
                resolve(value)
              })
              .catch(reason => {
                reject(reason)
              })
          })
          .catch(reason => reject(reason))
      })
  })
}

authentication.changeName = props => {
  return new Promise((resolve, reject) => {
    if (!props) {
      reject('No Data provided.')
      return
    }

    const currentUser = auth().currentUser

    if (!currentUser) {
      reject({
        code: 'auth/not-signed-in',
        message: 'You need to be signed in to perform this action.',
      })
      return
    }

    const uid = currentUser.uid

    if (!uid) {
      reject({
        code: 'store/no-user-data',
        message: 'Unable to find your data.',
      })
      return
    }

    const userDocumentReference = firestore().collection('users').doc(uid)

    userDocumentReference
      .update({
        firstName: props.firstName,
        lastName: props.lastName,
      })
      .then(value => {
        resolve(value)
      })
      .catch(reason => {
        reject(reason)
      })
  })
}

authentication.changePassword = password => {
  return new Promise((resolve, reject) => {
    if (!password) {
      reject('No password provided')
      return
    }
    const currentUser = auth().currentUser

    if (!currentUser) {
      reject({
        code: 'auth/not-signed-in',
        message: 'You need to be signed in to perform this action.',
      })
      return
    }

    const uid = currentUser.uid

    if (!uid) {
      reject({
        code: 'store/no-user-data',
        message: 'Unable to find your data.',
      })
      return
    }

    currentUser
      .updatePassword(password)
      .then(value => {
        const userDocumentReference = firestore().collection('users').doc(uid)

        userDocumentReference
          .update({
            lastPasswordChange: firebase.firestore.Timestamp.now(),
          })
          .then(value => {
            resolve(value)
          })
          .catch(reason => {
            reject(reason)
          })
      })
      .catch(reason => {
        reject(reason)
      })
  })
}

authentication.verifyEmailAddress = () => {
  return new Promise((resolve, reject) => {
    const currentUser = auth().currentUser

    if (!currentUser) {
      reject()
      return
    }

    currentUser
      .sendEmailVerification()
      .then(value => {
        analytics.logEvent('verify_email_address')
        resolve(value)
      })
      .catch(reason => {
        reject(reason)
      })
  })
}

authentication.isAdmin = () => {
  return new Promise((resolve, reject) => {
    authentication
      .getRoles()
      .then(value => {
        resolve(value.includes('admin'))
      })
      .catch(reason => {
        reject(reason)
      })
  })
}

authentication.getData = uid => {
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject()
      return
    }

    firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(e => resolve(e.data()))
      .catch(e => reject(e))
  })
}

authentication.saveUserInfo = values => {
  return new Promise((resolve, reject) => {
    const currentUser = auth().currentUser
    if (currentUser) {
      const uid = currentUser.uid
      firestore()
        .collection('users')
        .doc(uid)
        .set(values, { merge: true })
        .then(e => resolve(e))
        .catch(e => reject(e))
    }
  })
}

export default authentication
