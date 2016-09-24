export const UPDATE_MARKET_DATA_TIMESTAMP = 'UPDATE_MARKET_DATA_TIMESTAMP';

export function updateMarketDataTimestamp(marketID, timestamp) {
	return {
		type: UPDATE_MARKET_DATA_TIMESTAMP,
		marketID,
		timestamp
	};
}
