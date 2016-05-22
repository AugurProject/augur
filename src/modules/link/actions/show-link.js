import { parseURL } from '../../../utils/parse-url';

import { loadFullMarket } from '../../market/actions/load-full-market';

export const SHOW_LINK = 'SHOW_LINK';

/**
 * @param {String} url URL to display in address bar
 * @param {=Object} options
 * @return {Function}
 */
export function showLink(url, options = {}) {
	return (dispatch, getState) => {
		dispatch({ type: SHOW_LINK, parsedURL: parseURL(url) });

		const { selectedMarketID, connection } = getState();
		if (selectedMarketID != null && connection.isConnected) {
			dispatch(loadFullMarket(selectedMarketID));
		}

		if (url !== window.location.pathname + window.location.search) {
			window.history.pushState(null, null, url);
		}
		if (!options.preventScrollTop) {
			window.scrollTo(0, 0);
		}
	};
}

export function showPreviousLink(url) {
	return (dispatch) => {
		dispatch({ type: SHOW_LINK, parsedURL: parseURL(url) });
		window.scrollTo(0, 0);
	};
}
