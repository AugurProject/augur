import { UPDATE_MARKET_PRICE_HISTORY } from '../../market/actions/update-market-price-history';

export default function (priceHistory = {}, action) {
	switch (action.type) {
		case UPDATE_MARKET_PRICE_HISTORY:
			return {
				...priceHistory,
				[action.marketID]: action.priceHistory
			};

		default:
			return priceHistory;
	}
}
