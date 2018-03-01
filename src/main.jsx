import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { HashRouter } from 'react-router-dom'
// TODO: Investigate this import see CH issue:
// https://app.clubhouse.io/augur/story/5572/initaugur-import-issue
import { initAugur, connectAugur } from 'modules/app/actions/init-augur' // eslint-disable-line

import App from 'modules/app/containers/app'
import MainErrorBoundary from 'modules/common/components/main-error-boundary'

import store from 'src/store'

import { augur } from 'services/augurjs'
// require('core-js/fn/array/find')
// require('core-js/fn/string/starts-with')

// NOTE --  These are attached for convenience when built for development or debug
if (process.env.NODE_ENV === 'development') {
  Object.defineProperty(window, 'state', { get: store.getState, enumerable: true })
  window.augur = augur

  console.log(`
  *******************************************
        DEVELOPMENT MODE (seadragon)
    window.app        -- root app element
    window.state      -- raw state data
    window.selectors  -- processed state data
    window.augur      -- augur.js API methods
  -------------------------------------------
          ADDITIONAL INFORMATION
    augur.js version: ${augur.version}
  *******************************************
  `)
}

function render(Root) {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <HashRouter>
          <MainErrorBoundary>
            <Root />
          </MainErrorBoundary>
        </HashRouter>
      </AppContainer>
    </Provider>,
    document.getElementById('app'),
  )
}

handleRender(App)

if (module.hot) {
  module.hot.accept(
    [
      './selectors-raw',
      './modules/app/actions/init-augur',
      './modules/app/containers/app',
      './select-state',
    ],
    () => {
      handleRender()
    },
  )
}

function handleRender() {
  const UpdatedRoot = require('modules/app/containers/app').default

  // NOTE --  These are attached for convenience when built for development or debug
  if (process.env.NODE_ENV === 'development') {
    const selectors = require('src/selectors-raw')

    window.app = UpdatedRoot
    window.selectors = selectors
  }

  render(UpdatedRoot)
}
