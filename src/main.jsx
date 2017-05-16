import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from 'modules/app/container';
import { initAugur } from 'modules/app/actions/init-augur';
import { updateURL } from 'modules/link/actions/update-url';

import * as selectors from 'src/select-state';
import store from 'src/store';
import { augur } from 'services/augurjs';

require('core-js/fn/array/find');
require('core-js/fn/string/starts-with');

// NOTE --  These are attached for convenience during beta test period only
//          and will ultimately be moved back to dev only upon production release.
Object.defineProperty(window, 'state', { get: store.getState, enumerable: true });
window.selectors = selectors;
window.App = App;
window.augur = augur;
console.log(`
*******************************************
           DEVELOPMENT MODE
  window.state      -- all state data
  window.selectors  -- processed state data
  window.augur      -- Augur API methods
-------------------------------------------
          DEPENDENCY VERSION
  augur.js: ${augur.version}
*******************************************
`);

window.onpopstate = (e) => {
  store.dispatch(updateURL(window.location.pathname + window.location.search));
};

store.dispatch(initAugur(() => {
  store.dispatch(updateURL(window.location.pathname + window.location.search));
}));

const appElement = document.getElementById('app');

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <App />
      </AppContainer>
    </Provider>,
    appElement
  );
}

store.subscribe(render);

if (module.hot) {
  module.hot.accept();
  module.hot.accept('./modules/app/actions/init-augur');
  module.hot.accept('./modules/link/actions/update-url');
  module.hot.accept('./services/augurjs');

  module.hot.accept('./modules/app/container', () => {
    render();
  });
}
