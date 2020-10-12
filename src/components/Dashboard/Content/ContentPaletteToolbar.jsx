import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import CachedIcon from '@material-ui/icons/Cached'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

import * as CONTENT from '../../../constants/contentTypes'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0.5rem',
  },
  list: {
    padding: '0',
  },
  grow: {
    flexGrow: '1',
  },
}))

const ContentPaletteToolbar = props => {
  const router = useRouter()
  const { contentType, filter } = router.query
  const classes = useStyles()

  const { setUpdate, deleteSelected, selected } = props

  const [actions, setActions] = useState([])
  const [filters, setFilters] = useState({})

  useEffect(() => {
    if (contentType) {
      setActions(CONTENT[contentType].extra.adminActions)
      setFilters(CONTENT[contentType].extra.filters)
    } else {
      setActions([])
    }
  }, [contentType, filter])

  const getFilterValue = token => {
    const val = !filter ? filters[token].default : filter.split(':')[1]
    return val
  }

  return contentType ? (
    <Paper square className={classes.root}>
      {filters &&
        Object.keys(filters).length > 0 &&
        Object.keys(filters).map(f => {
          return (
            <Select
              id={`${filters[f].id}${filters[f].label}`}
              value={getFilterValue(f)}
              key={filters[f].id}
              onChange={e => {
                router.push(
                  {
                    pathname: '/dashboard/[contentType]',
                    query: { filter: `${filters[f].id}:${e.target.value}` },
                  },
                  {
                    pathname: `/dashboard/${contentType}`,
                    query: { filter: `${filters[f].id}:${e.target.value}` },
                  },

                  { shallow: true }
                )
              }}
            >
              {filters[f].options.map(el => (
                <MenuItem value={el} key={el}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          )
        })}
      <div className={classes.grow} />
      <ButtonGroup>
        {actions.includes('create') && (
          <Button
            variant="outlined"
            onClick={() => {
              router.push(
                '/dashboard/[contentType]/[contentId]',
                `/dashboard/${contentType}/create`
              )
            }}
          >
            Create
          </Button>
        )}
        {selected.length > 0 && (
          <Button
            startIcon={<HighlightOffIcon />}
            variant="outlined"
            onClick={() => deleteSelected()}
          >
            Delete Selected
          </Button>
        )}
        <Button
          startIcon={<CachedIcon />}
          variant="outlined"
          onClick={() => setUpdate(true)}
        >
          Refresh
        </Button>
      </ButtonGroup>
    </Paper>
  ) : null
}

export default ContentPaletteToolbar
