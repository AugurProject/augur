import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEther, formatRealEtherEstimate } from '../../../utils/format-number';
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
			message: `bidding ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
			freeze: {
				verb: 'freezing',
				noFeeCost: formatEther(totalEthWithoutFee),
				tradingFees: formatEther(tradingFeesEth)
			},
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));
		bid(transactionID, marketID, outcomeID, limitPrice, numShares, dispatch, (err, res) => {
			if (err) {
				return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
			}
			dispatch(updateExistingTransaction(transactionID, {
				hash: res.hash,
				timestamp: res.timestamp,
				status: 'updating order book',
				message: `bid ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
				freeze: {
					verb: 'froze',
					noFeeCost: formatEther(totalEthWithoutFee),
					tradingFees: formatEther(tradingFeesEth)
				},
				gasFees: formatRealEther(res.gasFees)
			}));
			dispatch(loadBidsAsks(marketID, () => {
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
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
		onSent: data => console.log('bid onSent', data),
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
