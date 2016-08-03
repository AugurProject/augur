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

		let message = generateMessage(totalEthWithFee, totalEthWithFee);

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message }));

		tradeRecursively(marketID, outcomeID, 0, totalEthWithFee,
			() => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().marketOrderBooks),
			(status) => dispatch(updateExistingTransaction(transactionID, { status: `${status} buy...` })),
			(res) => dispatch(updateExistingTransaction(
				transactionID,
				{ status: 'filling...', message: generateMessage(totalEthWithFee, res.remainingEth) }
			)),
			(err, res) => {
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}

				dispatch(loadAccountTrades());

				message = generateMessage(totalEthWithFee, res.remainingEth);

				if (!res.remainingEth) {
					return dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message }));
				}

				if (message) {
					message = `${message}, bid `;
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

function generateMessage(totalEthWithFee, remainingEth) {
	// const filledShares = numShares - remainingShares;
	const filledEth = totalEthWithFee - remainingEth;
	// const filledAvgPrice = Math.round(filledShares / filledEth * 100) / 100;

	return `filled ${formatEther(filledEth).full} of ${formatEther(totalEthWithFee).full}`;
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
