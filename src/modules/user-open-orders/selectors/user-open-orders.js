/*
 * Author: priecint
 */
import memoizerific from 'memoizerific';
import store from '../../../store';
import { isOrderOfUser } from '../../bids-asks/helpers/is-order-of-user';
import { BID, ASK } from '../../bids-asks/constants/bids-asks-types';
import { CANCELLING, CANCELLED } from '../../bids-asks/constants/order-status';
import { formatNone, formatEther, formatShares } from '../../../utils/format-number';

/**
 *
 * @param {String} outcomeId
 * @param {{buy: object, sell: object}} marketOrderBook
 *
 * @return {Array}
 */
export default function (outcomeId, marketOrderBook) {
	const { loginAccount } = store.getState();

	return selectUserOpenOrders(outcomeId, loginAccount, marketOrderBook);
}

/**
 *
 * @param {String} outcomeID
 * @param {Object} loginAccount
 * @param {{buy: object, sell: object}} marketOrderBook
 *
 * @return {Array}
 */
const selectUserOpenOrders = memoizerific(10)((outcomeID, loginAccount, marketOrderBook) => {
	const isUserLoggedIn = loginAccount.id != null;

	if (!isUserLoggedIn || marketOrderBook == null) {
		return [];
	}

	const userBids = marketOrderBook.buy == null ? [] : getUserOpenOrders(marketOrderBook.buy, BID, outcomeID, loginAccount.id);

	const userAsks = marketOrderBook.sell == null ? [] : getUserOpenOrders(marketOrderBook.sell, ASK, outcomeID, loginAccount.id);

	return userBids.concat(userAsks);
});

/**
 * Returns user's order for specified outcome
 *
 * @param {Object} orders
 * @param {String} orderType
 * @param {String} outcomeID
 * @param {String} userID
 *
 * @return {Array}
 */
function getUserOpenOrders(orders, orderType, outcomeID, userID) {
	return Object.keys(orders)
		.map(orderId => orders[orderId])
		.filter(order => order.outcome === outcomeID && isOrderOfUser(order, userID) && !order.isCancelled)
		.map(order => (
			{
				id: order.id,
				marketID: order.market,
				type: orderType,
				isCancelling: order.status === CANCELLING,
				isCancelled: order.status === CANCELLED,
				originalShares: formatNone(),
				avgPrice: formatEther(order.price),
				matchedShares: formatNone(),
				unmatchedShares: formatShares(order.amount)
			}
		));
}
