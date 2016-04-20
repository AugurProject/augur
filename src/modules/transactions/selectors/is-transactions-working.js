import memoizerific from 'memoizerific';

import { PENDING, SUCCESS, FAILED, INTERRUPTED } from '../../transactions/constants/statuses';

import store from '../../../store';

export default function() {
	var { transactions } = store.getState();
	return selectIsWorking(transactions);
}

export const selectIsWorking = memoizerific(1)(function(transactions) {
	return Object.keys(transactions || {}).some(id => [PENDING, SUCCESS, FAILED, INTERRUPTED].indexOf(transactions[id].status) < 0);
});
