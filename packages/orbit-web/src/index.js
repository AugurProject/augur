'use strict'

import React from 'react'
import { render } from 'react-dom'

import { version } from '../package.json'

import redirectToHttps from './utils/https'

import { BigSpinner } from './components/Spinner'

import './styles/normalize.css'
import './styles/Fonts.scss'
import './styles/Main.scss'
import './styles/flaticon.css'

redirectToHttps(!window.location.href.match('localhost:'))

const App = React.lazy(() => import(/* webpackChunkName: "App" */ './views/App'))

render(
  <React.Suspense fallback={<BigSpinner />}>
    <App />
  </React.Suspense>,
  document.getElementById('root')
)

console.info(`Version ${version} running in ${process.env.NODE_ENV} mode`)
