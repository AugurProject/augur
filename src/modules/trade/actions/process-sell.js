import * as AugurJS from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadAccountTrades } from '../../positions/actions/load-account-trades';

import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or shares "${numShares}"` }));
		}

		let tradeComplete = false;
		let message = generateMessage(numShares, numShares);

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message }));

		tradeRecursively(marketID, outcomeID, numShares, 0,
			() => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().marketOrderBooks),
			(status) => dispatch(updateExistingTransaction(transactionID, { status: `${status} sell...` })),
			(res) => {
				dispatch(updateExistingTransaction(transactionID, { status: 'filling...', message: generateMessage(numShares, res.remainingShares) }));
				dispatch(loadAccountTrades());
			},
			(err, res) => {
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}

				dispatch(loadAccountTrades());

				message = generateMessage(numShares, res.remainingShares);

				if (!res.remainingShares || tradeComplete) {
					return dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message }));
				}

				tradeComplete = true;

				if (message) {
					message = `${message}, ask `;
				}
				message = `${message}${formatShares(res.remainingShares).full} @ ${formatEther(limitPrice).full}`;

				dispatch(updateExistingTransaction(transactionID, { status: 'placing ask...', message }));

				ask(transactionID, marketID, outcomeID, limitPrice, res.remainingShares, (err, res) => {
					if (err) {
						return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
					}
					return dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message }));
				});
			}
		);
	};
}

function generateMessage(numShares, remainingShares) {
	// const filledShares = numShares - remainingShares;
	const filledShares = numShares - remainingShares;
	// const filledAvgPrice = Math.round(filledShares / filledEth * 100) / 100;

	return `sold ${formatShares(filledShares).full} of ${formatShares(numShares).full}`;
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
