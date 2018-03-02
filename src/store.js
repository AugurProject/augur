import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import thunk from 'redux-thunk'
// import history from 'src/history';
// import { routerReducer, routerMiddleware } from 'react-router-redux';

import { createReducer } from 'src/reducers'

const windowRef = typeof window === 'undefined' ? {} : window
// console log middleware
const consoleLog = store => next => (action) => {
  const isIgnoreFlag = action.meta != null && action.meta.ignore === true
  if (typeof action !== 'function' && !isIgnoreFlag) {
    // console.log(action);
  }
  return next(action)
}

// local storage middleware
const localStorageMiddleware = store => next => (action) => {
  next(action)
  const state = store.getState()
  if (!state || !state.loginAccount || !state.loginAccount.address) {
    return
  }
  if (windowRef.localStorage && windowRef.localStorage.setItem) {
    windowRef.localStorage.setItem(state.loginAccount.address, JSON.stringify({
      scalarMarketsShareDenomination: state.scalarMarketsShareDenomination,
      favorites: state.favorites,
      reports: state.reports,
      accountName: state.accountName,
    }))
  }
}

// const history = createHistory();
// const routingMiddleware = routerMiddleware(history);

let middleware
// if (process.env.NODE_ENV !== 'production') {
//   middleware = applyMiddleware(routingMiddleware, consoleLog, thunk, localStorageMiddleware);
// } else {
//   middleware = applyMiddleware(routingMiddleware, thunk, localStorageMiddleware);
// }
if (process.env.NODE_ENV !== 'production') {
  middleware = composeWithDevTools({})(applyMiddleware(consoleLog, thunk, localStorageMiddleware))
} else {
  middleware = applyMiddleware(thunk, localStorageMiddleware)
}
// middleware
const store = createStore(combineReducers({
  ...createReducer(),
}), middleware)

if (module.hot) {
  module.hot.accept('./reducers', (changed) => {
    const nextReducers = require('src/reducers')
    store.replaceReducer(combineReducers({
      ...nextReducers.createReducer(),
    }))
  })
}

export default store
