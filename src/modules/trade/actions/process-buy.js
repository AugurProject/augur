import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addBidTransaction } from '../../transactions/actions/add-bid-transaction';

export function processBuy(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!limitPrice || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or total "${totalEthWithFee}"`
			}));
		}

		// we track filled shares again here to keep track of the full total through the recursiveness of trading
		let filledShares = ZERO;

		dispatch(updateExistingTransaction(transactionID, {
			status: 'starting...',
			message: `buying ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
			totalCost: formatEtherEstimate(totalEthWithFee),
			tradingFees: formatEtherEstimate(tradingFeesEth),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));

		const { loginAccount } = getState();

		tradeRecursively(marketID, outcomeID, 0, totalEthWithFee, loginAccount.id, () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.id),
			(data) => {
				const update = { status: `${data.status} buy...` };
				if (data.hash) update.hash = data.hash;
				if (data.timestamp) update.timestamp = data.timestamp;
				if (data.tradingFees) update.tradingFees = formatEther(data.tradingFees);
				if (data.gasFees) update.gasFees = formatRealEther(data.gasFees);
				dispatch(updateExistingTransaction(transactionID, update));
			},
			(res) => {
				// update user's position
				dispatch(loadAccountTrades(marketID));

				filledShares = filledShares.plus(abi.bignum(res.filledShares));
				const filledEth = abi.bignum(totalEthWithFee).minus(abi.bignum(res.remainingEth));
				const pricePerShare = filledShares.dividedBy(filledEth);

				dispatch(updateExistingTransaction(transactionID, {
					hash: res.hash,
					timestamp: res.timestamp,
					status: 'filling...',
					message: `bought ${formatShares(filledShares).full} for ${formatEther(pricePerShare).full} each`,
					totalCost: formatEther(filledEth),
					tradingFees: formatEther(res.tradingFees),
					gasFees: formatRealEther(res.gasFees)
				}));
			},
			(err, res) => {
				dispatch(updateTradeCommitLock(false));
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, {
						status: FAILED,
						message: err.message
					}));
				}

				// update user's position
				dispatch(loadAccountTrades(marketID));

				filledShares = filledShares.plus(abi.bignum(res.filledShares));
				const filledEth = abi.bignum(totalEthWithFee).minus(abi.bignum(res.remainingEth));
				const pricePerShare = filledShares.dividedBy(filledEth);

				dispatch(updateExistingTransaction(transactionID, {
					hash: res.hash,
					timestamp: res.timestamp,
					status: SUCCESS,
					message: `bought ${formatShares(filledShares).full} for ${formatEther(pricePerShare).full}`,
					totalCost: formatEther(filledEth),
					tradingFees: formatEther(res.tradingFees),
					gasFees: formatRealEther(res.gasFees)
				}));

				const sharesRemaining = abi.bignum(numShares).minus(filledShares).toNumber();
				if (sharesRemaining > 0 && res.remainingEth > 0) {
					const transactionData = getState().transactionsData[transactionID];

					dispatch(addBidTransaction(
						transactionData.data.marketID,
						transactionData.data.outcomeID,
						transactionData.data.marketDescription,
						transactionData.data.outcomeName,
						sharesRemaining,
						limitPrice,
						res.remainingEth,
						tradingFeesEth,
						transactionData.feePercent.value,
						gasFeesRealEth));
				}
			}
		);
	};
}
