import * as AugurJS from '../../../services/augurjs';

import { updateMarketPriceHistory } from '../../market/actions/update-market-price-history';

export function loadPriceHistory(marketID) {
	return (dispatch, getState) => {
		// todo: caching
		AugurJS.loadPriceHistory(marketID, (err, priceHistory) => {
			if (err) {
				return console.info('ERROR: loadPriceHistory()', err);
			}
			dispatch(updateMarketPriceHistory(marketID, priceHistory));
		});
	};
}
