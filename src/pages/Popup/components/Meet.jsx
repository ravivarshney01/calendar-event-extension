import { Button, CardHeader, Typography } from '@material-ui/core'
import { Assignment, KeyboardBackspace } from '@material-ui/icons'
import moment from 'moment'
import React, { useEffect } from 'react'
import { goBack } from 'react-chrome-extension-router'
import '../styles/meet.css'

const Meet = ({ meet_link, dateTime }) => {
  useEffect(() => {
    navigator.clipboard.writeText(meet_link)
  }, [])
  return (
    <div className='meet'>
      <Typography color='textSecondary'>
        Scheduled the Meet with following link at{' '}
      </Typography>
      <Typography style={{ marginBottom: 4 }}>
        {moment(dateTime).format('HH:mm on DD/MM/yyyy')}
      </Typography>
      <CardHeader
        avatar={<Assignment />}
        title={meet_link}
        subheader='Copied to clipboard'
      />
      <Button variant='text' className='meet__back'>
        <KeyboardBackspace fontSize='large' onClick={goBack} /> Go Back and
        Schedule More
      </Button>
    </div>
  )
}

export default Meet
