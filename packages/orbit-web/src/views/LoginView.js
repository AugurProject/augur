'use strict'

import React, { lazy } from 'react'
import { hot } from 'react-hot-loader'
import { useLocation, Redirect } from 'react-router-dom'
import { useObserver } from 'mobx-react'
import { useTranslation } from 'react-i18next'

import { version } from '../../package.json'

import Logger from '../utils/logger'

import RootContext from '../context/RootContext'

import '../styles/LoginView.scss'

const BackgroundAnimation = lazy(() =>
  import(/* webpackChunkName: "BackgroundAnimation" */ '../components/BackgroundAnimation')
)

const LoginForm = lazy(() => import(/* webpackChunkName: "LoginForm" */ '../components/LoginForm'))

const logger = new Logger()

function LoginView () {
  const location = useLocation()
  const { uiStore, sessionStore } = React.useContext(RootContext)
  const [t] = useTranslation()
  const [next, setNext] = React.useState('/')

  React.useEffect(() => {
    uiStore.setTitle('Login | Orbit')
    uiStore.closeControlPanel()
  }, [])

  React.useEffect(() => {
    const { from } = location.state || { from: { pathname: '/' } }
    setNext(from.pathname)
  }, [location.state])

  const usernameInputRef = React.useRef()

  const focusUsernameInput = React.useCallback(() => {
    if (usernameInputRef.current) usernameInputRef.current.focus()
  }, [])

  const handleSubmit = React.useCallback(event => {
    event.preventDefault()

    if (usernameInputRef.current) {
      const username = usernameInputRef.current.value.trim()
      if (username !== '') {
        sessionStore.login({ username }).catch(e => {
          logger.error(e)
        })
      }
    }
  }, [])

  return useObserver(() =>
    !sessionStore.isAuthenticated ? (
      <div className='LoginView'>
        <h1 className='loginHeaderAnimation' onClick={focusUsernameInput}>
          Orbit
        </h1>

        <LoginForm
          theme={{ ...uiStore.theme }}
          onSubmit={handleSubmit}
          usernameInputRef={usernameInputRef}
        />
        <div className='Version'>
          {t('version')}: {version}
        </div>
        <BackgroundAnimation size={480} theme={{ ...uiStore.theme }} onClick={focusUsernameInput} />
      </div>
    ) : (
      <Redirect to={next} />
    )
  )
}

export default hot(module)(LoginView)
