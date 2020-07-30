import store from 'appStore';

import MainErrorBoundary from 'modules/app/components/main-error-boundary';
import { WindowApp } from 'modules/types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

console.log(`
  *******************************************
              DEBUGGING INFO
  *******************************************
  BUILD INFORMATION

    commit            -- ${process.env.CURRENT_COMMITHASH}
                      -- https://github.com/AugurProject/augur/commit/${process.env.CURRENT_COMMITHASH}
    network           -- ${process.env.ETHEREUM_NETWORK}
  -------------------------------------------
  ATTACHED PROPERTIES

    app element       -- window.app
    state data        -- window.state
  -------------------------------------------
  Configuration

  ${JSON.stringify(process.env.CONFIGURATION, null, 2)}
  *******************************************
`);

function render(Root) {
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter hashType="hashbang">
        <MainErrorBoundary>
          <Root />
        </MainErrorBoundary>
      </HashRouter>
    </Provider>,
    document.getElementById('app')
  );
}

handleRender();

function handleRender() {
  const UpdatedRoot = require('modules/app/containers/app').default;

  // NOTE --  These are attached for convenience when built for development or debug
  if (process.env.NODE_ENV === 'development') {
    (window as WindowApp).app = UpdatedRoot;
  }

  render(UpdatedRoot);
}
