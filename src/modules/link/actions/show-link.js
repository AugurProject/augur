import { ParseURL } from '../../../utils/parse-url';

export const SHOW_LINK = 'SHOW_LINK';

export function showLink(url, skipPushState) {
    return function(dispatch, getState) {
        	dispatch({ type: SHOW_LINK, parsedURL: ParseURL(url) });
            if (url !== window.location.pathname + window.location.search) {
			    window.history.pushState(null, null, url);
            }
			window.scrollTo(0, 0);
    };
}

export function showPreviousLink(url) {
    return function(dispatch) {
        dispatch({ type: SHOW_LINK, parsedURL: ParseURL(url) });
        window.scrollTo(0, 0);
    };
}


