import * as AugurJS from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `Invalid limit price "${limitPrice}" or shares "${numShares}"` }));
		}

		let message = generateMessage(numShares, numShares);

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message }));

		trade(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, getState, dispatch,
			(res) => dispatch(updateExistingTransaction(
				transactionID,
				{ status: 'filling...', message: generateMessage(numShares, res.remainingShares) }
			)),
			(err, res) => {
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}

				message = generateMessage(numShares, res.remainingShares);

				if (!res.remainingShares) {
					return dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message }));
				}

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

	return `filled ${formatShares(filledShares).full} of ${formatShares(numShares).full}`;
}

function trade(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, getState, dispatch, cbFill, cb) {
	const res = {
		remainingEth: totalEthWithFee,
		remainingShares: numShares
	};

	const matchingSortedBidIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().marketOrderBooks);

	if (!matchingSortedBidIDs.length) {
		return cb(null, res);
	}
console.log('!!!!', 0, numShares, matchingSortedBidIDs);
	AugurJS.trade({
		max_value: 0,
		max_amount: numShares,
		trade_ids: matchingSortedBidIDs,

		onTradeHash: data => dispatch(updateExistingTransaction(transactionID, { status: 'submitting sell...' })),
		onCommitSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'committing sell...' })),
		onCommitSuccess: data => dispatch(updateExistingTransaction(transactionID, { status: 'sending sell...' })),

		onCommitConfirmed: data => console.log('trade-onCommitConfirmed', data),
		onCommitFailed: cb,

		onNextBlock: data => console.log('trade-onNextBlock', data),
		onTradeSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'filling sell...' })),
		onTradeSuccess: data => {
			res.remainingEth = parseFloat(data.unmatchedCash) || 0;
			res.remainingShares = parseFloat(data.unmatchedShares) || 0;
console.log('##', res);
			if (res.remainingShares) {
				cbFill(res);
				return trade(transactionID, marketID, outcomeID, res.remainingShares, limitPrice, res.remainingEth, getState, dispatch, cbFill, cb);
			}
			return cb(null, res);
		},

		onTradeFailed: cb,
		onTradeConfirmed: data => console.log('trade-onTradeConfirmed', data)
	});
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
