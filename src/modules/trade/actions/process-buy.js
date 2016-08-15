import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';

import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addBidTransaction } from '../../transactions/actions/add-bid-transaction';

export function processBuy(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or total "${totalEthWithFee}"` }));
		}

		const { loginAccount } = getState();

		// we track filled shares again here to keep track of the full total through the recursiveness of trading
		let filledShares = 0;

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message: `buying ${formatShares(numShares).full} @ ${formatEther(limitPrice).full}` }));

		tradeRecursively(marketID, outcomeID, 0, totalEthWithFee, loginAccount.id, () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().loginAccount.id, getState().orderBooks),
			(status) => dispatch(updateExistingTransaction(transactionID, { status: `${status} buy...` })),
			(res) => {
				filledShares += parseFloat(res.filledShares);

				// update user's position
				dispatch(loadAccountTrades());

				dispatch(updateExistingTransaction(transactionID, { status: 'filling...', message: generateMessage(totalEthWithFee, res.remainingEth, filledShares) }));
			},
			(err, res) => {
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}

				// update user's position
				dispatch(loadAccountTrades());

				filledShares += parseFloat(res.filledShares);

				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: generateMessage(totalEthWithFee, res.remainingEth, filledShares) }));

				if (res.remainingEth) {
					const transactionData = getState().transactionsData[transactionID];

					dispatch(addBidTransaction(
						transactionData.data.marketID,
						transactionData.data.outcomeID,
						transactionData.data.marketDescription,
						transactionData.data.outcomeName,
						numShares - filledShares,
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
