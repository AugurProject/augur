import { augur } from '../../../services/augurjs';
import { updateMarketPriceHistory } from '../../market/actions/update-market-price-history';
import { updateMarketTradesData } from '../../portfolio/actions/update-market-trades-data';

export function loadPriceHistory(marketID) {
	return (dispatch, getState) => {
		augur.getMarketPriceHistory(marketID, (priceHistory) => {
			if (priceHistory && priceHistory.error) {
				return console.warn('ERROR: loadPriceHistory()', priceHistory);
			}
			const trades = {};
			trades[marketID] = priceHistory;
			dispatch(updateMarketTradesData(trades));
			dispatch(updateMarketPriceHistory(marketID, priceHistory));
		});
	};
}
