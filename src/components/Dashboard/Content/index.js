import react, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import ContentEditor from './ContentEditor'
import ContentViewer from './ContentViewer'
import Loader from '../../Loaders/Loading'
import * as CONTENT from '../../../constants/contentTypes'
import { Scrollbars } from 'react-custom-scrollbars'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: '1',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  contentToolbar: {
    padding: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  contentBin: {
    flexGrow: '1',
  },
  editButton: {
    display: 'block',
  },
  saveButton: {
    marginLeft: '1rem',
  },
}))

const Content = () => {
  const [editMode, setEditMode] = useState(false)
  const [isEdited, setIsEdited] = useState(false)
  const [data, setData] = useState()
  const [cData, setCData] = useState()
  const [loading, setLoading] = useState(true)

  const [confirmDelete, setConfirmDelete] = useState(false)

  const router = useRouter()
  const { contentType, contentId } = router.query

  const classes = useStyles()

  useEffect(() => {
    let unsubscribe
    setLoading(true)
    setEditMode(false)
    setData()
    if (contentType && contentId && contentId !== 'create') {
      CONTENT[contentType].element.readSnap(setData, contentId).then(i => {
        unsubscribe = i
        setLoading(false)
      })
    } else if (contentType && contentId === 'create') {
      setLoading(false)
      setEditMode(true)
      setData(CONTENT[contentType].element.format.default())
    } else {
      setLoading(false)
      setData()
    }
    return unsubscribe
  }, [contentType, contentId])

  const saveData = () => {
    const xdata = {}
    const fields = CONTENT[contentType].fields
    if (!['create', 'default'].includes(contentId)) {
      for (var i = 0; i < fields.length; i++) {
        if (fields[i].editable) {
          xdata[fields[i].id] = cData[fields[i].id]
        } else {
          xdata[fields[i].id] = data[fields[i].id]
        }
      }
      CONTENT[contentType].element
        .update(contentId, null, xdata, false)
        .then(() => {
          setIsEdited(false)
          setEditMode(false)
        })
    } else if (['default'].includes(contentId)) {
      CONTENT[contentType].element
        .update(contentId, null, cData, true)
        .then(() => {
          setIsEdited(false)
          setEditMode(false)
          setData(cData)
        })
    } else {
      for (var i = 0; i < fields.length; i++) {
        if (fields[i].editable) {
          xdata[fields[i].id] = cData[fields[i].id]
        }
      }
      CONTENT[contentType].element.create(xdata).then(result => {
        setIsEdited(false)
        setData(cData)
        router.push(
          '/dashboard/[contentType]/[contentId]',
          `/dashboard/${contentType}/${result}`
        )
      })
    }
  }

  return loading ? (
    <div className={classes.root}>
      <Loader />
    </div>
  ) : data ? (
    <div className={classes.root}>
      <Paper square className={classes.contentToolbar}>
        <ButtonGroup>
          {CONTENT[contentType].extra.adminActions.includes('update') && (
            <Button
              className={classes.editButton}
              variant="outlined"
              onClick={() => {
                setEditMode(!editMode)
                setIsEdited(false)
                contentId === 'create' &&
                  router.push(
                    '/dashboard/[contentType]',
                    `/dashboard/${contentType}`
                  )
              }}
            >
              {editMode ? 'Exit' : 'Edit'}
            </Button>
          )}
          {CONTENT[contentType].extra.adminActions.includes('delete') &&
            contentId !== 'create' && (
              <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {'Are you sure you want to delete ' + contentType + '?'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    This action cannot be undone, the data will be permenantaly
                    deleted, are you sure you want to continue?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setConfirmDelete(false)
                      setEditMode(false)
                      setIsEdited(false)
                      CONTENT[contentType]
                        .delete(contentType, contentId)
                        .then(() => {
                          router.push(
                            '/dashboard/[contentType]',
                            `/dashboard/${contentType}`
                          )
                        })
                    }}
                    color="primary"
                    autoFocus
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          {CONTENT[contentType].extra.adminActions.includes('delete') &&
            contentId !== 'create' && (
              <Button
                className={classes.editButton}
                variant="outlined"
                onClick={() => {
                  setConfirmDelete(true)
                }}
              >
                Delete
              </Button>
            )}
          {isEdited && (
            <Button
              className={classes.saveButton}
              variant="contained"
              onClick={() => saveData(cData)}
            >
              {contentId === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </ButtonGroup>
      </Paper>

      <Scrollbars>
        <div className={classes.contentBin}>
          {editMode ? (
            <ContentEditor
              data={data}
              contentType={contentType}
              contentId={contentId}
              isEdited={setIsEdited}
              currentData={setCData}
            />
          ) : (
            <ContentViewer
              data={data}
              contentType={contentType}
              contentId={contentId}
            />
          )}
        </div>
      </Scrollbars>
    </div>
  ) : null
}

export default Content
