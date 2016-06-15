import {
    SUCCESS,
    FAILED,
    GENERATING_ORDER_BOOK,
    COMPLETE_SET_BOUGHT,
    ORDER_BOOK_ORDER_COMPLETE,
    ORDER_BOOK_OUTCOME_COMPLETE
} from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { addGenerateOrderBookTransaction } from '../../transactions/actions/add-generate-order-book-transaction';
import AugurJS from '../../../services/augurjs';

export function submitGenerateOrderBook(marketData) {
	return dispatch => dispatch(addGenerateOrderBookTransaction(marketData));
}

export function createOrderBook(transactionID, marketData) {
	return dispatch => {
		dispatch(updateExistingTransaction(transactionID, { status: GENERATING_ORDER_BOOK }));

		AugurJS.generateOrderBook(marketData, (err, res) => {
			handleGenerateOrderBookResponse(err, res, transactionID, marketData);
		});
	};
}

export function handleGenerateOrderBookResponse(err, res, transactionID, marketData){
	return dispatch => {
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
		let message = null;

		switch (res.status) {
			case COMPLETE_SET_BOUGHT:
				dispatch(
					updateExistingTransaction(
						transactionID,
						{
							status: COMPLETE_SET_BOUGHT,
							message
						}
					)
				);

				break;
			case ORDER_BOOK_ORDER_COMPLETE:
				message = `${
					!!p.buyPrice ? 'Bid' : 'Ask'
					} for ${
					p.amount
					} share${
					p.amount > 1 ? 's' : ''
					} of outcome '${
					marketData.outcomes[p.outcome - 1].name
					}' at ${
				p.buyPrice || p.sellPrice
					} ETH created.`;

				dispatch(
					updateExistingTransaction(
						transactionID,
						{
							status: ORDER_BOOK_ORDER_COMPLETE,
							message
						}
					)
				);

				break;
			case ORDER_BOOK_OUTCOME_COMPLETE:
				message = `Order book creation for outcome '${
					marketData.outcomes[p.outcome - 1].name
					}' completed.`;

				dispatch(
					updateExistingTransaction(
						transactionID,
						{
							status: ORDER_BOOK_OUTCOME_COMPLETE,
							message
						}
					)
				);

				break;
			case SUCCESS:
				dispatch(
					updateExistingTransaction(
						transactionID,
						{
							status: SUCCESS,
							message
						}
					)
				);

				break;
			default:
				break;
		}
	};
}

