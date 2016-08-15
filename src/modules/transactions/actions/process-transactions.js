import { PENDING, SUCCESS, FAILED, INTERRUPTED } from '../../transactions/constants/statuses';

export function processTransactions() {
	return (dispatch, getState) => {
		const { transactions } = require('../../../selectors');
		const pendingTransactions = transactions.filter(transaction => transaction.status === PENDING);

		if (!pendingTransactions || !pendingTransactions.length) {
			return;
		}

		const runningTransactions = transactions.filter(transaction => transaction.status !== PENDING && transaction.status !== SUCCESS && transaction.status !== FAILED && transaction.status !== INTERRUPTED);

		let maxExecutionOrderToExecute = 0;

		if (runningTransactions.length) {
			maxExecutionOrderToExecute = runningTransactions[0].executionOrder;
		} else {
			maxExecutionOrderToExecute = pendingTransactions[pendingTransactions.length - 1].executionOrder;
		}

		pendingTransactions
			.filter(transaction => transaction.executionOrder <= maxExecutionOrderToExecute)
			.forEach(transaction => transaction.action(transaction.id));
	};
}
