import { createStore, combineReducers } from 'redux'
import { createReducer } from '../reducers/reducers'
import thunk from 'redux-thunk'

const middleware = applyMiddleware(thunk)
const store = createStore(combineReducers({
  ...createReducer(),
}), middleware)

export default store
