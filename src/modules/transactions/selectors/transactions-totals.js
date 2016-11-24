import memoizerific from 'memoizerific';
import { PENDING, SUCCESS, FAILED, INTERRUPTED } from '../../transactions/constants/statuses';

export default function () {
	const { transactions } = require('../../../selectors');
	return selectTransactionsTotals(transactions);
}

export const selectTransactionsTotals = memoizerific(1)((transactions) => {
	const o = {
		numWorking: 0,
		numPending: 0,
		numComplete: 0,
		numWorkingAndPending: 0,
		numTotal: 0,
		title: ''
	};

	o.transactions = transactions.forEach(transaction => {
		o.numTotal++;
		if (transaction.status === PENDING) {
			o.numPending++;
		} else if ([SUCCESS, FAILED, INTERRUPTED].indexOf(transaction.status) >= 0) {
			o.numComplete++;
		} else {
			o.numWorking++;
		}
	});

	o.numWorkingAndPending = o.numPending + o.numWorking;

	if (o.numWorkingAndPending) {
		o.title =
		`Transaction${(o.numWorkingAndPending !== 1 ? 's' : '')} Working`;
		o.shortTitle = `${o.numPending} Working`;
	} else {
		o.title = `${o.numTotal} Transaction${(o.numTotal !== 1 ? 's' : '')}`;
		o.shortTitle = `${o.numTotal} Total`;
	}

	return o;
});
