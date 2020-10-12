import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'

import * as CONTENT from '../../../constants/contentTypes'
import ContentFieldView from './ContentFieldView'

const ContentViewer = props => {
  const { data, contentType } = props

  return (
    <Table>
      <TableBody>
        {CONTENT[contentType].fields.map(el => {
          const Render = (
            <ContentFieldView data={data[el.id]} {...el} key={el.id} />
          )
          return Render
        })}
      </TableBody>
    </Table>
  )
}

export default ContentViewer
