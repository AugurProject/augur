import { parseURL } from '../../../utils/parse-url';

import { loadFullMarket } from '../../market/actions/load-full-market';

export const UPDATE_URL = 'UPDATE_URL';

export function updateURL(url) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_URL, parsedURL: parseURL(url) });

		const { selectedMarketID, connection } = getState();

		if (selectedMarketID != null && connection.isConnected) {
			dispatch(loadFullMarket(selectedMarketID));
		}
	};
}
