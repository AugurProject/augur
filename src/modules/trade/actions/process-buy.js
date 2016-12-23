import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { abi, constants } from '../../../services/augurjs';
import { FAILED } from '../../transactions/constants/statuses';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { trade } from '../../trade/actions/helpers/trade';
import { calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';
import { addBidTransaction } from '../../transactions/actions/add-bid-transaction';

export function processBuy(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!transactionID) return console.error('processBuy has failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
		if (!limitPrice || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or total "${totalEthWithFee}"`
			}));
		}
		if (!marketID || !outcomeID || !totalEthWithFee || !numShares || !tradingFeesEth || !gasFeesRealEth) {
			console.error('processBuy has failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: 'There was an issue processing the buy trade.'
			}));
		}
		const avgPrice = abi.bignum(totalEthWithFee).dividedBy(abi.bignum(numShares));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'starting...',
			message: `buying ${formatShares(numShares).full} for ${formatEther(avgPrice).full}/share`,
			totalCost: formatEtherEstimate(totalEthWithFee),
			tradingFees: formatEtherEstimate(tradingFeesEth),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));
		const { loginAccount } = getState();
		trade(marketID, outcomeID, 0, totalEthWithFee, loginAccount.address, () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.address),
			dispatch,
			(res) => {
				const update = { status: `${res.status} buy` };
				if (res.hash) update.hash = res.hash;
				if (res.timestamp) update.timestamp = res.timestamp;
				if (res.tradingFees) update.tradingFees = formatEther(res.tradingFees);
				if (res.gasFees) update.gasFees = formatRealEther(res.gasFees);
				if (res.remainingEth && res.filledShares) {
					const filledEth = abi.bignum(totalEthWithFee).minus(res.remainingEth);
					const pricePerShare = filledEth.dividedBy(res.filledShares);
					update.message = `bought ${formatShares(res.filledShares).formatted} of ${formatShares(numShares).full} for ${formatEther(pricePerShare).full}/share`;
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
				const filledEth = abi.bignum(totalEthWithFee).minus(res.remainingEth);
				const pricePerShare = filledEth.dividedBy(res.filledShares);
				dispatch(updateExistingTransaction(transactionID, {
					status: 'updating position',
					message: `bought ${formatShares(res.filledShares).full} for ${formatEther(pricePerShare).full}/share`,
					totalCost: formatEther(filledEth),
					tradingFees: formatEther(res.tradingFees),
					gasFees: formatRealEther(res.gasFees)
				}));
				const sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
				if (sharesRemaining.gt(constants.PRECISION.zero) && res.remainingEth.gt(constants.PRECISION.zero)) {
					console.debug('buy remainder:', sharesRemaining.toFixed(), 'shares remaining,', res.remainingEth.toFixed(), 'cash remaining', constants.PRECISION.limit.toFixed(), 'precision limit');
					if (sharesRemaining.gte(constants.PRECISION.limit) && res.remainingEth.gte(constants.PRECISION.limit)) {
						const transactionData = getState().transactionsData[transactionID];
						dispatch(addBidTransaction(
							transactionData.data.marketID,
							transactionData.data.outcomeID,
							transactionData.data.marketType,
							transactionData.data.marketDescription,
							transactionData.data.outcomeName,
							sharesRemaining.toFixed(),
							limitPrice,
							res.remainingEth,
							tradingFeesEth,
							transactionData.feePercent.value,
							gasFeesRealEth));
					}
				}
				dispatch(loadAccountTrades(marketID, () => {
					dispatch(loadBidsAsks(marketID, () => {
						dispatch(deleteTransaction(transactionID));
					}));
				}));
			}
		);
	};
}
