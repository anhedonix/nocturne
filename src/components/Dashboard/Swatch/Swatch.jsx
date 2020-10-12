import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles } from '@material-ui/core/styles'
import * as CONTENT from '../../../constants/contentTypes'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url('/BGs/DesignerBanner.png')`,
    backgroundSize: 'cover',
    display: 'flex',
    padding: '0',
  },
  swatchItem: {
    padding: '0.5rem 1rem',
  },
  checkbox: {
    marginLeft: '1rem',
  },
  metaWrapper: {
    marginLeft: '1rem',
  },
}))

const Swatch = props => {
  const router = useRouter()
  const { contentType, contentId } = router.query
  const classes = useStyles()

  const { select, unselect } = props
  return (
    <>
      <ListItem
        className={classes.root}
        button
        selected={contentId === props.uid}
      >
        {CONTENT[contentType].extra.adminActions.includes('delete') && (
          <Checkbox
            color="primary"
            className={classes.checkbox}
            onChange={e => {
              if (e.target.checked) {
                select(props.uid)
              } else {
                unselect(props.uid)
              }
            }}
          />
        )}
        <Link
          href="/dashboard/[contentType]/[contentId]"
          as={`/dashboard/${contentType}/${props.uid}`}
        >
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="stretch"
            className={classes.swatchItem}
          >
            <Grid item>
              <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="stretch"
              >
                <Grid item>
                  <Typography variant="h5">{props.header}</Typography>
                </Grid>
                <Grid item>{props.detail}</Grid>
              </Grid>
            </Grid>
            {props.meta1 || props.meta2 ? (
              <Grid item>
                <Grid
                  container
                  direction="column"
                  justify="space-between"
                  alignItems="stretch"
                  className={classes.metaWrapper}
                >
                  <Grid item>{props.meta1}&nbsp;</Grid>
                  <Grid item>{props.meta2}</Grid>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Link>
      </ListItem>
      <Divider />
    </>
  )
}

export default Swatch
