import App from 'augur-ui-react-components';
import selectors from './selectors';

import * as AppActions from './modules/app/actions/app-actions';
import * as LinkActions from './modules/link/actions/link-actions';

import store from './store';
const appElement = document.getElementById('app');

if (process.env.NODE_ENV === 'development') {
    window.redux = store;
    window.selectors = require('./selectors');
    console.log('********************************************* \n DEVELOPMENT MODE \n window.selectors \n window.redux.getState() \n window.augurjs \n ********************************************* \n');
}

store.dispatch(LinkActions.showLink(window.location.pathname + window.location.search));
store.dispatch(AppActions.initAugur());

//store.dispatch(MarketsActions.listenToMarkets());

store.subscribe(() => {
    App(appElement, selectors)
});

window.onpopstate = function(e) {
	store.dispatch(LinkActions.showLink(window.location.pathname + window.location.search));
};
