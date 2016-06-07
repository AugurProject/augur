export const UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA';
export const UPDATE_MARKET_DATA = 'UPDATE_MARKET_DATA';

export function updateMarketsData(marketsData) {
	return { type: UPDATE_MARKETS_DATA, marketsData };
}

export function updateMarketData(marketData) {
	return { type: UPDATE_MARKET_DATA, marketData };
}
