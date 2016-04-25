import memoizerific from 'memoizerific';

import { PENDING, SUCCESS, FAILED, INTERRUPTED } from '../../transactions/constants/statuses';

import store from '../../../store';

export default function() {
	var { transactionsData } = store.getState();
	return selectIsWorking(transactionsData);
}

export const selectIsWorking = memoizerific(1)(function(transactionsData) {
	return Object.keys(transactionsData || {}).some(id => [PENDING, SUCCESS, FAILED, INTERRUPTED].indexOf(transactionsData[id].status) < 0);
});
