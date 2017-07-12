import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { initAugur } from 'modules/app/actions/init-augur';

import history from 'src/history';

import { ConnectedRouter } from 'react-router-redux';

import Routes from 'modules/app/components/routes';

import store from 'src/store';

import { augur } from 'services/augurjs';

// Reason for these being here?
require('core-js/fn/array/find');
require('core-js/fn/string/starts-with');

// NOTE --  These are attached for convenience when built for development or debug
if (process.env.NODE_ENV === 'development') {
  Object.defineProperty(window, 'state', { get: store.getState, enumerable: true });
  window.augur = augur;

  console.log(`
  *******************************************
             DEVELOPMENT MODE
    window.state      -- raw state data
    window.selectors  -- processed state data
    window.augur      -- augur.js API methods
  -------------------------------------------
          ADDITIONAL INFORMATION
    augur.js version: ${augur.version}
  *******************************************
  `);
}

// store.dispatch(updateURL(window.location.pathname + window.location.search));
//
// window.onpopstate = (e) => {
//   store.dispatch(updateURL(window.location.pathname + window.location.search));
// };

store.dispatch(initAugur());

function render(App) {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <ConnectedRouter history={history} >
          <Routes />
        </ConnectedRouter>
      </AppContainer>
    </Provider>,
    document.getElementById('app')
  );
}

handleRender();

if (module.hot) {
  module.hot.accept(
    [
      './selectors-raw',
      './modules/app/container',
    ],
    () => {
      handleRender();
    }
  );
}

function handleRender() {
  const App = require('modules/app/container').default;

  // NOTE --  These are attached for convenience when built for development or debug
  if (process.env.NODE_ENV === 'development') {
    const selectors = require('src/selectors-raw');

    window.App = App;
    window.selectors = selectors;
  }

  render();
}
