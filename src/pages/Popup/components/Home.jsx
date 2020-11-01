import { Button, Snackbar, TextField } from '@material-ui/core'
import { KeyboardDateTimePicker } from '@material-ui/pickers'
import ChipInput from 'material-ui-chip-input'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { goTo } from 'react-chrome-extension-router'
import '../styles/home.css'
import Meet from './Meet'

const Home = () => {
  const [dateTime, setDateTime] = useState(new Date())
  const [duration, setDuration] = useState(30)
  const [guests, setGuests] = useState([])
  const [error, setError] = useState(false)
  useEffect(() => {
    console.log(dateTime)
  }, [dateTime])

  const handleAddChip = (guest) => {
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (guest.match(mailformat)) {
      setGuests([...guests, guest])
    }
  }
  const handleDeleteChip = (guest, index) => {
    setGuests(guests.filter((g) => g !== guest))
  }

  const createEvent = () => {
    if (moment(dateTime).isValid() && duration) {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        var event = {
          summary: '',
          start: {
            dateTime: dateTime.toISOString(),
            timeZone: 'Asia/Kolkata',
          },
          end: {
            dateTime: moment(dateTime)
              .add(duration, 'minutes')
              .toISOString(),
            timeZone: 'Asia/Kolkata',
          },
          attendees: [
            ...guests.map((guest) => {
              return {
                email: guest,
              }
            }),
          ],
          conferenceData: {
            createRequest: {
              requestId: Math.random()
                .toString(36)
                .substring(10),
            },
          },
        }
        fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendNotifications=true',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
          }
        )
          .then((response) => response.json())
          .then(function (data) {
            goTo(Meet, { meet_link: data.hangoutLink, dateTime })
          })
      })
    } else {
      setError(true)
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setError(false)
  }
  return (
    <div className='home'>
      <div className='home__form'>
        <KeyboardDateTimePicker
          variant='inline'
          ampm={false}
          label='Date-Time'
          className='home__formDateTime'
          value={dateTime}
          onChange={setDateTime}
          onError={console.log}
          disablePast
          format='DD/MM/yyyy HH:mm'
        />
        <TextField
          label='Duration in Min'
          type='number'
          className='home__formDuration'
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <ChipInput
        label='Guests (Optional)'
        value={guests}
        className='home__guests'
        onAdd={(chip) => handleAddChip(chip)}
        onDelete={(chip, index) => handleDeleteChip(chip, index)}
        inputMode='email'
        typeof='email'
        placeholder='guest@gmail.com'
      />
      <Button
        className='home__button'
        onClick={createEvent}
        variant='contained'
        color='primary'
      >
        Create Event
      </Button>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
        message='*Date-Time and durations are required.'
      />
    </div>
  )
}

export default Home
