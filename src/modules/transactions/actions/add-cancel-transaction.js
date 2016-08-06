/*
 * Author: priecint
 */

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processCancelOrder } from '../../bids-asks/actions/cancel-order';
import { CANCEL_ORDER } from '../../transactions/constants/types';

export function addCancelTransaction(order, market, outcome) {
	return (dispatch, getState) => {
		dispatch(addTransaction(makeCancelTransaction(order, market, outcome, null, null, dispatch)));
	};
}

export function makeCancelTransaction(order, market, outcome, ether, gas, dispatch) {
	return {
		type: CANCEL_ORDER,
		gas,
		ether,
		data: {
			order,
			market,
			outcome
		},
		action: (transactionID) => dispatch(processCancelOrder(transactionID, order.id))
	};
}
