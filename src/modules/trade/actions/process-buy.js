import * as AugurJS from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadAccountTrades } from '../../positions/actions/load-account-trades';

import { calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processBuy(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `Invalid limit price "${limitPrice}" or total "${totalEthWithFee}"` }));
		}

		let message = generateMessage(totalEthWithFee, totalEthWithFee);

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message }));

		trade(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, getState, dispatch,
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

function trade(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee, getState, dispatch, cbFill, cb) {
	const res = {
		remainingEth: totalEthWithFee,
		remainingShares: numShares
	};

	const matchingSortedAskIDs = calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().marketOrderBooks);

	if (!matchingSortedAskIDs.length) {
		return cb(null, res);
	}

	AugurJS.trade({
		max_value: totalEthWithFee,
		max_amount: 0,
		trade_ids: matchingSortedAskIDs,

		onTradeHash: data => dispatch(updateExistingTransaction(transactionID, { status: 'submitting buy...' })),
		onCommitSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'committing buy...' })),
		onCommitSuccess: data => dispatch(updateExistingTransaction(transactionID, { status: 'sending buy...' })),

		onCommitConfirmed: data => console.log('trade-onCommitConfirmed', data),
		onCommitFailed: cb,

		onNextBlock: data => console.log('trade-onNextBlock', data),
		onTradeSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'filling buy...' })),
		onTradeSuccess: data => {
			res.remainingEth = parseFloat(data.unmatchedCash) || 0;
			res.remainingShares = parseFloat(data.unmatchedShares) || 0;

			if (res.remainingEth) {
				cbFill(res);
				return trade(transactionID, marketID, outcomeID, res.remainingShares, limitPrice, res.remainingEth, getState, dispatch, cbFill, cb);
			}
			return cb(null, res);
		},

		onTradeFailed: cb,
		onTradeConfirmed: data => console.log('trade-onTradeConfirmed', data)
	});
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
