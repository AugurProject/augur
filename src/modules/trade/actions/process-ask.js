import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEther } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processAsk(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or shares "${numShares}"`
			}));
		}

		const totalEthWithoutFee = abi.bignum(totalEthWithFee).minus(abi.bignum(tradingFeesEth));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'placing ask...',
			message: `asking ${numShares} shares @ ${limitPrice} ETH<br />
				freezing ${formatEther(tradingFeesEth).full} in potential trading fees)<br />
				expected return: ${formatEther(totalEthWithoutFee).full}(-${formatRealEther(gasFeesRealEth).full} in estimated gas fees)`
		}));

		ask(transactionID, marketID, outcomeID, limitPrice, numShares, dispatch, (err, res) => {
			if (err) {
				return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
			}
			return dispatch(updateExistingTransaction(transactionID, {
				status: SUCCESS,
				message: `ask ${formatShares(numShares).full} for ${formatEther(totalEthWithFee).full}<br />
					freezing ${formatEther(tradingFeesEth).full} in potential trading fees)<br />
					expected return: ${formatEther(totalEthWithoutFee).full} (-${formatRealEther(res.gasFees).full} in gas fees)`
			}));
		});
	};
}

function ask(transactionID, marketID, outcomeID, limitPrice, totalShares, dispatch, cb) {
	augur.sell({
		amount: totalShares,
		price: limitPrice,
		market: marketID,
		outcome: outcomeID,

		onSent: data => {
			dispatch(updateExistingTransaction(transactionID, { hash: data.txHash }));
			console.log('ask onSent', data);
		},
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
