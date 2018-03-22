import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { HashRouter } from 'react-router-dom'
// TODO: Investigate this import see CH issue:
// https://app.clubhouse.io/augur/story/5572/initaugur-import-issue
import { initAugur, connectAugur } from 'modules/app/actions/init-augur' // eslint-disable-line

import App from 'modules/app/containers/app'
import MainErrorBoundary from 'modules/common/components/main-error-boundary/main-error-boundary'

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
          DEVELOPMENT MODE
  *******************************************
          BUILD INFORMATION

    branch            -- ${process.env.CURRENT_BRANCH}
    network           -- ${process.env.ETHEREUM_NETWORK}
    augur.js          -- v${augur.version}
  -------------------------------------------
          ATTACHED PROPERTIES

    app element       -- window.app
    state data        -- window.state
    augur.js API      -- window.augur
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
    window.app = UpdatedRoot
  }

  render(UpdatedRoot)
}
