import {
    SUCCESS,
    FAILED,
    GENERATING_ORDER_BOOK,
    COMPLETE_SET_BOUGHT,
    ORDER_BOOK_ORDER_COMPLETE,
    ORDER_BOOK_OUTCOME_COMPLETE
} from '../../transactions/constants/statuses';
import { ZERO } from '../../trade/constants/numbers';
import { formatRealEther } from '../../../utils/format-number';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addGenerateOrderBookTransaction } from '../../transactions/actions/add-generate-order-book-transaction';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';
import { updateSellCompleteSetsLock } from '../../my-positions/actions/update-account-trades-data';
import AugurJS, { abi } from '../../../services/augurjs';

const totalGasFees = {};

export function submitGenerateOrderBook(marketData) {
	return dispatch => dispatch(addGenerateOrderBookTransaction(marketData));
}

export function createOrderBook(transactionID, marketData) {
	return (dispatch) => {
		dispatch(updateExistingTransaction(transactionID, { status: GENERATING_ORDER_BOOK }));
		dispatch(updateSellCompleteSetsLock(marketData.id, true));
		AugurJS.generateOrderBook(marketData, (err, res) => {
			dispatch(handleGenerateOrderBookResponse(err, res, transactionID, marketData));
		});
	};
}

export function handleGenerateOrderBookResponse(err, res, transactionID, marketData) {
	return (dispatch) => {
		if (err) {
			dispatch(
				updateExistingTransaction(
					transactionID,
					{ status: FAILED, message: err.message }
				)
			);

			return;
		}

		const p = res.payload;
		if (!totalGasFees[transactionID]) totalGasFees[transactionID] = ZERO;
		if (p && p.gasFees) {
			totalGasFees[transactionID] = totalGasFees[transactionID].plus(abi.bignum(p.gasFees));
		}
		const totalGasFeesMessage = formatRealEther(totalGasFees[transactionID]);
		let message = null;

		switch (res.status) {
			case COMPLETE_SET_BOUGHT:
				dispatch(updateExistingTransaction(transactionID, {
					status: COMPLETE_SET_BOUGHT,
					hash: p.hash,
					timestamp: p.timestamp,
					gasFees: totalGasFeesMessage,
					message
				}));
				break;
			case ORDER_BOOK_ORDER_COMPLETE:
				message = `${
					p.buyPrice ? 'Bid' : 'Ask'
					} for ${
					p.amount
					} share${
					p.amount > 1 ? 's' : ''
					} of outcome '${
					marketData.outcomes[p.outcome - 1].name
					}' at ${
					p.buyPrice || p.sellPrice
					} ETH created.`;

				dispatch(updateExistingTransaction(transactionID, {
					status: ORDER_BOOK_ORDER_COMPLETE,
					hash: p.hash,
					timestamp: p.timestamp,
					gasFees: totalGasFeesMessage,
					message
				}));

				break;
			case ORDER_BOOK_OUTCOME_COMPLETE:
				message = `Order book creation for outcome '${
					marketData.outcomes[p.outcome - 1].name
					}' completed.`;

				dispatch(updateExistingTransaction(transactionID, {
					status: ORDER_BOOK_OUTCOME_COMPLETE,
					gasFees: totalGasFeesMessage,
					message
				}));

				break;
			case SUCCESS:
				dispatch(updateExistingTransaction(transactionID, {
					status: SUCCESS,
					gasFees: totalGasFeesMessage,
					message
				}));

				if (marketData && marketData.id) {
					dispatch(loadBidsAsks(marketData.id));
					dispatch(loadAccountTrades(marketData.id, () => {
						dispatch(updateSellCompleteSetsLock(marketData.id, false));
					}));
				}

				break;
			default:
				break;
		}
	};
}
