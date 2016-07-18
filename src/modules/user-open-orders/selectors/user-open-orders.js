/*
 * Author: priecint
 */
import memoizerific from 'memoizerific';
import store from '../../../store';
import updateSelectedOpenOrdersGroup from '../actions/update-selected-user-open-orders-group';
import { BID, ASK } from '../../bids-asks/constants/bids-asks-types';

export default function (outcomeId, outcomeOrderBook) {
	const { loginAccount } = store.getState();

	return selectUserOpenOrders(outcomeId, loginAccount, outcomeOrderBook);
}

export const selectUserOpenOrders = memoizerific(10)((outcomeId, loginAccount, outcomeOrderBook) => {
	const isUserLoggedIn = loginAccount != null;

	if (!isUserLoggedIn || outcomeOrderBook == null || (outcomeOrderBook.bids.length === 0 && outcomeOrderBook.asks.length === 0)) {
		return {
			items: [],
			selectedUserOpenOrdersGroup: store.getState().selectedUserOpenOrdersGroup,
			cancelOrder: selectCancelOrder(outcomeId),
			updateSelectedOpenOrdersGroup: selectUpdateSelectedOpenOrdersGroup(store.dispatch)
		};
	}

	const userBids = outcomeOrderBook.bids
		.filter(userOrderFilter)
		.map(order => {
			const type = BID;
			// todo
			return {
				type
			};
		});

	const userAsks = outcomeOrderBook.asks
		.filter(userOrderFilter)
		.map(order => {
			// todo
			const type = ASK;
			return {
				type
			};
		});

	return {
		items: userBids.concat(userAsks),
		selectedUserOpenOrdersGroup: store.getState().selectedUserOpenOrdersGroup,
		cancelOrder: selectCancelOrder(outcomeId),
		updateSelectedOpenOrdersGroup: selectUpdateSelectedOpenOrdersGroup(store.dispatch)
	};
});

export const selectUpdateSelectedOpenOrdersGroup = memoizerific(1)((dispatch) => (
	outcomeId => dispatch(updateSelectedOpenOrdersGroup(outcomeId))
));

export const selectCancelOrder = memoizerific(1)((dispatch) => (
	(orderId) => console.log('cancelling %o', orderId)
	// return (orderId) => dispatch(cancelOrder(orderId));
));

function userOrderFilter(order) {
	return (
		order.isOfCurrentUser
	);
}
