import memoizerific from 'memoizerific';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';
// import { makeDateFromBlock } from '../../../utils/format-number';

import store from '../../../store';

import { assembleMarket } from '../../market/selectors/market';

function cleanSortVal(val) {
	if (val) {
		if (val.value || val.value === 0) {
			return val.value;
		} else if (val.toLowerCase) {
			return val.toLowerCase();
		}
	}
	return val;
}

export const selectMarkets = memoizerific(1)((marketsData, favorites, reports,
	outcomes, accountTrades, tradesInProgress,
	blockchain, selectedSort, priceHistory, dispatch) => {
	if (!marketsData) {
		return [];
	}

/*
	var markets = [],
		marketKeys,
		len,
		i;
	marketKeys = Object.keys(marketsData);
	len = marketKeys.length;
console.time('selectMarkets');

	for (i = 0; i < len; i++) {
		markets.push(assembleMarket(
			marketKeys[i],
			marketsData[marketKeys[i]],
			isMarketDataOpen(marketsData[marketKeys[i]], blockchain && blockchain.currentBlockNumber),

			!!favorites[marketKeys[i]],
			outcomes[marketKeys[i]],

			reports[marketsData[marketKeys[i]].eventID],
			accountTrades[marketKeys[i]],
			tradesInProgress[marketKeys[i]],
			formatBlockToDate(marketsData[marketKeys[i]].endDate,
 	blockchain.currentBlockNumber, blockchain.currentBlockMillisSinceEpoch),
			blockchain && blockchain.isReportConfirmationPhase,
			dispatch));
	}

	markets.sort((a, b) => {
		var aVal = cleanSortVal(a[selectedSort.prop]),
			bVal = cleanSortVal(b[selectedSort.prop]);

		if (bVal < aVal) {
			return selectedSort.isDesc ? -1 : 1;
		}
		else if (bVal > aVal) {
			return selectedSort.isDesc ? 1 : -1;
		}

		return a.id < b.id ? -1 : 1;
	});
*/
	return Object.keys(marketsData)
		.map(marketID => {
			const endDate = new Date(marketsData[marketID].endDate);
			// this is here for performance reasons not to trigger memoization on every block
			return assembleMarket(
				marketID,
				marketsData[marketID],
				priceHistory[marketID],
				isMarketDataOpen(marketsData[marketID], blockchain && blockchain.currentBlockNumber),

				!!favorites[marketID],
				outcomes[marketID],

				reports[marketsData[marketID].eventID],
				accountTrades[marketID],
				tradesInProgress[marketID],
				endDate.getFullYear(),
				endDate.getMonth(),
				endDate.getDate(),
				blockchain && blockchain.isReportConfirmationPhase,
				dispatch);
		})
		.sort((a, b) => {
			const aVal = cleanSortVal(a[selectedSort.prop]);
			const bVal = cleanSortVal(b[selectedSort.prop]);

			if (bVal < aVal) {
				return selectedSort.isDesc ? -1 : 1;
			} else if (bVal > aVal) {
				return selectedSort.isDesc ? 1 : -1;
			}
			return a.id < b.id ? -1 : 1;
		});
});

export default function () {
	const { marketsData, favorites, reports,
					outcomes, accountTrades, tradesInProgress,
					blockchain, selectedSort, priceHistory } = store.getState();

	return selectMarkets(
		marketsData, favorites, reports,
		outcomes, accountTrades, tradesInProgress,
		blockchain, selectedSort, priceHistory, store.dispatch
	);
}
