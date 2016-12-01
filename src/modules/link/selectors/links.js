import memoizerific from 'memoizerific';
import { listWordsUnderLength } from '../../../utils/list-words-under-length';
import { makeLocation } from '../../../utils/parse-url';
import { loginWithAirbitz } from '../../auth/actions/login-with-airbitz';

import { ACCOUNT, M, MARKETS, MAKE, MY_POSITIONS, MY_MARKETS, MY_REPORTS, TRANSACTIONS, LOGIN_MESSAGE, REGISTER, LOGIN, IMPORT } from '../../app/constants/views';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import { SEARCH_PARAM_NAME, FILTER_SORT_TYPE_PARAM_NAME, FILTER_SORT_SORT_PARAM_NAME, FILTER_SORT_ISDESC_PARAM_NAME, PAGE_PARAM_NAME, TAGS_PARAM_NAME } from '../../link/constants/param-names';
import { FILTER_SORT_TYPE, FILTER_SORT_SORT, FILTER_SORT_ISDESC } from '../../markets/constants/filter-sort';

import { updateURL } from '../../link/actions/update-url';
import { logout } from '../../auth/actions/logout';

import { loadFullLoginAccountMarkets } from '../../portfolio/actions/load-full-login-account-markets';
import { loadEventsWithSubmittedReport } from '../../my-reports/actions/load-events-with-submitted-report';
import updateUserLoginMessageVersionRead from '../../login-message/actions/update-user-login-message-version-read';

import store from '../../../store';

export default function () {
	const { keywords, selectedFilterSort, selectedTags, pagination, loginAccount, auth, loginMessage } = store.getState();
	const { market } = require('../../../selectors');
	return {
		authLink: selectAuthLink(auth.selectedAuthType, !!loginAccount.id, store.dispatch),
		createMarketLink: selectCreateMarketLink(store.dispatch),
		marketsLink: selectMarketsLink(keywords, selectedFilterSort, selectedTags, pagination.selectedPageNum, null, store.dispatch),
		favoritesLink: selectMarketsLink(keywords, selectedFilterSort, selectedTags, pagination.selectedPageNum, FAVORITES, store.dispatch),
		pendingReportsLink: selectMarketsLink(keywords, selectedFilterSort, selectedTags, pagination.selectedPageNum, PENDING_REPORTS, store.dispatch),
		transactionsLink: selectTransactionsLink(store.dispatch),
		marketLink: selectMarketLink(market, store.dispatch),
		previousLink: selectPreviousLink(store.dispatch),
		accountLink: selectAccountLink(store.dispatch),
		myPositionsLink: selectMyPositionsLink(store.dispatch),
		myMarketsLink: selectMyMarketsLink(store.dispatch),
		myReportsLink: selectMyReportsLink(store.dispatch),
		loginMessageLink: selectLoginMessageLink(loginAccount.id, loginMessage.version, store.dispatch)
	};

	// NOTE -- pagination links are a special case.  Reference the pagination selector for how those work.
}

export const selectAccountLink = memoizerific(1)((dispatch) => {
	const obj = {
		href: makeLocation({ page: ACCOUNT }).url,
		onClick: (href) => dispatch(updateURL(href))
	};
	return obj;
});

export const selectPreviousLink = memoizerific(1)((dispatch) => {
	const obj = {
		href: makeLocation({ page: MARKETS }).url,
		onClick: (href) => dispatch(updateURL(href))
	};
	return obj;
});

export const selectAuthLink = memoizerific(1)((authType, alsoLogout, dispatch) => {
	const determineLocation = () => {
		if (alsoLogout) {
			return makeLocation({ page: LOGIN }).url;
		}

		switch (authType) {
			case IMPORT:
				return makeLocation({ page: IMPORT }).url;
			case LOGIN:
				return makeLocation({ page: LOGIN }).url;
			case REGISTER:
			default:
				return makeLocation({ page: REGISTER }).url;
		}
	};

	const href = determineLocation();

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

export const selectAirbitzLink = memoizerific(1)((authType, dispatch) => ({
	onClick: () => {
		require('../../../selectors').abc.openLoginWindow((result, airbitzAccount) => {
			if (airbitzAccount) {
				dispatch(loginWithAirbitz(airbitzAccount));
			} else {
				console.log('error registering in: ' + result);
			}
		});
	}
}));

export const selectAirbitzOnLoad = memoizerific(1)((dispatch) => ({
	onLoad: () => {
		const abcContext = require('../../../selectors').abc.abcContext;
		const usernames = abcContext.listUsernames();
		if (usernames.length > 0) {
			require('../../../selectors').abc.openLoginWindow((result, airbitzAccount) => {
				if (airbitzAccount) {
					dispatch(loginWithAirbitz(airbitzAccount));
				} else {
					console.log('error registering in: ' + result);
				}
			});
		}
	}
}));

export const selectMarketsLink = memoizerific(1)((keywords, selectedFilterSort, selectedTags, selectedPageNum, subSet, dispatch) => {
	const params = {};

	// search
	if (keywords != null && keywords.length > 0) {
		params[SEARCH_PARAM_NAME] = keywords;
	}

	// filter + sort
	if (selectedFilterSort.type !== FILTER_SORT_TYPE) {
		params[FILTER_SORT_TYPE_PARAM_NAME] = `${selectedFilterSort.type}`;
	}
	if (selectedFilterSort.sort !== FILTER_SORT_SORT) {
		params[FILTER_SORT_SORT_PARAM_NAME] = `${selectedFilterSort.sort}`;
	}
	if (selectedFilterSort.isDesc !== FILTER_SORT_ISDESC) {
		params[FILTER_SORT_ISDESC_PARAM_NAME] = `${selectedFilterSort.isDesc}`;
	}

	// pagination
	if (selectedPageNum > 1) {
		params[PAGE_PARAM_NAME] = selectedPageNum;
	}

	// tags
	const tagsParams = Object.keys(selectedTags).filter(tag => !!selectedTags[tag]).join(',');
	if (tagsParams.length) {
		params[TAGS_PARAM_NAME] = tagsParams;
	}

	const href = makeLocation(params).url;

	return {
		href,
		onClick: () => {
			const { marketsHeader } = require('../../../selectors');

			switch (subSet) {
				case (FAVORITES):
					dispatch(marketsHeader.onClickFavorites);
					break;
				case (PENDING_REPORTS):
					dispatch(marketsHeader.onClickPendingReports);
					break;
				default:
					dispatch(marketsHeader.onClickAllMarkets);
			}

			dispatch(updateURL(href));
		}
	};
});

export const selectMarketLink = memoizerific(1)((market, dispatch) => {
	const words = listWordsUnderLength(market.description, 300).map(word => encodeURIComponent(word)).join('_') + '_' + market.id;
	const href = makeLocation({ page: M, m: words }).url;
	const link = {
		href,
		onClick: () => {
			dispatch(updateURL(href));
		}
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

export const selectTransactionsLink = memoizerific(1)((dispatch) => {
	const href = makeLocation({ page: TRANSACTIONS }).url;
	return {
		href,
		onClick: () => dispatch(updateURL(href))
	};
});

export const selectCreateMarketLink = memoizerific(1)((dispatch) => {
	const href = makeLocation({ page: MAKE }).url;
	return {
		href,
		onClick: () => dispatch(updateURL(href))
	};
});

export const selectMyPositionsLink = memoizerific(1)((dispatch) => {
	const href = makeLocation({ page: MY_POSITIONS }).url;
	return {
		href,
		onClick: () => dispatch(updateURL(href))
	};
});

export const selectMyMarketsLink = memoizerific(1)((dispatch) => {
	const href = makeLocation({ page: MY_MARKETS }).url;
	return {
		href,
		onClick: () => {
			dispatch(loadFullLoginAccountMarkets());
			dispatch(updateURL(href));
		}
	};
});

export const selectMyReportsLink = memoizerific(1)((dispatch) => {
	const href = makeLocation({ page: MY_REPORTS }).url;
	return {
		href,
		onClick: () => {
			dispatch(loadEventsWithSubmittedReport());
			dispatch(updateURL(href));
		}
	};
});

export const selectLoginMessageLink = memoizerific(1)((userID, currentLoginMessageVersion, dispatch) => {
	const href = makeLocation({ page: LOGIN_MESSAGE }).url;
	return {
		href,
		onClick: () => {
			dispatch(updateURL(href));

			if (userID != null) {
				dispatch(updateUserLoginMessageVersionRead(currentLoginMessageVersion));
			}
		}
	};
});
