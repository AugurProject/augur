import { UPDATE_MARKET_DATA_TIMESTAMP } from '../../market/actions/update-market-data-timestamp';

export default function (marketDataTimestamps = {}, action) {
	switch (action.type) {
		case UPDATE_MARKET_DATA_TIMESTAMP:
			return {
				...marketDataTimestamps,
				[action.marketID]: action.timestamp
			};

		default:
			return marketDataTimestamps;
	}
}
