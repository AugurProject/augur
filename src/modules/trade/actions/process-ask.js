import * as AugurJS from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processBid(transactionID, marketID, outcomeID, numShares, limitPrice) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or shares "${numShares}"` }));
		}

		dispatch(updateExistingTransaction(transactionID, { status: 'placing ask...', message: `asking ${numShares} shares @ ${formatEther(limitPrice).full}` }));

		ask(transactionID, marketID, outcomeID, limitPrice, numShares, (err, res) => {
			if (err) {
				return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
			}
			return dispatch(updateExistingTransaction(transactionID, {
				status: SUCCESS,
				message: `ask ${formatShares(numShares).full} @ ${formatEther(limitPrice).full}`
			}));
		});
	};
}

function ask(transactionID, marketID, outcomeID, limitPrice, totalShares, cb) {
	AugurJS.sell({
		amount: totalShares,
		price: limitPrice,
		market: marketID,
		outcome: outcomeID,

		onSent: data => console.log('ask onSent', data),
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
