import { augur } from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processBid(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or total "${totalEthWithFee}"` }));
		}

		dispatch(updateExistingTransaction(transactionID, { status: 'placing bid...', message: `bidding ${numShares} shares @ ${limitPrice} ETH` }));

		bid(transactionID, marketID, outcomeID, limitPrice, numShares, dispatch, (err, res) => {
			if (err) {
				return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
			}
			return dispatch(updateExistingTransaction(transactionID, {
				status: SUCCESS,
				message: `bid ${formatShares(numShares).full} for ${formatEther(totalEthWithFee).full}`
			}));
		});
	};
}

function bid(transactionID, marketID, outcomeID, limitPrice, numShares, dispatch, cb) {
	augur.buy({
		amount: numShares,
		price: limitPrice,
		market: marketID,
		outcome: outcomeID,

		onSent: data => {
			dispatch(updateExistingTransaction(transactionID, { hash: data.txHash }));
			console.log('bid onSent', data);
		},
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
