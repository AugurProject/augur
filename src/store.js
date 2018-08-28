import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { helpers } from "src/helpers";

import thunk from "redux-thunk";

import { createReducer } from "src/reducers";
import { windowRef } from "src/utils/window-ref";

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
  if (windowRef.localStorage && windowRef.localStorage.setItem) {
    windowRef.localStorage.setItem(
      state.loginAccount.address,
      JSON.stringify({
        pendingLiquidityOrders: state.pendingLiquidityOrders,
        scalarMarketsShareDenomination: state.scalarMarketsShareDenomination,
        favorites: state.favorites,
        reports: state.reports,
        accountName: state.accountName,
        notifications: state.notifications
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
