import memoizerific from 'memoizerific';

import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';

export default function() {
	var { transactions } = require('../../../selectors');
	return selectNextToProcess(transactions);
}

export const selectNextToProcess = memoizerific(1)(function(transactions) {
    return transactions.slice().reverse().find(transaction => transaction.status === PENDING);
});