import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { shortSell } from '../../trade/actions/helpers/short-sell';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addShortAskTransaction } from '../../transactions/actions/add-short-ask-transaction';

export function processShortSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!limitPrice || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or shares "${numShares}"`
			}));
		}

		// we track filled eth here as well to take into account the recursiveness of trading
		let filledEth = ZERO;

		dispatch(updateExistingTransaction(transactionID, {
			status: 'starting...',
			message: `short selling ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
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
				const filledShares = abi.bignum(numShares).minus(abi.bignum(res.remainingShares));
				const totalEthWithFee = abi.bignum(filledEth).plus(res.tradingFees);
				dispatch(updateExistingTransaction(transactionID, {
					status: 'updating position',
					message: `short sold ${formatShares(filledShares).full} for ${formatEther(filledEth).full}`,
					totalCost: formatEther(totalEthWithFee),
					tradingFees: formatEther(res.tradingFees),
					gasFees: formatRealEther(res.gasFees)
				}));
				if (res.remainingShares > 0) {
					const transactionData = getState().transactionsData[transactionID];
					dispatch(addShortAskTransaction(
						transactionData.data.marketID,
						transactionData.data.outcomeID,
						transactionData.data.marketDescription,
						transactionData.data.outcomeName,
						res.remainingShares,
						limitPrice,
						totalEthWithFee,
						tradingFeesEth,
						transactionData.feePercent.value,
						gasFeesRealEth));
				}

				// update user's position
				dispatch(loadAccountTrades(marketID, () => {
					dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
				}));
			}
		);
	};
}
