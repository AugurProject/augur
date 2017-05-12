import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies

import App from 'modules/app/components/app';
import { initAugur } from 'modules/app/actions/init-augur';
import { updateURL } from 'modules/link/actions/update-url';

import selectors from 'src/selectors';

import store from 'src/store';

import { augur } from 'services/augurjs';

require('core-js/fn/array/find');
require('core-js/fn/string/starts-with');

Object.defineProperty(window, 'state', { get: store.getState, enumerable: true });
window.selectors = selectors;
window.App = App;
window.augur = augur;
console.log(`
*******************************************
           DEVELOPMENT MODE
  window.state      -- all state data
  window.selectors  -- component data
  window.augur      -- Augur API methods
-------------------------------------------
  Augur.js Version: ${augur.version}
*******************************************
`);

store.dispatch(updateURL(window.location.pathname + window.location.search));
store.dispatch(initAugur());

const appElement = document.getElementById('app');

function render(appElement, selectors) {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <App {...selectors} />
      </AppContainer>
    </Provider>,
    appElement
  );
}
// store.dispatch(MarketsActions.listenToMarkets());

store.subscribe(handleRender);

window.onpopstate = (e) => {
  store.dispatch(updateURL(window.location.pathname + window.location.search));
};

if (module.hot) {
  module.hot.accept();

  module.hot.accept('./modules/app/components/app', () => {
    handleRender();
  });

  module.hot.accept('./modules/app/actions/init-augur');
  module.hot.accept('./modules/link/actions/update-url');
  module.hot.accept('./services/augurjs');
}

function handleRender() {
  let currentSelectors;
  if (process.env.NODE_ENV === 'development') {
    currentSelectors = require('./selectors');
  } else {
    currentSelectors = selectors;
  }
  render(appElement, currentSelectors);
}
