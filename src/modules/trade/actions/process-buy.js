import * as AugurJS from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadAccountTrades } from '../../positions/actions/load-account-trades';

import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processBuy(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `Invalid limit price "${limitPrice}" or total "${totalEthWithFee}"` }));
		}

		let tradeComplete = false;
		let message = generateMessage(totalEthWithFee, totalEthWithFee, 0);

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message }));

		tradeRecursively(marketID, outcomeID, numShares, totalEthWithFee,
			() => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().marketOrderBooks),
			(status) => dispatch(updateExistingTransaction(transactionID, { status: `${status} buy...` })),
			(res) => dispatch(updateExistingTransaction(
				transactionID,
				{ status: 'filling...', message: generateMessage(totalEthWithFee, res.remainingEth, res.filledShares) }
			)),
			(err, res) => {
				if (tradeComplete) {
					return dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
				}

				tradeComplete = true;

				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `${message} - ${err.message}` }));
				}

				dispatch(loadAccountTrades());

				message = generateMessage(totalEthWithFee, res.remainingEth, res.filledShares);

				if (!res.remainingEth) {
					return dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message }));
				}

				if (message) {
					message = `${message}, BID `;
				}
				message = `${message}${formatShares(res.remainingEth / limitPrice).full} @ ${formatEther(limitPrice).full}`;

				dispatch(updateExistingTransaction(transactionID, { status: 'placing bid...', message }));

				bid(transactionID, marketID, outcomeID, limitPrice, res.remainingEth, (err, res) => {
					if (err) {
						return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
					}
					return dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message }));
				});
			}
		);
	};
}

function generateMessage(totalEthWithFee, remainingEth, filledShares) {
	const filledEth = totalEthWithFee - remainingEth;
	const filledAvgPrice = Math.round(filledEth / filledShares * 100) / 100;
	return `BOT ${formatShares(filledShares).full} @ ${formatEther(filledAvgPrice).full}`;
}


function bid(transactionID, marketID, outcomeID, limitPrice, totalEthWithFee, cb) {
	AugurJS.buy({
		amount: totalEthWithFee,
		price: limitPrice,
		market: marketID,
		outcome: outcomeID,

		onSent: data => console.log('bid onSent', data),
		onFailed: cb,
		onSuccess: data => cb(null, data)
	});
}
