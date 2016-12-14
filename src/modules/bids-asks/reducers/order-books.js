import { UPDATE_MARKET_ORDER_BOOK, CLEAR_MARKET_ORDER_BOOK } from '../../bids-asks/actions/update-market-order-book';

/**
 * @param {Object} orderBooks
 * @param {Object} action
 * @return {{}} key: marketId, value: {buy: {}, sell: {}}
 */
export default function (orderBooks = {}, action) {
	switch (action.type) {
		case UPDATE_MARKET_ORDER_BOOK: {
			const orderBook = orderBooks[action.marketId] || {};
			return {
				...orderBooks,
				[action.marketId]: {
					buy: (orderBook.buy)
						? { ...orderBook.buy, ...action.marketOrderBook.buy }
						: action.marketOrderBook.buy,
					sell: (orderBook.sell)
						? { ...orderBook.sell, ...action.marketOrderBook.sell }
						: action.marketOrderBook.sell
				}
			};
		}
		case CLEAR_MARKET_ORDER_BOOK:
			return {
				...orderBooks,
				[action.marketId]: { buy: {}, sell: {} }
			};
		default:
			return orderBooks;
	}
}
