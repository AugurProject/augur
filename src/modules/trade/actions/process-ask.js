import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { FAILED } from '../../transactions/constants/statuses';
import { SCALAR } from '../../markets/constants/market-types';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';

export function processAsk(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!transactionID) return console.error('processAsk has failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
		if (!limitPrice || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or shares "${numShares}"`
			}));
		}
		if (!marketID || !outcomeID || !totalEthWithFee || !tradingFeesEth || !gasFeesRealEth) {
			console.error('processAsk has failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: 'there was an issue placing your ask order'
			}));
		}
		const totalEthWithoutFee = abi.bignum(totalEthWithFee).minus(abi.bignum(tradingFeesEth));
		const avgPrice = abi.bignum(totalEthWithFee).dividedBy(abi.bignum(numShares));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'placing ask...',
			message: `asking ${formatShares(numShares).full} for ${formatEther(avgPrice).full} each`,
			freeze: {
				verb: 'freezing',
				tradingFees: formatEther(tradingFeesEth)
			},
			totalReturn: formatEtherEstimate(totalEthWithoutFee),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));
		const marketData = getState().marketsData[marketID];
		const scalarMinMax = {};
		if (marketData && marketData.type === SCALAR) {
			scalarMinMax.minValue = marketData.minValue;
		}
		augur.sell({
			amount: numShares,
			price: limitPrice,
			market: marketID,
			outcome: outcomeID,
			scalarMinMax,
			onSent: res => console.log('ask onSent', res),
			onSuccess: (res) => {
				dispatch(updateExistingTransaction(transactionID, {
					hash: res.hash,
					timestamp: res.timestamp,
					status: 'updating order book',
					message: `ask ${formatShares(numShares).full} for ${formatEther(avgPrice).full} each`,
					freeze: {
						verb: 'froze',
						tradingFees: formatEther(tradingFeesEth)
					},
					totalReturn: formatEtherEstimate(totalEthWithoutFee),
					gasFees: formatRealEther(res.gasFees)
				}));
				dispatch(deleteTransaction(transactionID));
			},
			onFailed: err => dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: err.message
			}))
		});
	};
}
