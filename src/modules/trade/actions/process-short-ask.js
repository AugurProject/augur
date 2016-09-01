import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEther } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processShortAsk(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!limitPrice || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or shares "${numShares}"`
			}));
		}

		const totalEthWithoutFee = abi.bignum(totalEthWithFee).minus(abi.bignum(tradingFeesEth));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'placing short ask...',
			message: `short asking ${numShares} shares @ ${limitPrice} ETH<br />
				freezing ${formatEther(totalEthWithoutFee).full} + ${formatEther(tradingFeesEth).full} in potential trading fees)<br />
				(paying ${formatRealEther(gasFeesRealEth).full} in estimated gas fees)`
		}));

		shortAsk(transactionID, marketID, outcomeID, limitPrice, numShares, dispatch, (err, res) => {
			if (err) {
				return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
			}
			return dispatch(updateExistingTransaction(transactionID, {
				status: SUCCESS,
				message: `ask ${formatShares(numShares).full} for ${formatEther(totalEthWithFee).full}<br />
					froze ${formatEther(totalEthWithoutFee).full} + ${formatEther(tradingFeesEth).full} in potential trading fees<br />
					(paid ${formatRealEther(res.gasFees).full} in gas fees)`
			}));
		});
	};
}

function shortAsk(transactionID, marketID, outcomeID, limitPrice, totalShares, dispatch, cb) {
	augur.shortAsk({
		amount: totalShares,
		price: limitPrice,
		market: marketID,
		outcome: outcomeID,

		onSent: data => {
			dispatch(updateExistingTransaction(transactionID, { hash: data.txHash }));
		},
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
