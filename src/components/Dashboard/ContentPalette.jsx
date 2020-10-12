import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'

import * as CONTENT from '../../constants/contentTypes'
import Loader from '../Loaders/Loading'
import Swatch from './Swatch'
import ContentPaletteToolbar from './Content/ContentPaletteToolbar'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${theme.palette.divider}`,
    padding: '0 0rem',
    minWidth: '300px',
    position: 'relative',
  },
  list: {
    padding: '0',
  },
}))

const ContentPalette = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()
  const [create, setCreate] = useState(false)
  const [update, setUpdate] = useState(true)
  const [selected, setSelected] = useState([])

  const router = useRouter()
  const { contentType, contentId, filter } = router.query
  const classes = useStyles()

  useEffect(() => {
    if (contentId === 'create') {
      setCreate(true)
    } else {
      setCreate(false)
    }
  }, [contentId])

  useEffect(() => {
    setLoading(true)
    let unsubscribe
    if (contentType && contentType !== 'defaults' && contentId !== 'create') {
      const currentContent = CONTENT[contentType]
      currentContent.read(null, filter).then(i => {
        setData(i.map(j => currentContent.format.contentListStruct(j)))
        setLoading(false)
      })
    } else {
      setData([])
      setLoading(false)
    }
    setUpdate(false)

    return unsubscribe
  }, [contentType, filter, update])

  const select = id => {
    const x = [...selected, id]
    setSelected(x)
  }

  const unselect = id => {
    let x = [...selected]
    const index = x.indexOf(id)
    if (index > -1) {
      x.splice(index, 1)
    }
    setSelected(x)
  }

  const deleteCascade = (id, end) => {
    const currentContent = CONTENT[contentType]
    currentContent.delete(contentType, selected[id]).then(() => {
      if (id < end) {
        deleteCascade(id + 1, end)
      } else {
        if (selected.includes(contentId)) {
          router.push('/dashboard/[contentType]', `/dashboard/${contentType}`)
        }
        setUpdate(true)
        setSelected([])
      }
    })
  }

  const deleteSelected = () => {
    deleteCascade(0, selected.length - 1)
  }

  return !create && contentType !== 'defaults' ? (
    <div className={classes.root}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <ContentPaletteToolbar
            setUpdate={setUpdate}
            deleteSelected={deleteSelected}
            selected={selected}
          />
          <List className={classes.list}>
            {data.map(i => (
              <Swatch {...i} key={i.uid} select={select} unselect={unselect} />
            ))}
          </List>
        </>
      )}
    </div>
  ) : null
}

export default ContentPalette
