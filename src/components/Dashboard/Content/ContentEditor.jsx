import React, { useState, useEffect } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import isEqual from 'lodash/isEqual'
import * as CONTENT from '../../../constants/contentTypes'
import ContentFieldEdit from './ContentFieldEdit'

const ContentEditor = props => {
  const { data, contentType, contentId, isEdited, currentData } = props

  const [cData, setCData] = useState({ ...data })

  useEffect(() => {
    setCData({ ...data })
  }, [data])

  const onChange = (id, value) => {
    setCData({ ...cData, [id]: value })
  }

  useEffect(() => {
    if (!isEqual(cData, data)) {
      isEdited(true)
    } else {
      isEdited(false)
    }
    currentData(cData)
  }, [cData])

  return (
    <Table>
      <TableBody>
        {CONTENT[contentType].fields.map(el => {
          const render = (
            <ContentFieldEdit
              mainContentType={contentType}
              contentType={contentType}
              uid={contentId}
              data={cData[el.id]}
              {...el}
              key={el.id}
              onChange={onChange}
              mainContentId={contentId}
            />
          )

          return render
        })}
      </TableBody>
    </Table>
  )
}

export default ContentEditor
