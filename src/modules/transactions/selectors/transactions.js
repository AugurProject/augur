import memoizerific from 'memoizerific';
import { formatShares, formatEther, formatRep } from '../../../utils/format-number';
// import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import store from '../../../store';

export default function () {
	const { transactionsData } = store.getState();
	return selectTransactions(transactionsData);
}

export const selectTransactions = memoizerific(1)((transactionsData) => (
	Object.keys(transactionsData || {})
		.sort((a, b) => {
			const splitA = a.split('-');
			const splitB = b.split('-');

			const firstHalfOfKeyA = parseInt(splitA[0], 10);
			const firstHalfOfKeyB = parseInt(splitB[0], 10);

			if (firstHalfOfKeyA > firstHalfOfKeyB) {
				return -1;
			} else if (firstHalfOfKeyA < firstHalfOfKeyB) {
				return 1;
			}

			const secondHalfOfKeyA = parseInt(splitA[1], 10);
			const secondHalfOfKeyB = parseInt(splitB[1], 10);

			if (secondHalfOfKeyA > secondHalfOfKeyB) {
				return -1;
			}
			return 1;
		})
		.map(id => ({
			...transactionsData[id],
			executionOrder: transactionsData[id].executionOrder || 0,
			gas: transactionsData[id].gas && formatEther(transactionsData[id].gas),
			ether: transactionsData[id].etherWithoutGas &&
			formatEther(transactionsData[id].etherWithoutGas),
			shares: transactionsData[id].sharesChange &&
			formatShares(transactionsData[id].sharesChange),
			rep: transactionsData[id].repChange && formatRep(transactionsData[id].repChange)
		}))
));
