import memoizerific from 'memoizerific';
import {
	// MARKETS,
	// MAKE,
	POSITIONS,
	// TRANSACTIONS,
	// M
} from '../../app/constants/pages';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';
import store from '../../../store';
import { selectFilteredMarkets } from '../../markets/selectors/filtered-markets';

export const selectPaginated = memoizerific(1)((markets, pageNum, numPerPage) =>
	markets.slice((pageNum - 1) * numPerPage, pageNum * numPerPage)
);

export const selectFavorites = memoizerific(1)((markets) =>
	markets.filter(market => !!market.isFavorite)
);

export const selectPendingReports = memoizerific(1)((markets) =>
	markets.filter(market => !!market.isPendingReport)
);

export const selectPositions = memoizerific(1)((markets) =>
	markets.filter(market =>
		market.positionsSummary && market.positionsSummary.qtyShares.value)
);

export const selectUnpaginated = memoizerific(1)(
(allMarkets, activePage, selectedMarketsHeader, keywords, selectedFilters) => {
	if (activePage === POSITIONS) {
		return selectPositions(allMarkets);
	}

	if (selectedMarketsHeader === PENDING_REPORTS) {
		return selectPendingReports(allMarkets);
	}

	const filteredMarkets = selectFilteredMarkets(allMarkets, keywords, selectedFilters);

	if (selectedMarketsHeader === FAVORITES) {
		return selectFavorites(filteredMarkets);
	}

	return filteredMarkets;
});

export default function () {
	const { activePage, selectedMarketsHeader,
	keywords, selectedFilters, pagination } = store.getState();
	const { allMarkets } = require('../../../selectors');
	const unpaginated = selectUnpaginated(
		allMarkets,
		activePage,
		selectedMarketsHeader,
		keywords,
		selectedFilters);

	if (activePage !== POSITIONS && selectedMarketsHeader !== PENDING_REPORTS) {
		return selectPaginated(unpaginated, pagination.selectedPageNum, pagination.numPerPage);
	}
	return unpaginated;
}
