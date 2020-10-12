import React, { useState, useEffect } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import moment from 'moment'
import Avatar from '@material-ui/core/Avatar'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import { green, red } from '@material-ui/core/colors'

import { makeStyles } from '@material-ui/core/styles'
import * as CONTENT from '../../../constants/contentTypes'
import MainContext from '../../../states/mainState'
import store from '../../../functions/store'
import Switch from '@material-ui/core/Switch'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url('/BGs/DesignerBanner.png')`,
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  subField: {
    marginBottom: '1rem',
    borderLeft: '1px solid rgba(128,128,128,0.5)',
    borderTop: '1px solid rgba(128, 128, 128, 0.5)',
  },
  subFieldWrapper: {
    paddingRight: '0',
  },
  imageWrapper: {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center left',
    backgroundColor: 'black',
    display: 'block',
    minWidth: '200px',
    minHeight: '80px',
  },
}))

const ContentSubFieldSection = props => {
  const { contentType, data } = props
  const classes = useStyles()
  return (
    <>
      {data.map(i => (
        <Table className={classes.subField} size="small" key={i.uid}>
          <TableBody>
            {CONTENT[contentType].fields.map(el => {
              return <ContentFieldView data={i[el.id]} {...el} key={el.id} />
            })}
          </TableBody>
        </Table>
      ))}
    </>
  )
}

const ContentFieldView = props => {
  const { id, label, type, data } = props
  const [imagePath, setImagePath] = useState()

  const classes = useStyles()

  useEffect(() => {
    if (['image', 'avatar'].includes(type) && data) {
      store
        .getFileUrl(data)
        .then(url => setImagePath(url))
        .catch(err => console.log(err))
    } else {
      setImagePath(null)
    }
  }, [])

  return (
    <TableRow>
      <TableCell align="right">{label}</TableCell>
      <TableCell
        className={type === 'content' ? classes.subFieldWrapper : null}
        style={
          type === 'uid'
            ? {
                fontFamily: '"Lucida Console", Monaco, monospace',
              }
            : null
        }
      >
        {data !== undefined ? (
          ['string', 'int', 'uid', 'file'].includes(type) ? (
            data
          ) : type === 'stringList' ? (
            props.enableDefault ? (
              data === null ? (
                'DEFAULT'
              ) : (
                data
              )
            ) : (
              data
            )
          ) : type === 'metaList' ? (
            data.split(':')[1]
          ) : type === 'timestamp' ? (
            moment(data.toDate()).format('YYYY MM DD LT')
          ) : type === 'bool' ? (
            data ? (
              <CheckCircleIcon style={{ color: green[500] }} />
            ) : (
              <CancelIcon style={{ color: red[500] }} />
            )
          ) : type === 'avatar' ? (
            <Avatar alt={`${type}`} src={imagePath} />
          ) : type === 'image' ? (
            <>
              <div
                className={classes.imageWrapper}
                style={{ backgroundImage: `url('${imagePath}')` }}
              ></div>
              {data}
            </>
          ) : type === 'content' ? (
            <ContentSubFieldSection
              data={props.format(data)}
              contentType={props.content.ID}
            />
          ) : null
        ) : null}
      </TableCell>
    </TableRow>
  )
}

export default ContentFieldView
