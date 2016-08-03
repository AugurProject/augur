/*
 * Author: priecint
 */
import { BID } from '../../bids-asks/constants/bids-asks-types';
import store from '../../../store';

export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';

/**
 *
 * @param {String} orderID
 * @param {String} status
 * @param {String} marketID
 * @param {String} type
 */
export function updateOrderStatus(orderID, status, marketID, type) {
	const { marketOrderBooks } = store.getState();
	const marketOrderBook = marketOrderBooks[marketID];

	if (marketOrderBook == null) {
		warnNonExistingOrder(orderID, status, marketID, type);
		return;
	}

	const buyOrSell = type === BID ? 'buy' : 'sell';
	const orders = marketOrderBook[buyOrSell];
	if (orders == null) {
		warnNonExistingOrder(orderID, status, marketID, type);
		return;
	}

	const order = orders[orderID];
	if (order == null) {
		warnNonExistingOrder(orderID, status, marketID, type);
		return;
	}

	return {
		type: UPDATE_ORDER_STATUS,
		orderID,
		status,
		marketID,
		orderType: buyOrSell
	};
}

function warnNonExistingOrder(orderID, status, marketID, type) {
	return console.warn('updateOrderStatus: can\'t update %o', orderID, status, marketID, type);
}
