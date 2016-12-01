import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { abi, constants } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { shortSell } from '../../trade/actions/helpers/short-sell';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addShortAskTransaction } from '../../transactions/actions/add-short-ask-transaction';

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
		let filledEth = ZERO;
		const avgPrice = abi.bignum(totalEthWithFee).dividedBy(abi.bignum(numShares));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'starting...',
			message: `short selling ${formatShares(numShares).full} for ${formatEther(avgPrice).full}/share`,
			totalCost: formatEtherEstimate(totalEthWithFee),
			tradingFees: formatEtherEstimate(tradingFeesEth),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));
		const { loginAccount } = getState();
		shortSell(marketID, outcomeID, numShares, loginAccount.id, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.id),
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
				filledEth = filledEth.plus(res.filledEth);
				const filledShares = abi.bignum(numShares).minus(res.remainingShares);
				const actualEthWithFee = abi.bignum(filledEth).plus(res.tradingFees);
				const pricePerShare = filledEth.dividedBy(filledShares);
				dispatch(updateExistingTransaction(transactionID, {
					status: 'updating position',
					message: `short sold ${formatShares(filledShares).full} for ${formatEther(pricePerShare).full} each`,
					totalCost: formatEther(actualEthWithFee),
					tradingFees: formatEther(res.tradingFees),
					gasFees: formatRealEther(res.gasFees)
				}));
				if (res.remainingShares.gt(constants.PRECISION.zero)) {
					const transactionData = getState().transactionsData[transactionID];
					dispatch(addShortAskTransaction(
						transactionData.data.marketID,
						transactionData.data.outcomeID,
						transactionData.data.marketType,
						transactionData.data.marketDescription,
						transactionData.data.outcomeName,
						res.remainingShares.toFixed(),
						limitPrice,
						actualEthWithFee,
						tradingFeesEth,
						transactionData.feePercent.value,
						gasFeesRealEth));
				}
				// update user's position
				dispatch(loadAccountTrades(marketID, () => {
					dispatch(loadBidsAsks(marketID, () => {
						dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
					}));
				}));
			}
		);
	};
}
