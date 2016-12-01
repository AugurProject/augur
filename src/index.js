require('core-js/fn/array/find');
require('core-js/fn/string/starts-with');

import App from './modules/app/components/app';
import selectors from './selectors';
import AugurJS from './services/augurjs';

import { initAugur } from './modules/app/actions/init-augur';
import { updateURL } from './modules/link/actions/update-url';

import store from './store';
const appElement = document.getElementById('app');

if (process.env.NODE_ENV === 'development') {
	Object.defineProperty(window, 'state', { get: store.getState, enumerable: true });
	window.selectors = selectors;
	window.App = App;
	window.augurjs = AugurJS;
	console.log(`*********************************************
 DEVELOPMENT MODE
 window.selectors
 window.state
 window.augurjs
 *********************************************
`);
}

store.dispatch(updateURL(window.location.pathname + window.location.search));
store.dispatch(initAugur());

// store.dispatch(MarketsActions.listenToMarkets());

store.subscribe(() => App(appElement, selectors)); // eslint-disable-line new-cap

window.onpopstate = (e) => {
	store.dispatch(updateURL(window.location.pathname + window.location.search));
};
