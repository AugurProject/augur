import { addTransaction } from '../../transactions/actions/add-transactions';
import { processCancelOrder } from '../../bids-asks/actions/cancel-order';
import { CANCEL_ORDER } from '../../transactions/constants/types';
import { formatShares, formatEther } from '../../../utils/format-number';

export function addCancelTransaction(order, market, outcome) {
	return (dispatch, getState) => {
		dispatch(addTransaction(makeCancelTransaction(order, market, outcome, null, null, dispatch)));
	};
}

export function makeCancelTransaction(order, market, outcome, ether, gas, dispatch) {
	const { id, type, amount, price } = order;
	return {
		type: CANCEL_ORDER,
		gas,
		ether,
		data: {
			marketID: market.id,
			marketDescription: market.description,
			order: {
				id,
				type,
				shares: formatShares(amount),
				price: formatEther(price)
			},
			market: {
				id: market.id,
				description: market.description
			},
			outcome
		},
		action: transactionID => dispatch(processCancelOrder(transactionID, order.id))
	};
}
