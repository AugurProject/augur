import { PENDING } from '../../transactions/constants/statuses';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

export function makeTransactionID() {
	return Math.round(Date.now() + (window.performance.now() * 100));
}

export function addTransactions(transactionsArray) {
	return (dispatch, getState) => {
		dispatch(updateTransactionsData(transactionsArray.reduce((p, transaction) => {
			transaction.status = PENDING;
			const transactionID = makeTransactionID();
			transaction.id = transactionID;
			p[transactionID] = transaction;
			return p;
		}, {})));
	};
}

export function addTransaction(transaction) {
	return addTransactions([transaction]);
}
