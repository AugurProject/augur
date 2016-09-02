import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEther } from '../../../utils/format-number';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';

export function processBid(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or total "${totalEthWithFee}"`
			}));
		}

		const totalEthWithoutFee = abi.bignum(totalEthWithFee).minus(abi.bignum(tradingFeesEth));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'placing bid...',
			message: `bidding ${numShares} shares @ ${limitPrice} ETH<br />
				freezing ${formatEther(totalEthWithoutFee).full} + ${formatEther(tradingFeesEth).full} in potential trading fees<br />
				<small>(paying ${formatRealEther(gasFeesRealEth).full} in estimated gas fees)</small>`
		}));

		bid(transactionID, marketID, outcomeID, limitPrice, numShares, dispatch, (err, res) => {
			if (err) {
				return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
			}
			dispatch(loadBidsAsks(marketID));
			return dispatch(updateExistingTransaction(transactionID, {
				status: SUCCESS,
				message: `bid ${formatShares(numShares).full} for ${formatEther(totalEthWithFee).full}<br />
					froze ${formatEther(totalEthWithoutFee).full} + ${formatEther(tradingFeesEth).full} in potential trading fees<br />
					<small>(paid ${formatRealEther(res.gasFees).full} in gas fees)</small>`
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
