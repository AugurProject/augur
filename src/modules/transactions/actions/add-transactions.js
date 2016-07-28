import { PENDING } from '../../transactions/constants/statuses';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

export function addTransactions(transactionsArray) {
	return (dispatch, getState) => {
		const { blockchain } = getState();
		dispatch(updateTransactionsData(transactionsArray.reduce((p, transaction) => {
			transaction.status = PENDING;
			p[makeTransactionID(blockchain.currentBlockNumber)] = transaction;
			return p;
		}, {})));
	};
}

export function addTransaction(transaction) {
	return addTransactions([transaction]);
}

export function makeTransactionID(currentBlock) {
	return `${currentBlock}-${Date.now()}`;
}
