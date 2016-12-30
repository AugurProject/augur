import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { abi, augur, constants } from '../../../services/augurjs';
import { FAILED } from '../../transactions/constants/statuses';
import { SCALAR } from '../../markets/constants/market-types';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { shortSell } from '../../trade/actions/helpers/short-sell';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';

export function processShortSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!transactionID) return console.error('processShortSell failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
		if (!limitPrice || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or shares "${numShares}"`
			}));
		}
		if (!marketID || !outcomeID || !totalEthWithFee || !tradingFeesEth || !gasFeesRealEth) {
			console.error('processShortSell failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: 'There was an issue processesing the Short Sell trade.'
			}));
		}
		const avgPrice = abi.bignum(totalEthWithFee).dividedBy(abi.bignum(numShares));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'starting...',
			message: `short selling ${formatShares(numShares).full} for ${formatEther(avgPrice).full}/share`,
			totalCost: formatEtherEstimate(totalEthWithFee),
			tradingFees: formatEtherEstimate(tradingFeesEth),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));
		const { loginAccount } = getState();
		shortSell(marketID, outcomeID, numShares, loginAccount.address, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.address),
			(data) => {
				const update = { status: `${data.status} short sell...` };
				if (data.hash) update.hash = data.hash;
				if (data.timestamp) update.timestamp = data.timestamp;
				if (data.tradingFees) update.tradingFees = formatEther(data.tradingFees);
				if (data.gasFees) update.gasFees = formatRealEther(data.gasFees);
				dispatch(updateExistingTransaction(transactionID, update));
			},
			(err, res) => {
				dispatch(updateTradeCommitLock(false));
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, {
						status: FAILED,
						message: err.message
					}));
				}
				if (res.remainingShares.gt(constants.PRECISION.zero)) {
					const transactionData = getState().transactionsData[transactionID];
					const marketData = getState().marketsData[marketID];
					const scalarMinMax = {};
					if (marketData && marketData.type === SCALAR) {
						scalarMinMax.minValue = marketData.minValue;
					}
					augur.shortAsk({
						amount: res.remainingShares.toFixed(),
						price: limitPrice,
						market: transactionData.data.marketID,
						outcome: transactionData.data.outcomeID,
						scalarMinMax,
						onSent: res => console.log('shortAsk sent:', res),
						onSuccess: res => console.log('shortAsk success:', res),
						onFailed: err => console.error('shortAsk failed:', err)
					});
				}
				// update user's position
				dispatch(deleteTransaction(transactionID));
			}
		);
	};
}
