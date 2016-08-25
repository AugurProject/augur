import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';

import { shortSellRecursively } from '../../trade/actions/helpers/short-sell-recursively';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addShortSellRiskyTransaction } from '../../transactions/actions/add-short-sell-risky-transaction';

export function processShortSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or shares "${numShares}"` }));
		}

		// we track filled eth here as well to take into account the recursiveness of trading
		let filledEth = 0;

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message: `short selling ${formatShares(numShares).full} @ ${formatEther(limitPrice).full}` }));

		const { loginAccount } = getState();

		shortSellRecursively(marketID, outcomeID, numShares, loginAccount.id, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().orderBooks, loginAccount.id),
			(data) => {
				const update = { status: `${data.status} short sell...` };
				if (data.hash) update.hash = data.hash;
				dispatch(updateExistingTransaction(transactionID, update));
			},
			(res) => {
				filledEth += parseFloat(res.filledEth);
				dispatch(updateExistingTransaction(transactionID, { status: 'filling...', message: generateMessage(numShares, res.remainingShares, filledEth) }));
			},
			(err, res) => {
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}

				// update user's position
				dispatch(loadAccountTrades());

				filledEth += parseFloat(res.filledEth);

				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: generateMessage(numShares, res.remainingShares, filledEth) }));

				if (res.remainingEth) {
					const transactionData = getState().transactionsData[transactionID];

					dispatch(addShortSellRiskyTransaction(
						transactionData.data.marketID,
						transactionData.data.outcomeID,
						transactionData.data.marketDescription,
						transactionData.data.outcomeName,
						res.remainingShares,
						limitPrice));
				}
			}
		);
	};
}

function generateMessage(numShares, remainingShares, filledEth) {
	const filledShares = numShares - remainingShares;
	return `short sold ${formatShares(filledShares).full} for ${formatEther(filledEth).full} (fees incl.)`;
}
