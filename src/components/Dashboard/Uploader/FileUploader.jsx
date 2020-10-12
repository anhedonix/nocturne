import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import { v4 as uuid } from 'uuid'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import CircularProgress from '../../Loaders/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'
import store from '../../../functions/store'

const useStyles = makeStyles(theme => ({
  input: {
    display: 'none',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    // color: 'green',
  },
  wrapper: {
    marginRight: '6px',
    position: 'relative',
  },
  delete: {
    color: 'red',
  },
}))

const FileUploader = props => {
  const {
    text = 'Upload',
    path,
    type,
    then,
    variant = 'contained',
    uid = undefined,
    drop = undefined,
    dropButton = false,
    dropThen = () => {},
    folder = undefined,
  } = props
  const classes = useStyles()
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const id = uid || uuid()
  return (
    <div className={props.className}>
      <input
        accept={type ? type : 'image/*'}
        className={classes.input}
        id={id}
        type="file"
        onChange={e => {
          if (e.target.files.length) {
            setRunning(true)
            store
              .uploadFile(e.target.files[0], path, setProgress, folder)
              .then(res => {
                if (drop) {
                  store.dropFile(drop)
                }
                then(res)
                setRunning(false)
              })
          }
        }}
      />
      <label htmlFor={id} className={classes.wrapper}>
        <Button
          variant={variant}
          color="primary"
          component="span"
          disabled={running}
          startIcon={
            running ? (
              <CircularProgress value={progress} size={24} />
            ) : (
              <CloudUploadIcon />
            )
          }
        >
          {text}
        </Button>
      </label>
      {dropButton && (
        <Tooltip title="Delete">
          <IconButton
            variant={variant}
            component="span"
            disabled={running}
            className={classes.delete}
            onClick={() => {
              store.dropFile(drop)
              dropThen()
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

export default FileUploader
