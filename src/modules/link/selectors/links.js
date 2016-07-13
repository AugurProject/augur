import memoizerific from 'memoizerific';
import { listWordsUnderLength } from '../../../utils/list-words-under-length';
import { makeLocation } from '../../../utils/parse-url';

import { PAGES_PATHS } from '../../link/constants/paths';
import { ACCOUNT, M, MARKETS, MAKE, POSITIONS, TRANSACTIONS } from '../../app/constants/pages';
import { LOGIN, REGISTER } from '../../auth/constants/auth-types';

import { SEARCH_PARAM_NAME, SORT_PARAM_NAME, PAGE_PARAM_NAME, TAGS_PARAM_NAME, FILTERS_PARAM_NAME } from '../../link/constants/param-names';
import { DEFAULT_SORT_PROP, DEFAULT_IS_SORT_DESC } from '../../markets/constants/sort';

import { updateURL } from '../../link/actions/update-url';
import { logout } from '../../auth/actions/logout';

import store from '../../../store';
// import * as selectors from '../../../selectors';

export default function () {
	const { keywords, selectedFilters, selectedSort, selectedTags, pagination, loginAccount } = store.getState();
	const { market } = require('../../../selectors');

	return {
		authLink: selectAuthLink(loginAccount.id ? LOGIN : REGISTER, !!loginAccount.id, store.dispatch),
		createMarketLink: selectCreateMarketLink(store.dispatch),
		marketsLink: selectMarketsLink(keywords, selectedFilters, selectedSort, selectedTags, pagination.selectedPageNum, store.dispatch),
		positionsLink: selectPositionsLink(store.dispatch),
		transactionsLink: selectTransactionsLink(store.dispatch),
		marketLink: selectMarketLink(market, store.dispatch),
		previousLink: selectPreviousLink(store.dispatch),
		accountLink: selectAccountLink(store.dispatch)
	};
}

export const selectAccountLink = memoizerific(1)((dispatch) => {
	const obj = {
		href: PAGES_PATHS[ACCOUNT],
		onClick: (href) => dispatch(updateURL(href))
	};
	return obj;
});

export const selectPreviousLink = memoizerific(1)((dispatch) => {
	const obj = {
		href: PAGES_PATHS[MARKETS],
		onClick: (href) => dispatch(updateURL(href))
	};
	return obj;
});

export const selectAuthLink = memoizerific(1)((authType, alsoLogout, dispatch) => {
	const href = PAGES_PATHS[authType];
	return {
		href,
		onClick: () => {
			if (!!alsoLogout) {
				dispatch(logout());
			}
			dispatch(updateURL(href));
		}
	};
});

export const selectMarketsLink = memoizerific(1)((keywords, selectedFilters, selectedSort, selectedTags, selectedPageNum, dispatch) => {
	const params = {};

	// search
	if (keywords != null && keywords.length > 0) {
		params[SEARCH_PARAM_NAME] = keywords;
	}

	// sort
	if (selectedSort.prop !== DEFAULT_SORT_PROP || selectedSort.isDesc !== DEFAULT_IS_SORT_DESC) {
		params[SORT_PARAM_NAME] = `${selectedSort.prop}|${selectedSort.isDesc}`;
	}

	// pagination
	if (selectedPageNum > 1) {
		params[PAGE_PARAM_NAME] = selectedPageNum;
	}

	// status and type filters
	const filtersParams = Object.keys(selectedFilters).filter(filter => !!selectedFilters[filter]).join(',');
	if (filtersParams.length) {
		params[FILTERS_PARAM_NAME] = filtersParams;
	}

	// tags
	const tagsParams = Object.keys(selectedTags).filter(tag => !!selectedTags[tag]).join(',');
	if (tagsParams.length) {
		params[TAGS_PARAM_NAME] = tagsParams;
	}

	const href = makeLocation([PAGES_PATHS[MARKETS]], params).url;

	return {
		href,
		onClick: () => dispatch(updateURL(href))
	};
});

export const selectMarketLink = memoizerific(1)((market, dispatch) => {
	const words = listWordsUnderLength(market.description, 300).map(word => encodeURIComponent(word)).join('_');
	const href = `${PAGES_PATHS[M]}/${words}_${market.id}`;
	const link = {
		href,
		onClick: () => dispatch(updateURL(href))
	};

	if (market.isReported) {
		link.text = 'Reported';
		link.className = 'reported';
	} else if (market.isMissedReport) {
		link.text = 'Missed Report';
		link.className = 'missed-report';
	} else if (market.isPendingReport) {
		link.text = 'Report';
		link.className = 'report';
	} else if (!market.isOpen) {
		link.text = 'View';
		link.className = 'view';
	} else {
		link.text = 'Trade';
		link.className = 'trade';
	}

	return link;
});

export const selectPositionsLink = memoizerific(1)((dispatch) => {
	const href = PAGES_PATHS[POSITIONS];
	return {
		href,
		onClick: () => dispatch(updateURL(href))
	};
});

export const selectTransactionsLink = memoizerific(1)((dispatch) => {
	const href = PAGES_PATHS[TRANSACTIONS];
	return {
		href,
		onClick: () => dispatch(updateURL(href))
	};
});

export const selectCreateMarketLink = memoizerific(1)((dispatch) => {
	const href = PAGES_PATHS[MAKE];
	return {
		href,
		onClick: () => dispatch(updateURL(href))
	};
});
