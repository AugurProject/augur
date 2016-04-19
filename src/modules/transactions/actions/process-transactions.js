import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';

export function processTransactions() {
	return function(dispatch, getState) {
		var { transactions } = require('../../../selectors');
		transactions.forEach(transaction => transaction.status === PENDING && transaction.action(transaction.id));
	};
}