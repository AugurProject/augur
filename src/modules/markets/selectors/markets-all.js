import memoizerific from 'memoizerific';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';

import store from '../../../store';

import { assembleMarket, selectMarketReport } from '../../market/selectors/market';

export default function () {
	const { marketsData, favorites, reports, outcomesData, accountPositions, netEffectiveTrades, accountTrades, tradesInProgress, branch, selectedFilterSort, priceHistory, orderBooks, orderCancellation, smallestPositions, loginAccount } = store.getState();

	return selectMarkets(marketsData, favorites, reports, outcomesData, accountPositions, netEffectiveTrades, accountTrades, tradesInProgress, branch, selectedFilterSort, priceHistory, orderBooks, orderCancellation, smallestPositions, loginAccount, store.dispatch);
}

export const selectMarkets = memoizerific(1)((marketsData, favorites, reports, outcomesData, accountPositions, netEffectiveTrades, accountTrades, tradesInProgress, branch, selectedFilterSort, priceHistory, orderBooks, orderCancellation, smallestPositions, loginAccount, dispatch) => {
	if (!marketsData) {
		return [];
	}

	return Object.keys(marketsData).map(marketID => {
		if (!marketID || !marketsData[marketID]) {
			return {};
		}
		const endDate = new Date((marketsData[marketID].endDate * 1000) || 0);
		return assembleMarket(
			marketID,
			marketsData[marketID],
			priceHistory[marketID],
			isMarketDataOpen(marketsData[marketID]),

			!!favorites[marketID],
			outcomesData[marketID],

			selectMarketReport(marketID, reports[marketsData[marketID].branchId]),
			(accountPositions || {})[marketID],
			(netEffectiveTrades || {})[marketID],
			(accountTrades || {})[marketID],
			tradesInProgress[marketID],

			// the reason we pass in the date parts broken up like this, is because date objects are never equal, thereby always triggering re-assembly, never hitting the memoization cache
			endDate.getFullYear(),
			endDate.getMonth(),
			endDate.getDate(),
			branch && branch.isReportRevealPhase,
			orderBooks[marketID],
			orderCancellation,
			(smallestPositions || {})[marketID],
			loginAccount,
			dispatch);

	}).sort((a, b) => {
		const aVal = cleanSortVal(a[selectedFilterSort.sort]);
		const bVal = cleanSortVal(b[selectedFilterSort.sort]);

		if (bVal < aVal) {
			return selectedFilterSort.isDesc ? -1 : 1;
		} else if (bVal > aVal) {
			return selectedFilterSort.isDesc ? 1 : -1;
		}
		return a.id < b.id ? -1 : 1;
	});
});

function cleanSortVal(val) {
	// if a falsy simple value return it to sort as-is
	if (!val) {
		return val;
	}

	// if this is a formatted number object, with a `value` prop, use that for sorting
	if (val.value || val.value === 0) {
		return val.value;
	}

	// if the val is a string, lowercase it
	if (val.toLowerCase) {
		return val.toLowerCase();
	}

	// otherwise the val is probably a number, either way return it as-is
	return val;
}
