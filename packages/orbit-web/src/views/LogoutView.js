'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import { Redirect } from 'react-router-dom'

import RootContext from '../context/RootContext'

function LogoutView () {
  const { sessionStore } = React.useContext(RootContext)

  React.useEffect(() => {
    sessionStore.logout()
  }, [])

  return <Redirect to='/' />
}

export default hot(module)(LogoutView)
