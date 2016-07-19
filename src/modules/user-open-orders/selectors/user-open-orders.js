/*
 * Author: priecint
 */
import memoizerific from 'memoizerific';
import store from '../../../store';
import { isOrderOfUser } from '../../bids-asks/selectors/is-order-of-user';
import { BID, ASK } from '../../bids-asks/constants/bids-asks-types';
import { CANCELLING, CANCELLED } from '../../bids-asks/constants/order-status';
import { formatNone, formatEther, formatShares } from '../../../utils/format-number';

export default function (outcomeId, marketOrderBook) {
	const { loginAccount } = store.getState();

	return selectUserOpenOrders(outcomeId, loginAccount, marketOrderBook);
}

export const selectUserOpenOrders = memoizerific(10)((outcomeID, loginAccount, marketOrderBook) => {
	const isUserLoggedIn = loginAccount != null && loginAccount.address != null;

	if (!isUserLoggedIn || marketOrderBook == null) {
		return [];
	}

	const userBids = marketOrderBook.buy == null ? [] : marketOrderBook.buy
		.filter(order => order.outcome === outcomeID && isOrderOfUser(order, loginAccount.address))
		.map(order => (
			{
				id: order.id,
				marketID: order.market,
				type: BID,
				isCancelling: order.status === CANCELLING,
				isCancelled: order.status === CANCELLED,
				originalShares: formatNone(),
				avgPrice: formatEther(order.price),
				matchedShares: formatNone(),
				unmatchedShares: formatShares(order.amount)
			}
	));

	const userAsks = marketOrderBook.sell == null ? [] : marketOrderBook.sell
		.filter(order => order.outcome === outcomeID && isOrderOfUser(order, loginAccount.address))
		.map(order => (
			{
				id: order.id,
				marketID: order.market,
				type: ASK,
				isCancelling: order.status === CANCELLING,
				isCancelled: order.status === CANCELLED,
				originalShares: formatNone(),
				avgPrice: formatEther(order.price),
				matchedShares: formatNone(),
				unmatchedShares: formatShares(order.amount)
			}
		));

	return userBids.concat(userAsks);
});
