import { augur } from '../../../services/augurjs';
import { updateMarketPriceHistory } from '../../market/actions/update-market-price-history';
import { updateMarketTradesData } from '../../portfolio/actions/update-market-trades-data';

export function loadPriceHistory(marketID) {
	return (dispatch, getState) => {
		augur.getMarketPriceHistory(marketID, (err, priceHistory) => {
			if (err) return console.error('loadPriceHistory:', err);
			dispatch(updateMarketTradesData({ [marketID]: priceHistory }));
			dispatch(updateMarketPriceHistory(marketID, priceHistory));
		});
	};
}
