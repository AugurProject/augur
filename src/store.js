import {
	createStore,
	applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';

import { createReducer } from './reducers';

const windowRef = typeof window === 'undefined' ? {} : window;
// console log middleware
const consoleLog = store => next => (action) => {
	const isIgnoreFlag = action.meta != null && action.meta.ignore === true;
	if (typeof action !== 'function' && !isIgnoreFlag) {
		// console.log(action);
	}
	return next(action);
};

// local storage middleware
const localStorageMiddleware = store => next => (action) => {
	next(action);
	const state = store.getState();

	if (!state || !state.loginAccount || !state.loginAccount.address) {
		return;
	}

	if (windowRef.localStorage && windowRef.localStorage.setItem) {
		windowRef.localStorage.setItem(state.loginAccount.address, JSON.stringify({
			scalarMarketsShareDenomination: state.scalarMarketsShareDenomination,
			favorites: state.favorites,
			settings: state.settings,
			reports: state.reports,
			loginMessageVersionRead: state.loginMessage.userVersionRead
		}));
	}
};
let middleWare;
if (process.env.NODE_ENV !== 'production') {
	middleWare = applyMiddleware(consoleLog, thunk, localStorageMiddleware);
} else {
	middleWare = applyMiddleware(thunk, localStorageMiddleware);
}
// middleware
const store = createStore(createReducer(), middleWare);

if (module.hot) {
	module.hot.accept('./reducers', (changed) => {
		const hotReducer = require('./reducers').createReducer;
		store.replaceReducer(hotReducer());
	});
}

export default store;
