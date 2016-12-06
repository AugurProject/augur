require('core-js/fn/array/find');
require('core-js/fn/string/starts-with');

require('./splash.less');
require('./styles.less');

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from 'modules/app/components/app';

import selectors from './selectors';
import AugurJS from './services/augurjs';

import { initAugur } from 'modules/app/actions/init-augur';
import { updateURL } from 'modules/link/actions/update-url';

import store from './store';

if (process.env.NODE_ENV === 'development') {
	Object.defineProperty(window, 'state', { get: store.getState, enumerable: true });
	window.selectors = selectors;
	window.App = App;
	window.augurjs = AugurJS;
	console.log(`
		*********************************************
 			DEVELOPMENT MODE
 			window.selectors
 			window.state
 			window.augurjs
 		*********************************************
	`);
}

store.dispatch(updateURL(window.location.pathname + window.location.search));
store.dispatch(initAugur());

const appElement = document.getElementById('app');

function render(appElement, selectors) {
	ReactDOM.render(
		<AppContainer>
			<App {...selectors} />
		</AppContainer>,
		appElement
	);
}
// store.dispatch(MarketsActions.listenToMarkets());

store.subscribe(() => render(appElement, selectors)); // eslint-disable-line new-cap

window.onpopstate = (e) => {
	store.dispatch(updateURL(window.location.pathname + window.location.search));
};

if (module.hot) {
	module.hot.accept('modules/app/components/app', () => {
		render(appElement, selectors);
	});
}
