import * as AugurJS from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../positions/actions/load-account-trades';

import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addBidTransaction } from '../../transactions/actions/add-bid-transaction';

export function processBuy(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or total "${totalEthWithFee}"` }));
		}

		// we track filled shares again here to take into account the recursiveness of trading
		const results = {
			filledShares: 0,
			tradeComplete: false
		};

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message: `buying ${formatShares(numShares).full} @ ${formatEther(limitPrice).full}` }));

		tradeRecursively(marketID, outcomeID, numShares, totalEthWithFee, () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().marketOrderBooks),
			(status) => dispatch(updateExistingTransaction(transactionID, { status: `${status} buy...` })),
			(res) => {
				results.filledShares += parseFloat(res.filledShares);
				dispatch(updateExistingTransaction(transactionID, { status: 'filling...', message: generateMessage(totalEthWithFee, res.remainingEth, results.filledShares) }));
			},
			(err, res) => {
				if (results.tradeComplete) {
					return;
				}

				results.tradeComplete = true;

				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}

				// update user's position
				dispatch(loadAccountTrades());

				results.filledShares += parseFloat(res.filledShares);

				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: generateMessage(totalEthWithFee, res.remainingEth, results.filledShares) }));

				if (res.remainingEth) {
					const transactionData = getState().transactionsData[transactionID];

					dispatch(addBidTransaction(
						transactionData.data.marketID,
						transactionData.data.outcomeID,
						transactionData.data.marketDescription,
						transactionData.data.outcomeName,
						numShares - results.filledShares,
						limitPrice,
						res.remainingEth));
				}
			}
		);
	};
}

function generateMessage(totalEthWithFee, remainingEth, filledShares) {
	const filledEth = totalEthWithFee - remainingEth;
	return `bought ${formatShares(filledShares).full} for ${formatEther(filledEth).full} (fees incl.)`;
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
