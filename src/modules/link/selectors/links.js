import memoizerific from 'memoizerific';
import { ListWordsUnderLength } from '../../../utils/list-words-under-length';

import { AUTH_PATHS, PAGES_PATHS } from '../../link/constants/paths';
import { M, MARKETS, MAKE, POSITIONS, TRANSACTIONS } from '../../app/constants/pages';
import { LOGIN, LOGOUT } from '../../auth/constants/auth-types';

import * as LinkActions from '../../link/actions/link-actions';
import * as AuthActions from '../../auth/actions/auth-actions';

import store from '../../../store';

export default function() {
	var { loginAccountID, auth } = store.getState(),
		{ market } = require('../../../selectors');
	return {
		authLink: selectAuthLink(!loginAccountID ? LOGOUT : auth.selectedAuthType, store.dispatch),
		createMarketLink: selectCreateMarketLink(store.dispatch),
		marketsLink: selectMarketsLink(store.dispatch),
		positionsLink: selectPositionsLink(store.dispatch),
		transactionsLink: selectTransactionsLink(store.dispatch),
		marketLink: selectMarketLink(market, store.dispatch),
		previousLink: selectPreviousLink(store.dispatch),
	};
}

export const selectPreviousLink = memoizerific(1)(function(dispatch) {
    return {
		href: PAGES_PATHS[MARKETS],
		onClick: (href) => dispatch(LinkActions.showPreviousLink(href))
    };
});

export const selectAuthLink = memoizerific(1)(function(selectedAuthType, dispatch) {
	var href = selectedAuthType !== LOGOUT ? PAGES_PATHS[selectedAuthType] : PAGES_PATHS[LOGIN];
    return {
		href,
		onClick: selectedAuthType !== LOGOUT ?
					() => dispatch(LinkActions.showLink(href)) :
					() => { dispatch(AuthActions.logout()); dispatch(LinkActions.showLink(href)); }
    };
});

export const selectMarketsLink = memoizerific(1)(function(dispatch) {
	var href = PAGES_PATHS[MARKETS];
    return {
		href,
		onClick: () => dispatch(LinkActions.showLink(href))
    };
});

export const selectMarketLink = memoizerific(1)(function(market, dispatch) {
	var href = PAGES_PATHS[M] + '/' + ListWordsUnderLength(market.description, 300).map(word => encodeURIComponent(word)).join('_') + '_' + market.id;
    return {
		href,
		onClick: () => dispatch(LinkActions.showLink(href))
    };
});

export const selectPositionsLink = memoizerific(1)(function(dispatch) {
	var href = PAGES_PATHS[POSITIONS];
    return {
		href,
		onClick: () => dispatch(LinkActions.showLink(href))
    };
});

export const selectTransactionsLink = memoizerific(1)(function(dispatch) {
	var href = PAGES_PATHS[TRANSACTIONS];
    return {
		href,
		onClick: () => dispatch(LinkActions.showLink(href))
    };
});

export const selectCreateMarketLink = memoizerific(1)(function(dispatch) {
	var href = PAGES_PATHS[MAKE];
    return {
		href,
		onClick: () => dispatch(LinkActions.showLink(href))
    };
});