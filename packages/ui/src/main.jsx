import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

import MainErrorBoundary from "modules/common/components/main-error-boundary/main-error-boundary";

import store from "src/store";

import { augur } from "services/augurjs";

window.augur = augur;
console.log(`
  *******************************************
              DEBUGGING INFO
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
    document.getElementById("app")
  );
}

handleRender();

function handleRender() {
  const UpdatedRoot = require("modules/app/containers/app").default;

  // NOTE --  These are attached for convenience when built for development or debug
  if (process.env.NODE_ENV === "development") {
    window.app = UpdatedRoot;
  }

  render(UpdatedRoot);
}
