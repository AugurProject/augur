/*
 * Author: priecint
 */
import { UPDATE_MARKET_ORDER_BOOK } from '../../bids-asks/actions/update-market-order-book';

/**
 * @param {Object} marketOrderBooks
 * @param {Object} action
 * @return {{}} key: marketId, value: {buy: [], sell: []}
 */
export default function (marketOrderBooks = {}, action) {
	switch (action.type) {
	case UPDATE_MARKET_ORDER_BOOK:
		return {
			...marketOrderBooks,
			[action.marketId]: action.marketOrderBook
		};
	default:
		return marketOrderBooks;
	}
}
