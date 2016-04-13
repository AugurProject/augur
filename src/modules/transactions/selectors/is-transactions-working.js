import memoizerific from 'memoizerific';

import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';

import store from '../../../store';

export default function() {
	var { transactions } = store.getState();
	return selectIsWorking(transactions);
}

export const selectIsWorking = memoizerific(1)(function(transactions) {
	return Object.keys(transactions || {}).some(id => transactions[id].status !== PENDING && transactions[id].status !== SUCCESS && transactions[id].status !== FAILED);
});
