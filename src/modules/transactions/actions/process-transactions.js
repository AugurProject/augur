import { PENDING } from '../../transactions/constants/statuses';

export function processTransactions() {
	return (dispatch, getState) => {
		const { transactions } = require('../../../selectors');
		transactions.forEach(transaction => {
			transaction.status === PENDING && transaction.action(transaction.id);
		});
	};
}
