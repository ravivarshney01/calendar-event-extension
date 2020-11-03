import { Avatar, CardHeader, Chip, Typography } from '@material-ui/core'
import React from 'react'
import logo from '../../../assets/img/logo.png'
import '../styles/header.css'

const Header = ({ token, email, setToken }) => {
  const handleChangeUser = () => {
    fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token).then(
      () => {
        chrome.identity.removeCachedAuthToken({ token: token }, () => {
          setToken(null)
        })
      }
    )
  }

  return (
    <div className='header'>
      <div className='header__user'>
        {token && (
          <CardHeader
            avatar={<Avatar>{email[0]}</Avatar>}
            title={email.length < 15 ? email : email.substring(0, 15) + '...'}
            subheader={
              <Chip
                label='Switch Account'
                size='small'
                onClick={handleChangeUser}
              />
            }
          />
        )}
        {!token && (
          <Typography color='primary' className='header__signin'>
            Please Signin
          </Typography>
        )}
      </div>
      <img
        src={logo}
        className='header__logo'
        alt="logo"
      />
    </div>
  )
}

export default Header
