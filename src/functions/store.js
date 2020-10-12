import { v4 as uuid } from 'uuid'
import { storage, firestore } from '../firebase/firebase'
import _ from 'lodash'

const store = {}

/**
 * Fucntion for uploading files
 *
 * @param {File} File type to be worked on from constants/comment.
 * @param {string} path User/Main content ID that holds the values
 * @param {function} Function that runs for each state change.
 *
 * @return {string} Resolves to path of the file
 */
store.uploadFile = (file, path, progressFunction, folder = undefined) => {
  return new Promise((resolve, reject) => {
    const fileNameArray = file.name.split('.')
    const fileExtension = fileNameArray[fileNameArray.length - 1]
    const fullPath = !folder
      ? `${path}/${uuid()}.${fileExtension}`
      : `${path}/${folder}/${file.name}`
    const fileRef = storage.ref().child(fullPath)
    const uploadTask = fileRef.put(file)
    uploadTask.on(
      'state_changed',
      i => {
        const progress = (i.bytesTransferred / i.totalBytes) * 100
        progressFunction(progress ? progress : 0)
      },
      e => reject(e),
      () => resolve(fullPath)
    )
  })
}

/**
 * Fucntion for deleting files
 *
 * @param {string} path file that is to be deleted.
 *
 * @return {string} Success message
 */
store.dropFile = path => {
  return new Promise((resolve, reject) => {
    storage
      .ref()
      .child(path)
      .delete()
      .then(() => resolve('success'))
      .catch(err => reject(err))
  })
}

/**
 * Fucntion for getting the given file's URL
 *
 * @param {string} path The path for which accessable url needs to be provided
 *
 * @return {string} Resolves to path of the file
 */
store.getFileUrl = path => {
  return new Promise((resolve, reject) => {
    storage
      .ref()
      .child(path)
      .getDownloadURL()
      .then(url => resolve(url))
      .catch(e => reject(e))
  })
}

store.getDoc = (collection, id) => {
  return new Promise((resolve, reject) => {
    const docRef = firestore
      .collection(collection)
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          resolve(doc.data())
        } else {
          reject('No such document exists.')
        }
      })
      .catch(reason => reject(reason))
  })
}

store.getAllDocs = collection => {
  // Get all documents in a particular collection
  return new Promise((resolve, reject) => {
    const colRef = firestore
      .collection(collection)
      .get()
      .then(doc => {
        if (doc.exists) {
          resolve(doc.data())
        } else {
          reject('No such document exists.')
        }
      })
      .catch(reason => reject(reason))
  })
}

/**
 * Function for setting elements to the database.
 *
 * @param {contentType} contentType Content type to be worked on from constants/comment.
 * @param {id} ID User/Main content ID that holds the values
 * @param {payload} payload The array or object that needs to be added to the DB.
 *
 * This function works well on arrays and objects. It is not designed for any
 * other types
 */
store.createContent = (contentType, id = null, payload = null) => {
  const [access, token] = contentType.token.split(':')
  let path
  if (token) {
    path = token.split('/')
  }
  return new Promise((resolve, reject) => {
    switch (access) {
      case 'collection': {
        firestore
          .collection(token)
          .add({ ...contentType.format.default(), ...payload })
          .then(doc => doc.get().then(i => console.log(i)))
        break
      }

      case 'doc': {
        if (id) {
          firestore
            .collection(token)
            .doc(id)
            .set(
              { ...contentType.format.default(), ...payload },
              { merge: true }
            )
            .then(doc => doc.get().then(i => resolve(i.id)))
        } else {
          firestore
            .collection(token)
            .add({ ...contentType.format.default(), ...payload })
            .then(doc => doc.get().then(i => resolve(i.id)))
        }
        break
      }

      case 'field': {
        if (!id) {
          reject({ message: 'No id provided' })
        }
        const docRef = firestore.collection(path[0]).doc(id)
        docRef
          .get()
          .then(doc => {
            const data = doc.data()[path[1]]
            let newData
            if (payload) {
              newData = {
                ...data,
                [uuid()]: { ...contentType.format.default(), ...payload },
              }
            } else {
              newData = {
                ...data,
                [uuid()]: { ...contentType.format.default() },
              }
            }
            docRef
              .set({ [path[1]]: newData }, { merge: true })
              .then(() => resolve(newData))
              .catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
        break
      }

      case 'metaField': {
        const docRef = firestore.collection(path[0]).doc(path[1])
        docRef
          .get()
          .then(doc => {
            const data = doc.data()
            const field = data[path[2]]
            let newField
            const newUid = uuid()
            const newData = {
              [newUid]: { ...contentType.format.default(), ...payload },
            }
            newField = {
              ...field,
              ...newData,
            }
            docRef
              .set({ [path[2]]: { ...newField } }, { merge: true })
              .then(() => resolve(newUid))
              .catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
        break
      }
    }
  })
}

/**
 * Function for getting elements from db
 *
 * @param {contentType} contentType Content type to be worked on from constants/comment.
 * @param {id} ID User/Main content ID that holds the values
 * @param {payload} payload The array or object that needs to be added to the DB.
 *
 * This function works well on arrays and objects. It is not designed for any
 * other types
 */
store.readContent = (
  contentType,
  id = null,
  filter = null,
  pagination = {
    orderby: '',
    limit: null,
    element: null,
    start: true,
  }
) => {
  return new Promise((resolve, reject) => {
    const [access, token] = contentType.token.split(':')
    let path
    if (token) {
      path = token.split('/')
    }
    switch (access) {
      case 'collection': {
        if (!filter || filter.split(':')[1] === 'ALL') {
          firestore
            .collection(token)
            .get()
            .then(docs => {
              const data = []
              docs.forEach(doc => data.push({ ...doc.data(), uid: doc.id }))
              resolve(data)
            })
            .catch(reason => reject(reason))
        } else {
          const [filterType, filterToken] = filter.split(':')
          firestore
            .collection(token)
            .where(filterType, '==', filterToken)
            .get()
            .then(docs => {
              const data = []
              docs.forEach(doc => data.push({ ...doc.data(), uid: doc.id }))
              resolve(data)
            })
            .catch(reason => reject(reason))
        }
        break
      }
      case 'doc': {
        if (id) {
          firestore
            .collection(token)
            .doc(id)
            .get()
            .then(doc => resolve({ ...doc.data(), uid: id }))
            .catch(reason => reject(reason))
        } else {
          if (!filter) {
            if (pagination) {
              const currentCollectionRef = firestore
                .collection(token)
                .orderBy(pagination.orderby)
                .limit(pagination.limit)
              if (pagination.element) {
                if (pagination.start) {
                  currentCollectionRef
                    .startAt(pagination.element)
                    .get()
                    .then(docs => {
                      const data = []
                      docs.forEach(doc =>
                        data.push({ ...doc.data(), uid: doc.id, doc })
                      )
                      resolve(data)
                    })
                    .catch(reason => reject(reason))
                } else {
                  currentCollectionRef
                    .endAt(pagination.element)
                    .get()
                    .then(docs => {
                      const data = []
                      docs.forEach(doc =>
                        data.push({ ...doc.data(), uid: doc.id, doc })
                      )
                      resolve(data)
                    })
                    .catch(reason => reject(reason))
                }
              } else {
                currentCollectionRef
                  .get()
                  .then(docs => {
                    const data = []
                    docs.forEach(doc =>
                      data.push({ ...doc.data(), uid: doc.id, doc })
                    )
                    resolve(data)
                  })
                  .catch(reason => reject(reason))
              }
            } else {
              firestore
                .collection(token)
                .get()
                .then(docs => {
                  const data = []
                  docs.forEach(doc => data.push({ ...doc.data(), uid: doc.id }))
                  resolve(data)
                })
                .catch(reason => reject(reason))
            }
          } else {
            const [filterType, filterToken] = filter.split(':')
            firestore
              .collection(token)
              .where(filterType, '==', filterToken)
              .get()
              .then(docs => {
                const data = []
                docs.forEach(doc => data.push({ ...doc.data(), uid: doc.id }))
                resolve(data)
              })
              .catch(reason => reject(reason))
          }
        }
        break
      }
      case 'field': {
        if (!id) {
          reject({ message: 'No id provided' })
        }
        firestore
          .collection(path[0])
          .doc(id)
          .get()
          .then(doc => resolve({ ...doc.data()[path[1]], uid: id }))
          .catch(reason => reject(reason))
        break
      }
      case 'metaField': {
        const metaRef = firestore.collection(path[0]).doc(path[1])

        metaRef
          .get()
          .then(doc => {
            if (!doc.exists) {
              metaRef.set({})
            }
            if (doc.data()) {
              const data = []
              const c_doc = doc.data()[path[2]]
              if (!id) {
                Object.keys(c_doc).map(key =>
                  data.push({ ...c_doc[key], uid: key })
                )
                resolve(data)
              } else {
                resolve({ ...c_doc[id], uid: id })
              }
            } else {
              metaRef.set({ [path[2]]: {} })
            }
          })
          .catch(reason => reject(reason))
        break
      }

      case 'defaults': {
        const metaRef = firestore.collection(path[0]).doc(path[1])

        metaRef
          .get()
          .then(doc => {
            if (!doc.exists) {
              metaRef.set({})
            }
            if (doc.data()) {
              resolve(doc.data())
            }
          })
          .catch(reason => reject(reason))
        break
      }
    }
  })
}

/**
 * This function gets a snapshot of the values from the DB and runs the
 * given function everytime the snapshot changes.
 *
 * @param {contentType} contentType Content type that is required, from constants/content.
 * @param {setter} setterFunction The function that is to be run on each change, this is
 * usually a setState Hook.
 * @param {id} ID The id of the element that is required, depends on the kind
 * of content.
 */
store.readContentSnapshot = (contentType, setter, id = null) => {
  const [access, token] = contentType.token.split(':')
  let path
  if (token) {
    path = token.split('/')
  }
  return new Promise((resolve, reject) => {
    switch (access) {
      case 'collection': {
        reject({ message: 'Cannot snapshot collections' })
        break
      }
      case 'doc': {
        if (!id) {
          reject({ message: 'No id provided' })
        }
        const unsubscribe = firestore
          .collection(token)
          .doc(id)
          .onSnapshot(doc => {
            setter({ ...doc.data(), uid: id })
            resolve(unsubscribe)
          })
        break
      }
      case 'field': {
        if (!id) {
          reject({ message: 'No id provided' })
        }
        const unsubscribe = firestore
          .collection(path[0])
          .doc(id)
          .onSnapshot(doc => {
            setter({ ...doc.data()[path[1]], uid: id })
            resolve(unsubscribe)
          })
        break
      }
      case 'metaField': {
        const unsubscribe = firestore
          .collection(path[0])
          .doc(path[1])
          .onSnapshot(doc => {
            if (id) {
              setter({ ...doc.data()[path[2]][id], uid: id })
            } else {
              setter(doc.data()[path[2]])
            }
            resolve(unsubscribe)
          })
        break
      }
      case 'defaults': {
        const unsubscribe = firestore
          .collection(path[0])
          .doc(path[1])
          .onSnapshot(doc => {
            if (id) {
              setter({ ...doc.data(), uid: id })
            } else {
              setter(doc.data())
            }
            resolve(unsubscribe)
          })
        break
      }
    }
  })
}

/**
 * Function for setting elements to the database.
 *
 * @param {contentType} contentType Content type to be worked on from constants/comment.
 * @param {id} ID User/Main content ID that holds the values
 * @param {payload} payload The array or object that needs to be added to the DB.
 *
 * This function works well on arrays and objects. It is not designed for any
 * other types
 */
store.updateContent = (
  contentType,
  id = null,
  key = undefined,
  payload = undefined,
  merge = true
) => {
  const [access, token] = contentType.token.split(':')
  let path
  if (token) {
    path = token.split('/')
  }
  return new Promise((resolve, reject) => {
    switch (access) {
      case 'collection': {
        reject({ message: 'Cannot change values on a collection data.' })
        break
      }

      case 'doc': {
        if (!id) {
          reject({ message: 'No id provided' })
        }
        firestore
          .collection(token)
          .doc(id)
          .set({ ..._.omit(payload, ['uid']) }, { merge: merge })
          .then(() => resolve())
        break
      }

      case 'field': {
        if (!id) {
          reject({ message: 'No id provided' })
        }
        const docRef = firestore.collection(path[0]).doc(id)
        docRef
          .get()
          .then(doc => {
            const data = doc.data()[path[1]]
            let newData
            if (payload) {
              newData = {
                ...data,
                [key]: { ...data[key], ...payload },
              }
            }
            docRef
              .set({ [path[1]]: newData }, { merge: merge })
              .then(() => resolve(newData))
              .catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
        break
      }

      case 'metaField': {
        const docRef = firestore.collection(path[0]).doc(path[1])
        docRef
          .get()
          .then(doc => {
            const data = doc.data()
            const field = data[path[2]]
            let newField
            const newData = !id
              ? {
                  [uuid()]: { ...payload },
                }
              : {
                  [id]: { ...payload },
                }
            newField = {
              ...field,
              ...newData,
            }
            docRef
              .set({ [path[2]]: { ...newField } }, { merge: true })
              .then(() => resolve(newField))
              .catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
        break
      }
      case 'defaults': {
        const docRef = firestore.collection(path[0]).doc(path[1])
        docRef
          .get()
          .then(doc => {
            const data = doc.data()
            const field = data
            const newField = {
              ...field,
              ...payload,
            }
            docRef
              .set({ ...newField }, { merge: true })
              .then(() => resolve(newField))
              .catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
        break
      }
    }
  })
}

const collectFiles = (contentType, id, key) => {
  return new Promise((resolve, reject) => {
    const [access, token] = contentType.token.split(':')
    let path, sub
    if (token) {
      path = token.split('/')
    } else {
      path = null
    }
    const fileFields = []
    for (var i = 0; i < contentType.fields.length; i++) {
      if (['image', 'file', 'avatar'].includes(contentType.fields[i].type)) {
        fileFields.push(contentType.fields[i].id)
      } else if (['content'].includes(contentType.fields[i].type)) {
        sub = collectFiles(contentType.fields[i].content, id, key)
      }
    }
    switch (access) {
      case 'collection': {
        reject({ message: 'Cannot Delete collections.' })
        break
      }

      case 'doc': {
        firestore
          .collection(path[0])
          .doc(id)
          .get()
          .then(doc => {
            const files = []
            const cData = doc.data()
            for (var i = 0; i < fileFields.length; i++) {
              if (cData[fileFields[i]]) {
                files.push(cData[fileFields[i]])
              }
            }
            if (sub) {
              sub.then(f => resolve([...f, ...files]))
            } else {
              resolve(files)
            }
          })
      }

      case 'field': {
        const docRef = firestore.collection(path[0]).doc(id)
        docRef
          .get()
          .then(doc => {
            const data = doc.data()[path[1]]
            const files = []
            Object.keys(data).map(k => {
              if (data[k]) {
                for (var i = 0; i < fileFields.length; i++) {
                  Object.keys(data[k]).map(l => {
                    if (fileFields.includes(l)) {
                      files.push(data[k][l])
                    }
                  })
                }
              }
            })
            resolve(files)
          })
          .catch(reason => reject(reason))
        break
      }
    }
  })
}
/**
 * Fucntion for removing elements from the database.
 *
 * @param {contentType} contentType type to be worked on from constants/comment.
 * @param {id} ID User/Main content ID that holds the values
 * @param {key} key id/index of the element to be removed.
 *
 * @return {Promise} Resolves to an emply object
 *
 * This function works well on arrays and objects. It is not designed for any
 * other types
 */
store.deleteContent = (contentType, id = null, key = null) => {
  const [access, token] = contentType.token.split(':')
  let path
  if (token) {
    path = token.split('/')
  }
  return new Promise((resolve, reject) => {
    switch (access) {
      case 'collection': {
        reject({ message: 'Cannot Delete collections.' })
        break
      }

      case 'doc': {
        collectFiles(contentType, id, key).then(files => {
          files.map(f => store.dropFile(f))
          firestore
            .collection(path[0])
            .doc(id)
            .delete()
            .then(() => resolve())
            .catch(reason => reject(reason))
        })
        break
      }

      case 'field': {
        if (!id) {
          reject({ message: 'No id provided' })
        }
        const docRef = firestore.collection(path[0]).doc(id)
        docRef
          .get()
          .then(doc => {
            const data = doc.data()[path[1]]
            let newData
            const tmp = { ...data }
            newData = {}
            for (var j in tmp) {
              if (j !== key) {
                newData[j] = tmp[j]
              }
            }
            docRef
              .set({ ...doc.data(), [path[1]]: newData })
              .then(() => resolve(newData))
              .catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
        break
      }

      case 'metaField': {
        const docRef = firestore.collection(path[0]).doc(path[1])
        docRef
          .get()
          .then(doc => {
            const data = doc.data()
            const field = data[path[2]]
            let newField
            const tmp = { ...field }
            newField = {}
            for (var j in tmp) {
              if (j !== key) {
                newField[j] = tmp[j]
              }
            }
            docRef
              .set({ [path[2]]: newField }, { merge: false })
              .then(() => resolve(newField))
              .catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
        break
      }
    }
  })
}

export default store
