import { GENERATE_ORDER_BOOK } from '../../transactions/constants/types';
import { createOrderBook } from '../../create-market/actions/generate-order-book';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const makeGenerateOrderBookTransaction = (marketData, dispatch) => {
	const obj = {
		type: GENERATE_ORDER_BOOK,
		data: marketData,
		description: marketData.description,
		action: transactionID => dispatch(createOrderBook(transactionID, marketData))
	};
	return obj;
};

export const addGenerateOrderBookTransaction = marketData =>
	dispatch =>
		dispatch(
			addTransaction(
				makeGenerateOrderBookTransaction(
					marketData,
					dispatch
				)
			)
		);
