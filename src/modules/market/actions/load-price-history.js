import { augur } from '../../../services/augurjs';
import { updateMarketPriceHistory } from '../../market/actions/update-market-price-history';

export function loadPriceHistory(marketID) {
	return (dispatch, getState) => {
		augur.getMarketPriceHistory(marketID, (priceHistory) => {
			if (priceHistory && priceHistory.error) {
				return console.warn('ERROR: loadPriceHistory()', priceHistory);
			}
			dispatch(updateMarketPriceHistory(marketID, priceHistory));
		});
	};
}
