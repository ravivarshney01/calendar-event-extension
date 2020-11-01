import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import React, { useEffect, useState } from 'react'
import { Router } from 'react-chrome-extension-router'
import ReactDOM from 'react-dom'
import Header from './components/Header'
import Home from './components/Home'
import './index.css'

const App = () => {
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState('')
  useEffect(() => {
    chrome.identity.getAuthToken({ interactive: true }, function (_token) {
      setToken(_token)
      chrome.identity.getProfileUserInfo((details) => {
        setEmail(details.email)
      })
    })
  }, [token])
  return (
    <div className='app'>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Header email={email} token={token} setToken={setToken} />
        <Router>
          <Home />
        </Router>
      </MuiPickersUtilsProvider>
    </div>
  )
}

const rootElement = document.getElementById('app-container')
ReactDOM.render(<App />, rootElement)
