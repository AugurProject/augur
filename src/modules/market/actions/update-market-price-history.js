export const UPDATE_MARKET_PRICE_HISTORY = 'UPDATE_MARKET_PRICE_HISTORY';

export function updateMarketPriceHistory(marketID, priceHistory) {
	return { type: UPDATE_MARKET_PRICE_HISTORY, marketID, priceHistory };
}
