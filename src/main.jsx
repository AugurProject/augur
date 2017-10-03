import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { initAugur } from 'modules/app/actions/init-augur'

import { HashRouter } from 'react-router-dom'

import Routes from 'modules/routes/components/routes/routes'

import store from 'src/store'

import { augur } from 'services/augurjs'

require('newrelic')
require('core-js/fn/array/find')
require('core-js/fn/string/starts-with')

// NOTE --  These are attached for convenience when built for development or debug
if (process.env.NODE_ENV === 'development') {
  Object.defineProperty(window, 'state', { get: store.getState, enumerable: true })
  window.augur = augur

  console.log(`
  *******************************************
          DEVELOPMENT MODE (v3)
    window.state      -- raw state data
    window.selectors  -- processed state data
    window.augur      -- augur.js API methods
  -------------------------------------------
          ADDITIONAL INFORMATION
    augur.js version: ${augur.version}
  *******************************************
  `)
}

store.dispatch(initAugur())

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <HashRouter>
          <Routes />
        </HashRouter>
      </AppContainer>
    </Provider>,
    document.getElementById('app')
  )
}

handleRender()

if (module.hot) {
  module.hot.accept(
    [
      './selectors-raw',
      './modules/app/containers/app',
    ],
    () => {
      handleRender()
    }
  )
}

function handleRender() {
  const App = require('modules/app/containers/app').default

  // NOTE --  These are attached for convenience when built for development or debug
  if (process.env.NODE_ENV === 'development') {
    const selectors = require('src/selectors-raw')

    window.App = App
    window.selectors = selectors
  }

  render()
}
