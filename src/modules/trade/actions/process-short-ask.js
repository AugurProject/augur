import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEther, formatRealEtherEstimate } from '../../../utils/format-number';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { sellCompleteSets } from '../../my-positions/actions/sell-complete-sets';

const noop = () => {};

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
			message: `short asking ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
			freeze: {
				verb: 'freezing',
				noFeeCost: formatEther(totalEthWithoutFee),
				tradingFees: formatEther(tradingFeesEth)
			},
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));

		shortAsk(transactionID, marketID, outcomeID, limitPrice, numShares, dispatch, (err, res) => {
			if (err) {
				return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
			}
			dispatch(updateExistingTransaction(transactionID, {
				hash: res.hash,
				timestamp: res.timestamp,
				status: 'updating order book',
				message: `short ask ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
				freeze: {
					verb: 'froze',
					noFeeCost: formatEther(totalEthWithoutFee),
					tradingFees: formatEther(tradingFeesEth)
				},
				gasFees: formatRealEther(res.gasFees)
			}));
			dispatch(loadBidsAsks(marketID, () => {
				dispatch(updateExistingTransaction(transactionID, { status: 'updating position' }));
				dispatch(loadAccountTrades(marketID, () => {
					dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
				}));
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
		onSent: noop,
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
