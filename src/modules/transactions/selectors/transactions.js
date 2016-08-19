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
			let splitA = a.split('-');
			let splitB = b.split('-');

			let firstHalfOfKeyA = parseInt(splitA[0], 10);
			let firstHalfOfKeyB = parseInt(splitB[0], 10);

			if (firstHalfOfKeyA > firstHalfOfKeyB) {
				return -1;
			} else if (firstHalfOfKeyA < firstHalfOfKeyB) {
				return 1;
			}

			let secondHalfOfKeyA = parseInt(splitA[1], 10);
			let secondHalfOfKeyB = parseInt(splitB[1], 10);

			if (secondHalfOfKeyA > secondHalfOfKeyB) {
				return -1;
			}
			return 1;
		})
		.map(id => {
			return {
				...transactionsData[id],
				gas: transactionsData[id].gas && formatEther(transactionsData[id].gas),
				ether: transactionsData[id].etherWithoutGas &&
				formatEther(transactionsData[id].etherWithoutGas),
				shares: transactionsData[id].sharesChange &&
				formatShares(transactionsData[id].sharesChange),
				rep: transactionsData[id].repChange && formatRep(transactionsData[id].repChange)
			};
		})
));
