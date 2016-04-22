import { SUCCESS, FAILED, PENDING, INTERRUPTED } from './modules/transactions/constants/statuses';
import { SEARCH_PARAM_NAME, SORT_PARAM_NAME, PAGE_PARAM_NAME } from './modules/markets/constants/param-names';
import { ParseURL as parseUrl } from "./utils/parse-url";

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
	var state = store.getState();
	next(action);
	windowRef.localStorage && windowRef.localStorage.setItem && windowRef.localStorage.setItem('state', JSON.stringify({
		favorites: state.favorites,
		transactions: state.transactions,
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

let urlState;
if (windowRef.location != null) {
	let urlParams = parseUrl(windowRef.location.href).searchParams;
	urlState = {};
	urlState.selectedFilters = {
		isOpen: urlParams['isOpen'] === "true",
		isExpired: urlParams['isExpired'] === "true",
		isPendingReport: urlParams['isPendingReport'] === "true",
		isMissedOrReported: urlParams['isMissedOrReported'] === "true",

		isBinary: urlParams['isBinary'] === "true",
		isCategorical: urlParams['isCategorical'] === "true",
		isScalar: urlParams['isScalar'] === "true"
	};

	if (urlParams[SEARCH_PARAM_NAME] != null && urlParams[SEARCH_PARAM_NAME] !== "") {
		urlState.keywords = urlParams[SEARCH_PARAM_NAME];
	}

	if (urlParams[SORT_PARAM_NAME] != null && urlParams[SORT_PARAM_NAME] !== "") {
		let sortSplit = urlParams[SORT_PARAM_NAME].split("|");
		urlState.selectedSort = {
			prop: sortSplit[0],
			isDesc: sortSplit[1] === "true"
		};
	}

	if (urlParams[PAGE_PARAM_NAME] != null && urlParams[PAGE_PARAM_NAME] !== "") {
		urlState.pagination = {
			selectedPageNum: parseInt(urlParams[PAGE_PARAM_NAME], 10)
		}
	}
}

let initialState = Object.assign({}, localStorageState, urlState);

export default createStore(
	combineReducers(reducers),
	initialState,
	middleWare);