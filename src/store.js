import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

var middleWare;

// console log middleware
const consoleLog = store => next => action => {
	if (typeof action !== 'function') {
		console.log(action);
	}
	return next(action);
};

// local storage middleware
const localStorageMiddleware = store => next => action => {
	var state = store.getState();
	next(action);
	window && window.localStorage && window.localStorage.setItem('state', JSON.stringify({
		favorites: state.favorites
	}));
};

// middleware
if (process.env.NODE_ENV !== 'production') {
	middleWare = applyMiddleware(consoleLog, thunk, localStorageMiddleware);
}
else {
	middleWare = applyMiddleware(thunk, localStorageMiddleware);
}

export default createStore(
	combineReducers(reducers),
	window && window.localStorage && JSON.parse(window.localStorage.getItem('state')) || {},
	middleWare);