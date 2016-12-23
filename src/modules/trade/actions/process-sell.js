import BigNumber from 'bignumber.js';
import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { augur, abi, constants } from '../../../services/augurjs';
import { FAILED } from '../../transactions/constants/statuses';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { trade } from '../../trade/actions/helpers/trade';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { addAskTransaction } from '../../transactions/actions/add-ask-transaction';
import { addShortAskTransaction } from '../../transactions/actions/add-short-ask-transaction';
import { addShortSellTransaction } from '../../transactions/actions/add-short-sell-transaction';

export function processSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
	return (dispatch, getState) => {
		if (!transactionID) return console.error('processSell has failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
		if (!limitPrice || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: `invalid limit price "${limitPrice}" or shares "${numShares}"`
			}));
		}
		if (!marketID || !outcomeID || !totalEthWithFee || !tradingFeesEth || !gasFeesRealEth) {
			console.error('processSell has failed:', transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth);
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: 'There was an issue processesing the Sell trade.'
			}));
		}
		const avgPrice = abi.bignum(totalEthWithFee).dividedBy(abi.bignum(numShares));
		dispatch(updateExistingTransaction(transactionID, {
			status: 'starting...',
			message: `selling ${formatShares(numShares).full} for ${formatEtherEstimate(avgPrice).full}/share`,
			totalReturn: formatEtherEstimate(totalEthWithFee),
			tradingFees: formatEtherEstimate(tradingFeesEth),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));
		const { loginAccount } = getState();
		trade(marketID, outcomeID, numShares, 0, loginAccount.address, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.address),
			dispatch,
			(res) => {
				const update = { status: `${res.status} sell` };
				if (res.hash) update.hash = res.hash;
				if (res.timestamp) update.timestamp = res.timestamp;
				if (res.tradingFees) update.tradingFees = formatEther(res.tradingFees);
				if (res.gasFees) update.gasFees = formatRealEther(res.gasFees);
				if (res.filledEth && res.remainingShares) {
					const filledShares = abi.bignum(numShares).minus(res.remainingShares);
					const pricePerShare = filledShares.dividedBy(res.filledEth);
					update.message = `sold ${formatShares(filledShares).formatted} of ${formatShares(numShares).full} for ${formatEther(pricePerShare).full}/share`;
					update.totalReturn = formatEther(res.filledEth);
				}
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
				const filledShares = abi.bignum(numShares).minus(res.remainingShares);
				const pricePerShare = res.filledEth.dividedBy(filledShares);
				dispatch(updateExistingTransaction(transactionID, {
					status: 'updating position',
					message: `sold ${formatShares(filledShares).full} for ${formatEther(pricePerShare).full}/share`,
					totalReturn: formatEther(res.filledEth),
					tradingFees: formatEther(res.tradingFees),
					gasFees: formatRealEther(res.gasFees)
				}));
				if (res.remainingShares.gt(constants.PRECISION.zero)) {
					augur.getParticipantSharesPurchased(marketID, loginAccount.address, outcomeID, (sharesPurchased) => {
						const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
						const transactionData = getState().transactionsData[transactionID];
						const remainingShares = abi.bignum(res.remainingShares);
						if (position.gt(constants.PRECISION.zero)) {
							let askShares;
							let shortAskShares;
							if (position.gt(remainingShares)) {
								askShares = remainingShares.round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
								shortAskShares = 0;
							} else {
								askShares = position.toFixed();
								shortAskShares = remainingShares.minus(position).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN).toFixed();
							}
							dispatch(addAskTransaction(
								transactionData.data.marketID,
								transactionData.data.outcomeID,
								transactionData.data.marketType,
								transactionData.data.marketDescription,
								transactionData.data.outcomeName,
								askShares,
								limitPrice,
								totalEthWithFee,
								tradingFeesEth,
								transactionData.feePercent.value,
								gasFeesRealEth));
							if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
								dispatch(addShortAskTransaction(
									transactionData.data.marketID,
									transactionData.data.outcomeID,
									transactionData.data.marketType,
									transactionData.data.marketDescription,
									transactionData.data.outcomeName,
									shortAskShares,
									limitPrice,
									totalEthWithFee,
									tradingFeesEth,
									transactionData.feePercent.value,
									gasFeesRealEth));
							}
						} else {
							dispatch(loadBidsAsks(marketID, (err, updatedOrderBook) => {
								if (err) console.error('loadBidsAsks:', err);
								const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, { [marketID]: updatedOrderBook }, loginAccount.address);
								if (tradeIDs && tradeIDs.length) {
									dispatch(updateTradeCommitLock(true));
									dispatch(addShortSellTransaction(
										transactionData.data.marketID,
										transactionData.data.outcomeID,
										transactionData.data.marketType,
										transactionData.data.marketDescription,
										transactionData.data.outcomeName,
										res.remainingShares,
										limitPrice,
										totalEthWithFee,
										tradingFeesEth,
										transactionData.feePercent.value,
										gasFeesRealEth));
								} else {
									dispatch(addShortAskTransaction(
										transactionData.data.marketID,
										transactionData.data.outcomeID,
										transactionData.data.marketType,
										transactionData.data.marketDescription,
										transactionData.data.outcomeName,
										res.remainingShares,
										limitPrice,
										totalEthWithFee,
										tradingFeesEth,
										transactionData.feePercent.value,
										gasFeesRealEth));
								}
							}));
						}
					});
				}
				dispatch(deleteTransaction(transactionID));
			}
		);
	};
}
