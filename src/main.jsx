import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies

import App from 'modules/app/components/app';
import { initAugur } from 'modules/app/actions/init-augur';
import { updateURL } from 'modules/link/actions/update-url';

import selectors from 'src/selectors';
import store from 'src/store';

import AugurJS from 'services/augurjs';

require('core-js/fn/array/find');
require('core-js/fn/string/starts-with');

if (process.env.NODE_ENV === 'development') {
	Object.defineProperty(window, 'state', { get: store.getState, enumerable: true });
	window.selectors = selectors;
	window.App = App;
	window.augurjs = AugurJS;
	console.log(`
*********************************************
			DEVELOPMENT MODE
	window.state		-- all state data
	window.selectors 	-- component data
	window.augurjs 		-- Augur API methods
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

store.subscribe(handleRender); // eslint-disable-line new-cap

window.onpopstate = (e) => {
	store.dispatch(updateURL(window.location.pathname + window.location.search));
};

if (module.hot) {
	module.hot.accept();

	module.hot.accept('./modules/app/components/app', () => {
		handleRender();
	});

	module.hot.accept('./selectors', () => {
		console.log('MAIN -- selectors hot accept');
	});

	module.hot.status((status) => {
		console.log('MAIN -- status: ', status);

		// if (status === 'idle') {
		// 	handleRender();
		// }
	});
}

function handleRender() {
	let currentSelectors;
	if (process.env.NODE_ENV === 'development') {
		currentSelectors = require('./selectors');
	} else {
		currentSelectors = selectors;
	}
	render(appElement, currentSelectors);
}
