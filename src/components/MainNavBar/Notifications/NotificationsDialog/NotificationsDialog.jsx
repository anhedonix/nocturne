import Popover from '@material-ui/core/Popover'
import PropTypes from 'prop-types'
import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

import NotificationSection from '../NotificationSection/NotificationSection'

const NotificationsPopover = props => {
  const { personal, global } = props.data

  const calcHeight = () => {
    const p =
      personal && Object.keys(personal).length
        ? Object.keys(personal).length * 81 + 40
        : 0
    const g =
      global && Object.keys(global).length
        ? Object.keys(global).length * 81 + 40
        : 0
    return p + g
  }

  const pValues = []
  for (var key in personal) {
    pValues.push([key, personal[key]])
  }

  pValues.sort(function compare(v1, v2) {
    return (
      v2[1]['timestamp']['seconds'] * 1000000000 +
      v2[1]['timestamp']['nanoseconds'] -
      v1[1]['timestamp']['seconds'] * 1000000000 +
      v1[1]['timestamp']['nanoseconds']
    )
  })

  const gValues = []
  for (var key2 in global) {
    gValues.push([key2, global[key2]])
  }

  gValues.sort(function compare(v1, v2) {
    return v2[1]['timestamp']['seconds'] - v1[1]['timestamp']['seconds']
  })

  return (
    <Popover
      open={props.open}
      onClose={() => props.onClose()}
      anchorEl={props.anchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {props.open && (
        <Scrollbars
          style={{
            minWidth: '200px',
            width: '90vw',
            maxWidth: '580px',
            height: `${calcHeight()}px`,
            maxHeight: '80vh',
          }}
        >
          {personal && Object.keys(personal).length > 0 && (
            <NotificationSection title="Personal" data={pValues} dynamic />
          )}
          {global && Object.keys(global).length > 0 && (
            <NotificationSection
              title="Global"
              data={gValues}
              dynamic={false}
            />
          )}
        </Scrollbars>
      )}
    </Popover>
  )
}

NotificationsPopover.propTypes = {
  data: PropTypes.object,
  anchor: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
}

export default NotificationsPopover
