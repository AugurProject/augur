import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { AppStatusProvider } from 'modules/app/store/app-status';
import MainErrorBoundary from 'modules/app/components/main-error-boundary';

import store from 'appStore';
import { WindowApp } from 'modules/types';
import { PendingOrdersProvider } from 'modules/app/store/pending-orders';

console.log(`
  *******************************************
              DEBUGGING INFO
  *******************************************
  BUILD INFORMATION

    branch            -- ${process.env.CURRENT_BRANCH}
    commit            -- ${process.env.CURRENT_COMMITHASH}
                      -- https://github.com/AugurProject/augur/commit/${process.env.CURRENT_COMMITHASH}
    network           -- ${process.env.ETHEREUM_NETWORK}
  -------------------------------------------
  ATTACHED PROPERTIES

    app element       -- window.app
    state data        -- window.state
  *******************************************
`);

function render(Root) {
  ReactDOM.render(
    <AppStatusProvider>
      <PendingOrdersProvider>
        <Provider store={store}>
          <HashRouter hashType="hashbang">
            <MainErrorBoundary>
              <Root />
            </MainErrorBoundary>
          </HashRouter>
        </Provider>
      </PendingOrdersProvider>
    </AppStatusProvider>,
    document.getElementById('app')
  );
}

handleRender();

function handleRender() {
  const UpdatedRoot = require('modules/app/components/app').default;

  // NOTE --  These are attached for convenience when built for development or debug
  if (process.env.NODE_ENV === 'development') {
    (window as WindowApp).app = UpdatedRoot;
  }

  render(UpdatedRoot);
}
