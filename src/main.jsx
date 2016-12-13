import React from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable import/no-extraneous-dependencies */
import { AppContainer } from 'react-hot-loader'; // Excluded from linting due to being dev only
/* eslint-disable import/no-extraneous-dependencies */

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
	window.state		-- all data state
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

store.subscribe(() => render(appElement, selectors)); // eslint-disable-line new-cap

window.onpopstate = (e) => {
	store.dispatch(updateURL(window.location.pathname + window.location.search));
};

if (module.hot) {
	module.hot.accept('modules/app/components/app', () => {
		render(appElement, selectors);
	});
}
