import { augur } from '../../../services/augurjs';
import { formatEther, formatShares } from '../../../utils/format-number';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';

import { tradeRecursively } from '../../trade/actions/helpers/trade-recursively';
import { calculateSellTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `invalid limit price "${limitPrice}" or shares "${numShares}"` }));
		}

		const { loginAccount } = getState();

		const messages = [];

		// we track filled eth here as well to take into account the recursiveness of trading
		let filledEth = 0;

		messages[0] = `selling ${formatShares(numShares).full} @ ${formatEther(limitPrice).full}`;

		dispatch(updateExistingTransaction(transactionID, { status: 'starting...', message: messages.join(', ') }));

		tradeRecursively(marketID, outcomeID, numShares, 0, loginAccount.id, () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, getState().loginAccount.id, getState().orderBooks),
			(status) => dispatch(updateExistingTransaction(transactionID, { status: `${status} sell...` })),
			(res) => {
				filledEth += parseFloat(res.filledEth);
				messages[0] = `sold ${formatShares(numShares - res.remainingShares).full} for ${formatEther(filledEth).full} (fees incl.)`;

				dispatch(loadAccountTrades());
				dispatch(updateExistingTransaction(transactionID, { status: 'filling...', message: messages.join(', ') }));
			},
			(err, res) => {
				if (err) {
					return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}

				// update user's position
				dispatch(loadAccountTrades());

				filledEth += parseFloat(res.filledEth);
				messages[0] = `sold ${formatShares(numShares - res.remainingShares).full} for ${formatEther(filledEth).full} (fees incl.)`;

				if (!res.remainingShares) {
					dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: messages.join(', ') }));
				} else {
					const askNumShares = formatShares(res.remainingShares);
					let askMessageIndex = 1;
					if (!filledEth) {
						askMessageIndex = 0;
					}
					messages[askMessageIndex] = `asking ${askNumShares.full} @ ${limitPrice} eth`;
					dispatch(updateExistingTransaction(transactionID, { status: 'placing ask...', message: messages.join(', ') }));

					augur.sell({
						market: marketID,
						outcome: outcomeID,
						amount: res.remainingShares,
						price: limitPrice,

						onSent: data => console.log('ask onSent', data),
						onFailed: err => {
							messages[askMessageIndex] = err.message;
							dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: messages.join(', ') }));
						},
						onSuccess: data => {
							messages[askMessageIndex] = `asked ${askNumShares.full} for ${formatEther(res.remainingShares * limitPrice).full}`;
							dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: messages.join(', ') }));
						}
					});
				}
			}
		);
	};
}
