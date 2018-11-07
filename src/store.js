import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { helpers } from "src/helpers/helpers";

import thunk from "redux-thunk";

import { createReducer } from "src/reducers";
import { windowRef } from "src/utils/window-ref";
import { augur } from "services/augurjs";
import { processFavorites } from "src/modules/markets/helpers/favorites-processor";

// console log middleware
const consoleLog = store => next => action => {
  if (!action) return;
  const isIgnoreFlag = action.meta != null && action.meta.ignore === true;
  if (typeof action !== "function" && !isIgnoreFlag) {
    // console.log(action);
  }
  return next(action);
};

// local storage middleware
const localStorageMiddleware = store => next => action => {
  next(action);
  const state = store.getState();
  if (!state || !state.loginAccount || !state.loginAccount.address) {
    return;
  }
  const { address } = state.loginAccount;
  const {
    pendingLiquidityOrders,
    scalarMarketsShareDenomination,
    favorites,
    reports,
    accountName,
    notifications,
    env,
    connection
  } = state;
  if (windowRef.localStorage && windowRef.localStorage.setItem) {
    const { localStorage } = windowRef;
    const { augurNodeNetworkId } = connection;
    const networkIdToUse = augurNodeNetworkId || augur.rpc.getNetworkID();
    const universeIdToUse =
      env.universe || augur.contracts.addresses[networkIdToUse].Universe;
    let storedAccountData = JSON.parse(localStorage.getItem(address));
    if (!storedAccountData || !storedAccountData.selectedUniverse) {
      storedAccountData = {
        selectedUniverse: { [networkIdToUse]: universeIdToUse }
      };
    }
    const processedFavorites = processFavorites(
      favorites,
      storedAccountData.favorites,
      networkIdToUse,
      universeIdToUse
    );
    localStorage.setItem(
      address,
      JSON.stringify({
        pendingLiquidityOrders,
        scalarMarketsShareDenomination,
        favorites: processedFavorites,
        reports,
        accountName,
        notifications,
        gasPriceInfo: {
          userDefinedGasPrice: state.gasPriceInfo.userDefinedGasPrice
        },
        selectedUniverse: {
          ...storedAccountData.selectedUniverse
        }
      })
    );
  }
};

let middleware;

if (process.env.NODE_ENV === "production") {
  middleware = applyMiddleware(thunk, localStorageMiddleware);
} else {
  const whenever = require("redux-whenever");
  middleware = compose(
    whenever,
    composeWithDevTools({})(
      applyMiddleware(consoleLog, thunk, localStorageMiddleware)
    )
  );
}

// middleware
const store = createStore(
  combineReducers({
    ...createReducer()
  }),
  middleware
);

// Keep a copy of the state on the window object for debugging.
if (process.env.NODE_ENV !== "test") {
  Object.defineProperty(window, "state", {
    get: store.getState,
    enumerable: true
  });
}

if (process.env.NODE_ENV === "development") {
  window.integrationHelpers = helpers(store);
}

if (module.hot) {
  module.hot.accept("./reducers", changed => {
    const nextReducers = require("src/reducers");
    store.replaceReducer(
      combineReducers({
        ...nextReducers.createReducer()
      })
    );
  });

  Object.defineProperty(window, "state", {
    get: store.getState,
    enumerable: true
  });
}

export default store;
