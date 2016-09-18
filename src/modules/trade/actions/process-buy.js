import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { abi, constants } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { trade } from '../../trade/actions/helpers/trade';
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
		dispatch(updateExistingTransaction(transactionID, {
			status: 'starting...',
			message: `buying ${formatShares(numShares).full} for ${formatEther(limitPrice).full} each`,
			totalCost: formatEtherEstimate(totalEthWithFee),
			tradingFees: formatEtherEstimate(tradingFeesEth),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));
		const { loginAccount } = getState();
		trade(marketID, outcomeID, 0, totalEthWithFee, loginAccount.id, () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.id),
			(res) => {
				const update = { status: `${res.status} buy` };
				if (res.hash) update.hash = res.hash;
				if (res.timestamp) update.timestamp = res.timestamp;
				if (res.tradingFees) update.tradingFees = formatEther(res.tradingFees);
				if (res.gasFees) update.gasFees = formatRealEther(res.gasFees);
				if (res.remainingEth && res.filledShares) {
					const filledEth = abi.bignum(totalEthWithFee).minus(res.remainingEth);
					const pricePerShare = filledEth.dividedBy(res.filledShares);
					update.message = `bought ${formatShares(res.filledShares).formatted} of ${formatShares(numShares).full} for ${formatEther(pricePerShare).full} each`;
					update.totalCost = formatEther(filledEth);
				}
				dispatch(updateExistingTransaction(transactionID, update));
			},
			(err, res) => {
				dispatch(updateTradeCommitLock(false));
				if (err) {
					console.log('trade failed:', err);
					return dispatch(updateExistingTransaction(transactionID, {
						status: FAILED,
						message: err.message
					}));
				}
				dispatch(loadAccountTrades(marketID)); // update user's position
				const filledEth = abi.bignum(totalEthWithFee).minus(res.remainingEth);
				const pricePerShare = filledEth.dividedBy(res.filledShares);
				dispatch(updateExistingTransaction(transactionID, {
					status: SUCCESS,
					message: `bought ${formatShares(res.filledShares).full} for ${formatEther(pricePerShare).full} each`,
					totalCost: formatEther(filledEth),
					tradingFees: formatEther(res.tradingFees),
					gasFees: formatRealEther(res.gasFees)
				}));
				const sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
				if (sharesRemaining.gt(ZERO) && res.remainingEth.gt(ZERO)) {
					console.debug('buy remainder:', sharesRemaining.toFixed(), 'shares remaining,', res.remainingEth.toFixed(), 'cash remaining', constants.PRECISION.limit.toFixed(), 'precision limit');
					if (sharesRemaining.gte(constants.PRECISION.limit) && res.remainingEth.gte(constants.PRECISION.limit)) {
						const transactionData = getState().transactionsData[transactionID];
						dispatch(addBidTransaction(
							transactionData.data.marketID,
							transactionData.data.outcomeID,
							transactionData.data.marketDescription,
							transactionData.data.outcomeName,
							sharesRemaining.toNumber(),
							limitPrice,
							res.remainingEth,
							tradingFeesEth,
							transactionData.feePercent.value,
							gasFeesRealEth));
					}
				}
			}
		);
	};
}
