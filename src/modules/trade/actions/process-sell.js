import { formatEther, formatShares, formatRealEther } from '../../../utils/format-number';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addAskTransaction } from '../../transactions/actions/add-ask-transaction';
import { addShortAskTransaction } from '../../transactions/actions/add-short-ask-transaction';
import { selectMarket } from '../../market/selectors/market';

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
			message: `selling ${formatShares(numShares).full} for ${formatEther(limitPrice).full}<br />
				paying ${formatEther(tradingFeesEth).full} in trading fees<br />
				<small>(+${formatRealEther(gasFeesRealEth).full} in estimated gas fees)</small>`
		}));

		const { loginAccount } = getState();

		tradeRecursively(marketID, outcomeID, numShares, 0, loginAccount.id, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.id),
			(data) => {
				const update = { status: `${data.status} sell...` };
				if (data.hash) update.hash = data.hash;
				dispatch(updateExistingTransaction(transactionID, update));
			},
			(res) => {
				filledEth = filledEth.plus(res.filledEth);
				dispatch(updateExistingTransaction(transactionID, {
					status: 'filling...',
					message: generateMessage(numShares, res.remainingShares, filledEth)
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
				dispatch(loadAccountTrades());

				filledEth = filledEth.plus(abi.bignum(res.filledEth));

				dispatch(updateExistingTransaction(transactionID, {
					status: SUCCESS,
					message: generateMessage(numShares, res.remainingShares, filledEth, res.tradingFeesEth, res.gasFeesRealEth)
				}));

				if (res.remainingShares > 0) {
					const market = selectMarket(marketID);
					let position = 0;
					if (market.myPositionOutcomes) {
						const numPositions = market.myPositionOutcomes.length;
						for (let i = 0; i < numPositions; ++i) {
							if (market.myPositionOutcomes[i].id === outcomeID) {
								position = market.myPositionOutcomes[i].position.qtyShares;
								break;
							}
						}
					}
					console.log('sell complete! current position:', position);
					const transactionData = getState().transactionsData[transactionID];
					if (position > 0) {
						dispatch(addAskTransaction(
							transactionData.data.marketID,
							transactionData.data.marketLink,
							transactionData.data.outcomeID,
							transactionData.data.marketDescription,
							transactionData.data.outcomeName,
							res.remainingShares,
							limitPrice,
							totalEthWithFee,
							tradingFeesEth,
							gasFeesRealEth));
					} else {
						dispatch(addShortAskTransaction(
							transactionData.data.marketID,
							transactionData.data.marketLink,
							transactionData.data.outcomeID,
							transactionData.data.marketDescription,
							transactionData.data.outcomeName,
							res.remainingShares,
							limitPrice,
							totalEthWithFee,
							tradingFeesEth,
							gasFeesRealEth));
					}
				}
			}
		);
	};
}

function generateMessage(numShares, remainingShares, filledEth, tradingFeesEth, gasFeesRealEth) {
	const filledShares = abi.bignum(numShares).minus(abi.bignum(remainingShares));
	return `sold ${formatShares(filledShares).full} for ${formatEther(filledEth).full}<br />
		paid ${formatEther(tradingFeesEth).full} in trading fees<br />
		<small>(+${formatRealEther(gasFeesRealEth).full} in gas fees)</small>`;
}
