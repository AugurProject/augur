import { PENDING } from '../../transactions/constants/statuses';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

export function makeTransactionID() {
	return Math.round(Date.now() + (window.performance.now() * 100));
}

export function addTransactions(transactionsArray) {
	return (dispatch, getState) => {
		dispatch(updateTransactionsData(transactionsArray.reduce((p, transaction) => {
			transaction.status = PENDING;
			p[makeTransactionID()] = transaction;
			return p;
		}, {})));
	};
}

export function addTransaction(transaction) {
	return addTransactions([transaction]);
}
