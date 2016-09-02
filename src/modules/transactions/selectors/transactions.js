import memoizerific from 'memoizerific';
import { formatShares, formatEther, formatRep } from '../../../utils/format-number';
// import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import store from '../../../store';
import { selectMarketLink } from '../../link/selectors/links';

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
			let marketLink = null;
			if (transactionsData[id].data && (transactionsData[id].data.id || transactionsData[id].data.marketID) && (transactionsData[id].data.description || transactionsData[id].data.marketDescription)) {
				marketLink = selectMarketLink(
					{
						id: transactionsData[id].data.id || transactionsData[id].data.marketID,
						description: transactionsData[id].data.description || transactionsData[id].data.marketDescription
					},
					store.dispatch
				);
			}

			const obj = {
				...transactionsData[id],
				data: {
					...transactionsData[id].data,
					marketLink
				},
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
