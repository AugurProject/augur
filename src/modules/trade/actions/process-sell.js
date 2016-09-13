import BigNumber from 'bignumber.js';
import { formatEther, formatShares, formatRealEther, formatEtherEstimate, formatRealEtherEstimate } from '../../../utils/format-number';
import { augur, abi, constants } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { addAskTransaction } from '../../transactions/actions/add-ask-transaction';
import { addShortAskTransaction } from '../../transactions/actions/add-short-ask-transaction';
import { addShortSellTransaction } from '../../transactions/actions/add-short-sell-transaction';

export function processSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, tradingFeesEth, gasFeesRealEth) {
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
			message: `selling ${formatShares(numShares).full} for ${formatEtherEstimate(limitPrice).full} each`,
			totalReturn: formatEtherEstimate(totalEthWithFee),
			tradingFees: formatEtherEstimate(tradingFeesEth),
			gasFees: formatRealEtherEstimate(gasFeesRealEth)
		}));

		const { loginAccount } = getState();

		tradeRecursively(marketID, outcomeID, numShares, 0, loginAccount.id, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.id),
			(data) => {
				const update = { status: `${data.status} sell...` };
				if (data.hash) update.hash = data.hash;
				if (data.timestamp) update.timestamp = data.timestamp;
				if (data.tradingFees) update.tradingFees = formatEther(data.tradingFees);
				if (data.gasFees) update.gasFees = formatRealEther(data.gasFees);
				dispatch(updateExistingTransaction(transactionID, update));
			},
			(res) => {
				filledEth = filledEth.plus(res.filledEth);
				const filledShares = abi.bignum(numShares).minus(abi.bignum(res.remainingShares));
				const pricePerShare = filledShares.dividedBy(filledEth);
				const update = {
					hash: res.hash,
					timestamp: res.timestamp,
					status: 'filling...',
					message: `sold ${formatShares(filledShares).full} for ${formatEther(pricePerShare).full} each`,
					totalReturn: formatEther(filledEth),
					gasFees: formatRealEther(res.gasFees)
				};
				if (res.tradingFees) update.tradingfees = formatEther(res.tradingFees);
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

				// update user's position
				dispatch(loadAccountTrades(marketID));

				filledEth = filledEth.plus(abi.bignum(res.filledEth));
				const filledShares = abi.bignum(numShares).minus(abi.bignum(res.remainingShares));
				const pricePerShare = filledShares.dividedBy(filledEth);

				dispatch(updateExistingTransaction(transactionID, {
					hash: res.hash,
					timestamp: res.timestamp,
					status: SUCCESS,
					message: `sold ${formatShares(filledShares).full} for ${formatEther(pricePerShare).full} each`,
					totalReturn: formatEther(filledEth),
					tradingFees: formatEther(res.tradingFees),
					gasFees: formatRealEther(res.gasFees)
				}));

				if (res.remainingShares > 0) {
					augur.getParticipantSharesPurchased(marketID, loginAccount.id, outcomeID, (sharesPurchased) => {
						const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
						const transactionData = getState().transactionsData[transactionID];
						const remainingShares = abi.bignum(res.remainingShares);
						if (position.gt(ZERO)) {
							let askShares;
							let shortAskShares;
							if (position.gt(remainingShares)) {
								if (position.minus(remainingShares).lt(constants.PRECISION.limit)) {
									askShares = position.toNumber();
								} else {
									askShares = remainingShares.round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
								}
								shortAskShares = 0;
							} else {
								askShares = position.toNumber();
								shortAskShares = remainingShares.minus(position).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN).toNumber();
							}
							dispatch(addAskTransaction(
								transactionData.data.marketID,
								transactionData.data.outcomeID,
								transactionData.data.marketDescription,
								transactionData.data.outcomeName,
								askShares,
								limitPrice,
								totalEthWithFee,
								tradingFeesEth,
								transactionData.feePercent.value,
								gasFeesRealEth));
							if (shortAskShares > 0) {
								dispatch(addShortAskTransaction(
									transactionData.data.marketID,
									transactionData.data.outcomeID,
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
							dispatch(loadBidsAsks(marketID, (updatedOrderBook) => {
								const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, { [marketID]: updatedOrderBook }, loginAccount.id);
								if (tradeIDs && tradeIDs.length) {
									dispatch(updateTradeCommitLock(true));
									dispatch(addShortSellTransaction(
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
								} else {
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
							}));
						}
					});
				}
			}
		);
	};
}
