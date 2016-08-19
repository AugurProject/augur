import memoizerific from 'memoizerific';
import { formatShares, formatEther, formatRep } from '../../../utils/format-number';
// import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import store from '../../../store';

export default function () {
	const { transactionsData } = store.getState();
	return selectTransactions(transactionsData);
}

export const selectTransactions = memoizerific(1)((transactionsData) => {
	let splitA;
	let splitB;
	let valA;
	let valB;

	return Object.keys(transactionsData || {})
		.sort((a, b) => {
			splitA = a.split('-');
			splitB = b.split('-');

			valA = parseInt(splitA[0], 10);
			valB = parseInt(splitB[0], 10);

			if (valA > valB) {
				return -1;
			} else if (valB > valA) {
				return 1;
			}

			valA = parseInt(splitA[1], 10);
			valB = parseInt(splitB[1], 10);

			if (valA > valB) {
				return -1;
			}
			return 1;
		})
		.map(id => {
			const obj = {
				...transactionsData[id],
				gas: transactionsData[id].gas && formatEther(transactionsData[id].gas),
				ether: transactionsData[id].etherWithoutGas &&
				formatEther(transactionsData[id].etherWithoutGas),
				shares: transactionsData[id].sharesChange &&
				formatShares(transactionsData[id].sharesChange),
				rep: transactionsData[id].repChange && formatRep(transactionsData[id].repChange)
			};
			return obj;
		});
});
