import * as firebase from 'firebase/app'
import config from '../config/firebase.js'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/performance'

let app, analytics, auth, firestore, storage, performance

if (!firebase.apps.length) {
  firebase.initializeApp(config)

  if (typeof window !== 'undefined') {
    if ('measurementId' in config) {
      analytics = firebase.analytics()
      performance = firebase.performance()
    }
  }

  // Enable offline persistance
  // firebase
  //   .firestore()
  //   .enablePersistence()
  //   .catch(err => {
  //     if (err.code === 'failed-precondition') {
  //       console.log(
  //         'Multiple tabs open, persistance of data only works on one tab at a time.'
  //       )
  //     } else if (err.code === 'unimplemented') {
  //       console.log('Current browser does not support data persistance')
  //     }
  //   })
}

app = firebase.app()

auth = firebase.auth()

firestore = firebase.firestore()
firestore.settings({ experimentalForceLongPolling: true })

storage = firebase.storage()

export default app

export { auth, analytics, firestore, storage, performance }
