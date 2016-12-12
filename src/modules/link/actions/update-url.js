import { parseURL } from '../../../utils/parse-url';
import { loadFullMarket } from '../../market/actions/load-full-market';
import setTitle from '../../../utils/set-title';

export const UPDATE_URL = 'UPDATE_URL';

// `title` options:
// Pass in: sets passed in title
// Pass in `false`: skips setting title
// null/undefined: sets respective default title
export function updateURL(url, title) {
	return (dispatch, getState) => {
		const parsedURL = parseURL(url);

		if (title) {
			setTitle(title);
		} else if (title !== false) {
			setTitle(null, (parsedURL.searchParams|| null));
		}

		dispatch({ type: UPDATE_URL, parsedURL });

		const { selectedMarketID, connection } = getState();

		if (selectedMarketID && connection.isConnected) {
			dispatch(loadFullMarket(selectedMarketID));
		}
	};
}
