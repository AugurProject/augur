import * as AugurJS from '../../../services/augurjs';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processBuy(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `Invalid limit price "${limitPrice}" or total "${totalEthWithFee}"` }));
		}

		trade(transactionID, marketID, outcomeID, limitPrice, totalEthWithFee, getState, dispatch, (err, res) => {
			if (err) {
				dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				return;
			}
			if (!res.remainingEth) {
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: 'bot shares!' }));
				return;
			}

			bid(transactionID, marketID, outcomeID, limitPrice, totalEthWithFee, dispatch, (err, res) => {
				if (err) {
					dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
					return;
				}
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: 'bid shares!' }));
			});
		});
	};
}

function trade(transactionID, marketID, outcomeID, limitPrice, totalEthWithFee, getState, dispatch, cb) {
	const { marketOrderBooks } = getState();
	const marketOrderBookSells = marketOrderBooks[marketID] && marketOrderBooks[marketID].sell || {};

	let res = {
		remainingEth: totalEthWithFee,
		filledEth: 0,
		filledShares: 0
	};

	const matchingSortedAskIDs = Object.keys(marketOrderBookSells)
		.map(askID => marketOrderBookSells[askID])
		.filter(ask => ask.outcome === outcomeID && parseFloat(ask.price) <= limitPrice)
		.sort((order1, order2) => order1.price < order2.price ? -1 : 0)
		.map(ask => ask.id);

	if (!matchingSortedAskIDs.length) {
		return cb(null, res);
	}

	AugurJS.trade({
		max_value: totalEthWithFee,
		max_amount: 0,
		trade_ids: matchingSortedAskIDs,

		onTradeHash: data => dispatch(updateExistingTransaction(transactionID, { status: 'submitting...' })),
		onCommitSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'committing...' })),
		onCommitSuccess: data => dispatch(updateExistingTransaction(transactionID, { status: 'sending...' })),

		onCommitConfirmed: data => console.log('trade-onCommitConfirmed', data),
		onCommitFailed: cb,

		onNextBlock: data => console.log('trade-onNextBlock', data),
		onTradeSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'processing...' })),
		onTradeSuccess: data => {
			console.log('!!!!!!!!trade-success!!!', data);

			res.remainingEth -= Number(data.callReturn[1]) || 0;
			res.filledEth += totalEthWithFee - res.remainingEth;

			if (res.remainingEth) {
				trade(transactionID, marketID, outcomeID, limitPrice, res.remainingEth, getState, dispatch, cb);
			}
			else {
				return cb(null, res);
			}
		},

		onTradeFailed: cb,
		onTradeConfirmed: data => console.log('trade-onTradeConfirmed', data)
	});
}

function bid(transactionID, marketID, outcomeID, limitPrice, totalEthWithFee, dispatch, cb) {
	AugurJS.buy({
		amount: totalEthWithFee,
		price: limitPrice,
		market: marketID,
		outcome: outcomeID,

		onSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'sending bid...' })),
		onFailed: data => dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: data.message })),
		onSuccess: cb
	});
}
