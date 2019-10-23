'use strict'

import React from 'react'
import { HashRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { useObserver } from 'mobx-react'

import i18n from '../config/i18n.config'

import RootStore from '../stores/RootStore'

import { addDebug } from '../utils/debug'
import { askPermission } from '../utils/notify'
import { usePrivateRoutes } from '../utils/hooks'

import RootContext from '../context/RootContext'

import { BigSpinner } from '../components/Spinner'

import '../styles/App.scss'
import '../styles/Scrollbars.scss'

const rootStore = new RootStore(i18n)

// Load settings
rootStore.settingsStore.load()

// Load a session (user) from cache
rootStore.sessionStore.loadFromCache()

addDebug({ rootStore })

askPermission()

const loginPath = '/connect'

const ControlPanel = React.lazy(() =>
  import(/* webpackChunkName: "ControlPanel" */ '../containers/ControlPanel')
)

const ChannelHeader = React.lazy(() =>
  import(/* webpackChunkName: "ChannelHeader" */ '../containers/ChannelHeader')
)

const ChannelView = React.lazy(() => import(/* webpackChunkName: "ChannelView" */ './ChannelView'))

const IndexView = React.lazy(() => import(/* webpackChunkName: "IndexView" */ './IndexView'))

const LoginView = React.lazy(() => import(/* webpackChunkName: "LoginView" */ './LoginView'))

const LogoutView = React.lazy(() => import(/* webpackChunkName: "LogoutView" */ './LogoutView'))

const SettingsView = React.lazy(() =>
  import(/* webpackChunkName: "SettingsView" */ './SettingsView')
)

const AlphaDisclaimer = React.lazy(() =>
  import(/* webpackChunkName: "AlphaDisclaimer" */ '../containers/AlphaDisclaimer')
)

function AppView ({ isAuthenticated }) {
  const location = useLocation()
  const redirectToLogin = usePrivateRoutes(['/', '/settings', '/channel/:channel'], isAuthenticated)

  return (
    <div className='App view'>
      <React.Suspense fallback={<BigSpinner />}>
        {/* Controlpanel */}
        <ControlPanel />

        <Switch>
          {/* Channel */}
          <Route exact path='/channel/:channel'>
            <ChannelView />
          </Route>

          {/* Settings */}
          <Route exact path='/settings'>
            <SettingsView />
          </Route>

          {/* Log out */}
          <Route exact path='/logout'>
            <LogoutView />
          </Route>

          {/* Log in */}
          <Route exact path={loginPath}>
            <LoginView />
          </Route>

          {/* Index */}
          <Route>
            <IndexView />
          </Route>
        </Switch>

        {redirectToLogin ? (
          <Redirect
            to={{
              pathname: loginPath,
              state: { from: location }
            }}
          />
        ) : null}
      </React.Suspense>
    </div>
  )
}

function App () {
  return (
    <RootContext.Provider value={rootStore}>
      <Router>
        {useObserver(() => (
          <AppView isAuthenticated={rootStore.sessionStore.isAuthenticated} />
        ))}
      </Router>
    </RootContext.Provider>
  )
}

export default App
