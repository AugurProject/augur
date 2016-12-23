import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEtherEstimate } from '../../../utils/format-number';
import { FAILED } from '../../transactions/constants/statuses';
import { SCALAR } from '../../markets/constants/market-types';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';

const noop = () => {};

export function processShortAsk(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!transactionID) return console.error('processShortAsk failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
		if (!limitPrice || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or shares "${numShares}"`
			}));
		}
		if (!marketID || !outcomeID || !totalEthWithFee || !tradingFeesEth || !gasFeesRealEth) {
			console.error('processShortAsk failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: 'There was an issue processesing the Short Ask trade.'
			}));
		}
		const totalEthWithoutFee = abi.bignum(totalEthWithFee).minus(abi.bignum(tradingFeesEth));
		const avgPrice = abi.bignum(totalEthWithFee).dividedBy(abi.bignum(numShares));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'placing short ask...',
			message: `short asking ${formatShares(numShares).full} for ${formatEther(avgPrice).full}/share`,
			freeze: {
				verb: 'freezing',
				noFeeCost: formatEther(totalEthWithoutFee),
				tradingFees: formatEther(tradingFeesEth)
			},
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));
		const marketData = getState().marketsData[marketID];
		const scalarMinMax = {};
		if (marketData && marketData.type === SCALAR) {
			scalarMinMax.minValue = marketData.minValue;
		}
		augur.shortAsk({
			amount: numShares,
			price: limitPrice,
			market: marketID,
			outcome: outcomeID,
			scalarMinMax,
			onSent: noop,
			onSuccess: () => dispatch(deleteTransaction(transactionID)),
			onFailed: err => dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: err.message
			}))
		});
	};
}
