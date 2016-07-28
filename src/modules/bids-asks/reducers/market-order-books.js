/*
 * Author: priecint
 */
import { UPDATE_MARKET_ORDER_BOOK } from '../../bids-asks/actions/update-market-order-book';
import { UPDATE_ORDER_STATUS } from '../../bids-asks/actions/update-order';

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
	case UPDATE_ORDER_STATUS:
		return {
			...marketOrderBooks,
			[action.marketID]: {
				...marketOrderBooks[action.marketID],
				[action.orderType]: {
					...marketOrderBooks[action.marketID][action.orderType],
					[action.orderID]: {
						...marketOrderBooks[action.marketID][action.orderType][action.orderID],
						status: action.status
					}
				}
			}
		};
	default:
		return marketOrderBooks;
	}
}
