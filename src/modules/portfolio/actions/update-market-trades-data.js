export const UPDATE_MARKET_TRADES_DATA = 'UPDATE_MARKET_TRADES_DATA';

export function updateMarketTradesData(data) {
	return {
		type: UPDATE_MARKET_TRADES_DATA,
		data
	};
}