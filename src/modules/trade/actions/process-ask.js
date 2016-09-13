import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';

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
			message: `asking ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
			freeze: {
				verb: 'freezing',
				tradingFees: formatEther(tradingFeesEth)
			},
			totalReturn: formatEtherEstimate(totalEthWithoutFee),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));

		ask(transactionID, marketID, outcomeID, limitPrice, numShares, dispatch, (err, res) => {
			if (err) {
				return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
			}
			dispatch(loadBidsAsks(marketID));
			dispatch(updateExistingTransaction(transactionID, {
				hash: res.hash,
				timestamp: res.timestamp,
				status: SUCCESS,
				message: `ask ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
				freeze: {
					verb: 'froze',
					tradingFees: formatEther(tradingFeesEth)
				},
				totalReturn: formatEtherEstimate(totalEthWithoutFee),
				gasFees: formatRealEther(res.gasFees)
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
		onSent: data => console.log('ask onSent', data),
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
