import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

var windowRef = typeof window === 'undefined' ? {} : window,
	middleWare;

// console log middleware
const consoleLog = store => next => action => {
	if (typeof action !== 'function') {
		console.log(action);
	}
	return next(action);
};

// local storage middleware
const localStorageMiddleware = store => next => action => {
	var state;
	next(action);
	state = store.getState();

	if (!state || !state.loginAccount || !state.loginAccount.id) {
		return;
	}

	windowRef.localStorage && windowRef.localStorage.setItem && windowRef.localStorage.setItem(state.loginAccount.id, JSON.stringify({
		favorites: state.favorites,
		transactionsData: state.transactionsData,
		accountTrades: state.accountTrades
	}));
};

// middleware
if (process.env.NODE_ENV !== 'production') {
	middleWare = applyMiddleware(consoleLog, thunk, localStorageMiddleware);
}
else {
	middleWare = applyMiddleware(thunk, localStorageMiddleware);
}

let localStorageState = windowRef.localStorage && windowRef.localStorage.getItem && JSON.parse(windowRef.localStorage.getItem('state'));
if (localStorageState && localStorageState.transactions) {
	Object.keys(localStorageState.transactions).forEach(key => {
		if ([SUCCESS, FAILED, PENDING, INTERRUPTED].indexOf(localStorageState.transactions[key].status) < 0) {
			localStorageState.transactions[key].status = INTERRUPTED;
		}
	});
}

let initialState = Object.assign({}, localStorageState);

export default createStore(
	combineReducers(reducers),
	initialState,
	middleWare);