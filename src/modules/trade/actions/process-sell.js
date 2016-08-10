import * as AugurJS from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';

import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addAskTransaction } from '../../transactions/actions/add-bid-transaction';

export function processSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or shares "${numShares}"` }));
		}

		// we track filled eth here as well to take into account the recursiveness of trading
		let filledEth = 0;

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message: `selling ${formatShares(numShares).full} @ ${formatEther(limitPrice).full}` }));

		tradeRecursively(marketID, outcomeID, numShares, 0, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().marketOrderBooks),
			(status) => dispatch(updateExistingTransaction(transactionID, { status: `${status} sell...` })),
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

					dispatch(addAskTransaction(
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
	return `sold ${formatShares(filledShares).full} for ${formatEther(filledEth).full} (fees incl.)`;
}

function ask(transactionID, marketID, outcomeID, limitPrice, totalShares, cb) {
	AugurJS.sell({
		amount: totalShares,
		price: limitPrice,
		market: marketID,
		outcome: outcomeID,

		onSent: data => console.log('ask onSent', data),
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
