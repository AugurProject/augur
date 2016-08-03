/*
 * Author: priecint
 */

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processCancelOrder } from '../../bids-asks/actions/cancel-order';
import { CANCEL_ORDER } from '../../transactions/constants/types';

export function addCancelTransaction(orderID, marketID, type) {
	return (dispatch, getState) => {
		dispatch(addTransaction(makeCancelTransaction(orderID, marketID, type, null, null, dispatch)));
	};
}

export function makeCancelTransaction(orderID, marketID, type, ether, gas, dispatch) {
	return {
		type: CANCEL_ORDER,
		gas,
		ether,
		data: {
			orderID,
			marketID,
			type
		},
		action: (transactionID) => dispatch(processCancelOrder(transactionID, orderID))
	};
}
