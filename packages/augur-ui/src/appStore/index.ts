import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  Middleware,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';

import { createReducer, AppStateInterface } from 'reducers';
import { windowRef } from 'utils/window-ref';
import { processFavorites } from 'modules/markets/helpers/favorites-processor';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { WindowApp } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { AppStatus } from 'modules/app/store/app-status';
import { PendingOrders } from 'modules/app/store/pending-orders';

// console log middleware
const consoleLog = store => next => action => {
  if (!action) return;
  return next(action);
};

// local storage middleware
const localStorageMiddleware = store => next => action => {
  next(action);
};

let middleware;

if (process.env.NODE_ENV === 'production') {
  middleware = applyMiddleware(thunk, localStorageMiddleware as Middleware);
} else {
  const whenever = require('redux-whenever');
  middleware = compose(
    whenever,
    composeWithDevTools({})(
      applyMiddleware(consoleLog, thunk, localStorageMiddleware as Middleware)
    )
  );
}

const rootReducers = createReducer();
// middleware
const store = createStore(() => {}, middleware);

export type AppState = AppStateInterface;

// Keep a copy of the state on the window object for debugging.
if (process.env.NODE_ENV !== 'test') {
  Object.defineProperty(window, 'state', {
    get: store.getState,
    enumerable: true,
  });
}

if ((module as any).hot) {
  (module as any).hot.accept('./reducers', changed => {
    const nextReducers = require('reducers');
    store.replaceReducer(
      combineReducers({
        ...nextReducers.createReducer(),
      })
    );
  });

  Object.defineProperty(window, 'state', {
    get: store.getState,
    enumerable: true,
  });
}

export default store;
