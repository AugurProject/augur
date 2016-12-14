import getOrder from '../../bids-asks/helpers/get-order';
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
	return (dispatch, getState) => {
		const { orderBooks } = store.getState();

		const order = getOrder(orderID, marketID, type, orderBooks);
		if (order == null) {
			warnNonExistingOrder(orderID, status, marketID, type);
			return;
		}

		dispatch({
			type: UPDATE_ORDER_STATUS,
			orderID,
			status,
			marketID,
			orderType: type
		});
	};
}

function warnNonExistingOrder(orderID, status, marketID, type) {
	return console.warn('updateOrderStatus: can\'t update %o', orderID, status, marketID, type);
}
