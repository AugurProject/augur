import memoizerific from 'memoizerific';
import { ListWordsUnderLength } from '../../../utils/list-words-under-length';
import { MakeLocation } from "../../../utils/parse-url";

import { AUTH_PATHS, PAGES_PATHS } from '../../link/constants/paths';
import { M, MARKETS, MAKE, POSITIONS, TRANSACTIONS } from '../../app/constants/pages';
import { LOGIN, REGISTER } from '../../auth/constants/auth-types';

import { SEARCH_PARAM_NAME, SORT_PARAM_NAME, PAGE_PARAM_NAME, TAGS_PARAM_NAME, FILTERS_PARAM_NAME } from '../../link/constants/param-names';
import { DEFAULT_SORT_PROP, DEFAULT_IS_SORT_DESC } from '../../markets/constants/sort';

import { showLink, showPreviousLink } from '../../link/actions/show-link';
import { logout } from '../../auth/actions/logout';

import store from '../../../store';

export default function() {
	var { keywords, selectedFilters, selectedSort, selectedTags, pagination, loginAccount } = store.getState(),
		{ market } = require('../../../selectors');

	return {
		authLink: selectAuthLink(loginAccount.id ? LOGIN : REGISTER, !!loginAccount.id, store.dispatch),
		createMarketLink: selectCreateMarketLink(store.dispatch),
		marketsLink: selectMarketsLink(keywords, selectedFilters, selectedSort, selectedTags, pagination.selectedPageNum, store.dispatch),
		positionsLink: selectPositionsLink(store.dispatch),
		transactionsLink: selectTransactionsLink(store.dispatch),
		marketLink: selectMarketLink(market, store.dispatch),
		previousLink: selectPreviousLink(store.dispatch)
	};
}

export const selectPreviousLink = memoizerific(1)(function(dispatch) {
	return {
		href: PAGES_PATHS[MARKETS],
		onClick: (href) => dispatch(showPreviousLink(href))
	};
});

export const selectAuthLink = memoizerific(1)(function(authType, alsoLogout, dispatch) {
	var href = PAGES_PATHS[authType];
	return {
		href,
		onClick: () => { !!alsoLogout && dispatch(logout()); dispatch(showLink(href)); }
	};
});

export const selectMarketsLink = memoizerific(1)(function(keywords, selectedFilters, selectedSort, selectedTags, selectedPageNum, dispatch) {
	let params = {};

	// search
	if (keywords != null && keywords.length > 0) {
		params[SEARCH_PARAM_NAME] = keywords;
	}

	// sort
	if (selectedSort.prop != DEFAULT_SORT_PROP || selectedSort.isDesc != DEFAULT_IS_SORT_DESC) {
		params[SORT_PARAM_NAME] = `${selectedSort.prop}|${selectedSort.isDesc}`;
	}


	// pagination
	if (selectedPageNum > 1) {
		params[PAGE_PARAM_NAME] = selectedPageNum;
	}

	// status and type filters
	let filtersParams = Object.keys(selectedFilters).filter(filter => !!selectedFilters[filter]).join(',');
	if (filtersParams.length) {
		params[FILTERS_PARAM_NAME] = filtersParams;
	}

	// tags
	let tagsParams = Object.keys(selectedTags).filter(tag => !!selectedTags[tag]).join(',');
	if (tagsParams.length) {
		params[TAGS_PARAM_NAME] = tagsParams;
	}

	let href = MakeLocation([PAGES_PATHS[MARKETS]], params).url;

	return {
		href,
		onClick: () => dispatch(showLink(href))
	};
});

export const selectMarketLink = memoizerific(1)(function(market, dispatch) {
	var href = PAGES_PATHS[M] + '/' + ListWordsUnderLength(market.description, 300).map(word => encodeURIComponent(word)).join('_') + '_' + market.id,
		link = {
			href,
			onClick: () => dispatch(showLink(href))
		};

	if (market.isReported) {
		link.text = 'Reported';
		link.className = 'reported';
	}
	else if (market.isMissedReport) {
		link.text = 'Missed Report';
		link.className = 'missed-report';
	}
	else if (market.isPendingReport) {
		link.text = 'Report';
		link.className = 'report';
	}
	else if (!market.isOpen) {
		link.text = 'View';
		link.className = 'view';
	}
	else {
		link.text = 'Trade';
		link.className = 'trade';
	}

	return link;
});

export const selectPositionsLink = memoizerific(1)(function(dispatch) {
	var href = PAGES_PATHS[POSITIONS];
	return {
		href,
		onClick: () => dispatch(showLink(href))
	};
});

export const selectTransactionsLink = memoizerific(1)(function(dispatch) {
	var href = PAGES_PATHS[TRANSACTIONS];
	return {
		href,
		onClick: () => dispatch(showLink(href))
	};
});

export const selectCreateMarketLink = memoizerific(1)(function(dispatch) {
	var href = PAGES_PATHS[MAKE];
	return {
		href,
		onClick: () => dispatch(showLink(href))
	};
});