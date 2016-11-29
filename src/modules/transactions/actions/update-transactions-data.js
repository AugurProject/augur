import { processTransactions } from '../../transactions/actions/process-transactions';
export const UPDATE_TRANSACTIONS_DATA = 'UPDATE_TRANSACTIONS_DATA';

export function updateTransactionsData(transactionsData) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_TRANSACTIONS_DATA, transactionsData });
		dispatch(processTransactions());
	};
}
