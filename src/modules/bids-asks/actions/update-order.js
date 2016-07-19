/*
 * Author: priecint
 */
import { BID } from '../../bids-asks/constants/bids-asks-types';

export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';

/**
 *
 * @param {String} orderID
 * @param {String} status
 * @param {String} marketID Here to speed up look-up of order, if orders are stored by their IDs, it won't be needed
 * @param {String} type Here to speed up look-up of order, if orders are stored by their IDs, it won't be needed
 */
export function updateOrderStatus(orderID, status, marketID, type) {
	return (dispatch, getState) => {
		const { marketOrderBooks } = getState();
		const marketOrderBook = marketOrderBooks[marketID];

		if (marketOrderBook == null) {
			return console.warn('updateOrderStatus: can\'t update %o', orderID);
		}

		const buyOrSell = type === BID ? 'buy' : 'sell';
		const orders = marketOrderBook[buyOrSell];
		if (orders == null) {
			return console.warn('updateOrderStatus: can\'t update %o', orderID);
		}

		const order = orders.find(order => order.id === orderID);
		if (order == null) {
			return console.warn('updateOrderStatus: can\'t update %o', orderID);
		}

		dispatch({
			type: UPDATE_ORDER_STATUS,
			orderID,
			status,
			marketID,
			orderType: buyOrSell
		});
	};
}
