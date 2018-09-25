import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createReducer } from './reducers/reducers'
import thunk from 'redux-thunk'

const middleware = applyMiddleware(thunk)
const store = createStore(combineReducers({
  ...createReducer(),
}), middleware)

Object.defineProperty(window, 'state', { get: store.getState, enumerable: true })

export default store
