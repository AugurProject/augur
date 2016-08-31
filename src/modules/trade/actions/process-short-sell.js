import { formatEther, formatShares, formatRealEther } from '../../../utils/format-number';
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
			message: `short selling ${formatShares(numShares).full} for ${formatEther(limitPrice).full}<br />
				paying ${formatEther(tradingFeesEth).full} in trading fees<br />
				total cost: ${formatEther(totalEthWithFee).full} (+${formatRealEther(gasFeesRealEth).full} in estimated gas fees)`
		}));

		const { loginAccount } = getState();

		shortSell(marketID, outcomeID, numShares, loginAccount.id, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.id),
			(data) => {
				const update = { status: `${data.status} short sell...` };
				if (data.hash) update.hash = data.hash;
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
				dispatch(loadAccountTrades());

				filledEth = filledEth.plus(res.filledEth);

				dispatch(updateExistingTransaction(transactionID, {
					status: SUCCESS,
					message: generateMessage(numShares, res.remainingShares, filledEth, res.tradingFees, res.gasFees)
				}));

				if (res.remainingShares > 0) {
					const transactionData = getState().transactionsData[transactionID];

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
		);
	};
}

function generateMessage(numShares, remainingShares, filledEth, tradingFeesEth, gasFeesRealEth) {
	const filledShares = abi.bignum(numShares).minus(abi.bignum(remainingShares));
	const totalEthWithFee = abi.bignum(filledEth).plus(tradingFeesEth);
	return `short sold ${formatShares(filledShares).full} for ${formatEther(filledEth).full}<br />
		paid ${formatEther(tradingFeesEth).full} in trading fees<br />
		total cost: ${formatEther(totalEthWithFee).full} (+${formatRealEther(gasFeesRealEth).full} in gas fees)`;
}
