import memoizerific from 'memoizerific';
import { ListWordsUnderLength } from '../../../utils/list-words-under-length';
import { MakeLocation as makeUrl } from '../../../utils/parse-url';

import { PAGES_PATHS } from '../../link/constants/paths';
import { M, MARKETS, MAKE, POSITIONS, TRANSACTIONS } from '../../app/constants/pages';
import { LOGIN, REGISTER } from '../../auth/constants/auth-types';

import {
	SEARCH_PARAM_NAME,
	SORT_PARAM_NAME,
	PAGE_PARAM_NAME
} from '../../markets/constants/param-names';
import {
	DEFAULT_SORT_PROP,
	DEFAULT_IS_SORT_DESC
} from '../../markets/constants/sort';

import { showLink, showPreviousLink } from '../../link/actions/show-link';
import { logout } from '../../auth/actions/logout';

import store from '../../../store';
// import * as selectors from '../../../selectors';

export const selectPreviousLink = memoizerific(1)((dispatch) => {
	const obj = {
		href: PAGES_PATHS[MARKETS],
		onClick: (href) => dispatch(showPreviousLink(href))
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
			dispatch(showLink(href));
		}
	};
});

export const selectMarketsLink = memoizerific(1)(
	(keywords, selectedFilters, selectedSort, selectedPageNum, dispatch) => {
		const filtersParams = Object.keys(selectedFilters)
			.filter(filterName => selectedFilters[filterName])
			.reduce((activeFilters, filterName) => {
				activeFilters[filterName] = selectedFilters[filterName];
				return activeFilters;
			}, {});

		let sortParams;
		if (selectedSort.prop !== DEFAULT_SORT_PROP || selectedSort.isDesc !== DEFAULT_IS_SORT_DESC) {
			sortParams = {
				[SORT_PARAM_NAME]: `${selectedSort.prop}|${selectedSort.isDesc}`
			};
		}

		let searchParam;
		if (keywords !== null && keywords.length > 0) {
			searchParam = {
				[SEARCH_PARAM_NAME]: keywords
			};
		}

		let paginationParams;
		if (selectedPageNum > 1) {
			paginationParams = {
				[PAGE_PARAM_NAME]: selectedPageNum
			};
		}

		const params = Object.assign({}, filtersParams, sortParams, searchParam, paginationParams);

		const href = makeUrl([PAGES_PATHS[MARKETS]], params).url;

		return {
			href,
			onClick: () => dispatch(showLink(href))
		};
	});

export const selectMarketLink = memoizerific(1)((market, dispatch) => {
	const href = `${PAGES_PATHS[M]}/${new ListWordsUnderLength(
									market.description,
									300).map(word => encodeURIComponent(word))
										.join('_')
										.concat(`_${market.id}`)}`;
	const	link = {
		href,
		onClick: () => dispatch(showLink(href))
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
		onClick: () => dispatch(showLink(href))
	};
});

export const selectTransactionsLink = memoizerific(1)((dispatch) => {
	const href = PAGES_PATHS[TRANSACTIONS];
	return {
		href,
		onClick: () => dispatch(showLink(href))
	};
});

export const selectCreateMarketLink = memoizerific(1)((dispatch) => {
	const href = PAGES_PATHS[MAKE];
	return {
		href,
		onClick: () => dispatch(showLink(href))
	};
});

export default function () {
	const {
		keywords,
		selectedFilters,
		selectedSort,
		pagination,
		loginAccount } = store.getState();
	const	{ market } = require('../../../selectors');

	return {
		authLink: selectAuthLink(
								loginAccount.id ? LOGIN : REGISTER,
								!!loginAccount.id,
								store.dispatch),
		createMarketLink: selectCreateMarketLink(store.dispatch),
		marketsLink: selectMarketsLink(
									keywords,
									selectedFilters,
									selectedSort,
									pagination.selectedPageNum,
									store.dispatch),
		positionsLink: selectPositionsLink(store.dispatch),
		transactionsLink: selectTransactionsLink(store.dispatch),
		marketLink: selectMarketLink(market, store.dispatch),
		previousLink: selectPreviousLink(store.dispatch)
	};
}
