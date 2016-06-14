export const UPDATE_MARKET_ORDER_BOOK = 'UPDATE_MARKET_ORDER_BOOK';

export function updateMarketOrderBook(marketId, marketOrderBook) {
	return { type: UPDATE_MARKET_ORDER_BOOK, marketId, marketOrderBook };
}
