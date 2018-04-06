import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import thunk from 'redux-thunk'

import { createReducer } from 'src/reducers'

// console log middleware
const consoleLog = store => next => (action) => {
  const isIgnoreFlag = action.meta != null && action.meta.ignore === true
  if (typeof action !== 'function' && !isIgnoreFlag) {
    // console.log(action);
  }
  return next(action)
}

const windowRef = typeof window === 'undefined' ? {} : window

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

let middleware

if (process.env.NODE_ENV === 'production') {
  middleware = applyMiddleware(thunk, localStorageMiddleware)
} else {
  middleware = composeWithDevTools({})(applyMiddleware(consoleLog, thunk, localStorageMiddleware))
}

// middleware
const store = createStore(combineReducers({
  ...createReducer(),
}), middleware)

if (process.env.NODE_ENV === 'development') {
  Object.defineProperty(window, 'state', { get: store.getState, enumerable: true })
}

if (module.hot) {
  module.hot.accept('./reducers', (changed) => {
    const nextReducers = require('src/reducers')
    store.replaceReducer(combineReducers({
      ...nextReducers.createReducer(),
    }))
  })

  Object.defineProperty(window, 'state', { get: store.getState, enumerable: true })
}

export default store
