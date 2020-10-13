import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AdminContentTypes from '../../constants/admin'
import Link from 'next/link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import DashboardIcon from '@material-ui/icons/Dashboard'
import { useRouter } from 'next/router'
import { Scrollbars } from 'react-custom-scrollbars'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${theme.palette.divider}`,
    padding: '0',
    width: '15vw',
    maxWidth: '260px',
  },
  item: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
}))

const MenuItem = props => {
  const classes = useStyles()
  const router = useRouter()
  const { contentType } = router.query
  return (
    <Link href={`/dashboard/[contentType]`} as={`/dashboard/${props.ID}`}>
      <ListItem
        button
        selected={contentType === props.ID}
        className={classes.item}
      >
        <ListItemIcon>{props.extra.icon}</ListItemIcon>
        <ListItemText primary={props.label} />
      </ListItem>
    </Link>
  )
}

const ContentMenu = () => {
  const classes = useStyles()
  const router = useRouter()
  const { contentType } = router.query
  return (
    <List className={classes.root}>
      <Link href={`/dashboard`} as={`/dashboard`}>
        <ListItem
          button
          className={classes.item}
          selected={contentType === undefined}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </Link>
      <Divider />

      <Scrollbars>
        {AdminContentTypes.map(el => (
          <MenuItem {...el} key={el.ID} />
        ))}
      </Scrollbars>
    </List>
  )
}

export default ContentMenu
