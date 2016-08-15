import { augur } from '../../../services/augurjs';

import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';

import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processBuy(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !totalEthWithFee) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or total "${totalEthWithFee}"` }));
		}

		const { loginAccount } = getState();

		const messages = [];

		// we track filled shares here to keep track of the full total through the recursiveness of trading
		let filledShares = 0;

		messages[0] = `buying ${formatShares(numShares).full} @ ${formatEther(limitPrice).full}`;

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message: messages.join(', ') }));

		tradeRecursively(marketID, outcomeID, 0, totalEthWithFee, loginAccount.id, () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, getState().loginAccount.id, getState().orderBooks),
			(status) => dispatch(updateExistingTransaction(transactionID, { status: `${status} buy...` })),
			(res) => {
				filledShares += parseFloat(res.filledShares);
				messages[0] = `bought ${formatShares(filledShares).full} for ${formatEther(totalEthWithFee - res.remainingEth).full} (fees incl.)`;

				dispatch(loadAccountTrades());
				dispatch(updateExistingTransaction(transactionID, { status: 'filling...', message: messages.join(', ') }));
			},
			(err, res) => {
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}

				// update user's position
				dispatch(loadAccountTrades());

				filledShares += parseFloat(res.filledShares);
				messages[0] = `bought ${formatShares(filledShares).full} for ${formatEther(totalEthWithFee - res.remainingEth).full} (fees incl.)`;

				if (!res.remainingEth) {
					dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: messages.join(', ') }));
				} else {
					const bidNumShares = formatShares(res.remainingEth / limitPrice);
					let bidMessageIndex = 1;
					if (!filledShares) {
						bidMessageIndex = 0;
					}
					messages[bidMessageIndex] = `bidding ${bidNumShares.full} @ ${limitPrice} eth`;
					dispatch(updateExistingTransaction(transactionID, { status: 'placing bid...', message: messages.join(', ') }));

					augur.buy({
						market: marketID,
						outcome: outcomeID,
						amount: res.remainingEth,
						price: limitPrice,

						onSent: data => console.log('bid onSent', data),
						onFailed: err => {
							messages[bidMessageIndex] = err.message;
							dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: messages.join(', ') }));
						},
						onSuccess: data => {
							messages[bidMessageIndex] = `bid ${bidNumShares.full} for ${formatEther(res.remainingEth).full}`;
							dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: messages.join(', ') }));
						}
					});
				}
			}
		);
	};
}
