import { augur, abi } from '../../../services/augurjs';
import { formatEther, formatShares, formatRealEther, formatRealEtherEstimate } from '../../../utils/format-number';
import { FAILED } from '../../transactions/constants/statuses';
import { SCALAR } from '../../markets/constants/market-types';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';

export function processBid(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!transactionID) return console.error('processBid failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
		if (!limitPrice || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or total "${totalEthWithFee}"`
			}));
		}
		if (!marketID || !outcomeID || !totalEthWithFee || !tradingFeesEth || !gasFeesRealEth || !numShares) {
			console.error('processBid has failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: 'there was an issue placing your bid order'
			}));
		}
		const totalEthWithoutFee = abi.bignum(totalEthWithFee).minus(abi.bignum(tradingFeesEth));
		const avgPrice = abi.bignum(totalEthWithFee).dividedBy(abi.bignum(numShares));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'placing bid...',
			message: `bidding ${formatShares(numShares).full} for ${formatEther(avgPrice).full}/share`,
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
		augur.buy({
			amount: numShares,
			price: limitPrice,
			market: marketID,
			outcome: outcomeID,
			scalarMinMax,
			onSent: res => console.log('bid onSent', res),
			onSuccess: (res) => {
				dispatch(updateExistingTransaction(transactionID, {
					hash: res.hash,
					timestamp: res.timestamp,
					status: 'updating order book',
					message: `bid ${formatShares(numShares).full} for ${formatEther(avgPrice).full}/share`,
					freeze: {
						verb: 'froze',
						noFeeCost: formatEther(totalEthWithoutFee),
						tradingFees: formatEther(tradingFeesEth)
					},
					gasFees: formatRealEther(res.gasFees)
				}));
				dispatch(loadBidsAsks(marketID, () => dispatch(deleteTransaction(transactionID))));
			},
			onFailed: err => dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: err.message
			}))
		});
	};
}
