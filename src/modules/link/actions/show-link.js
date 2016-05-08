import { ParseURL } from '../../../utils/parse-url';

import { M } from '../../app/constants/pages';

import { loadPriceHistory } from '../../markets/actions/load-price-history'

export const SHOW_LINK = 'SHOW_LINK';

/**
 *
 * @param {String} url URL to display in address bar
 * @param {=Object} options
 * @return {Function}
 */
export function showLink(url, options = {}) {
    return function(dispatch, getState) {
        dispatch({ type: SHOW_LINK, parsedURL: ParseURL(url) });

        let { activePage, selectedMarketID } = getState();
        if (activePage === M) {
            dispatch(loadPriceHistory(selectedMarketID));
        }

        if (url !== window.location.pathname + window.location.search) {
            window.history.pushState(null, null, url);
        }
        if (!options.preventScroll) {
			window.scrollTo(0, 0);
        }
    };
}

export function showPreviousLink(url) {
    return function(dispatch) {
        dispatch({ type: SHOW_LINK, parsedURL: ParseURL(url) });
        window.scrollTo(0, 0);
    };
}


