import memoizerific from 'memoizerific';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from '../../app/constants/pages';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

export default function() {
	var { activePage, selectedMarketsHeader } = store.getState(),
		{ allMarkets, filteredMarkets, favoriteMarkets } = require('../../../selectors');

	return selectUnpaginatedMarkets(allMarkets, filteredMarkets, favoriteMarkets, activePage, selectedMarketsHeader);
}

export const selectUnpaginatedMarkets = memoizerific(1)(function(allMarkets, filteredMarkets, favoriteMarkets, activePage, selectedMarketsHeader) {
	if (activePage === POSITIONS) {
		return selectPositions(allMarkets);
	}

	if (selectedMarketsHeader === PENDING_REPORTS) {
		return selectPendingReports(allMarkets);
	}

	if (selectedMarketsHeader === FAVORITES) {
		return favoriteMarkets;
	}

	return filteredMarkets;
});

export const selectPendingReports = memoizerific(1)(function(markets) {
	return markets.filter(market => !!market.isPendingReport);
});

export const selectPositions = memoizerific(1)(function(markets) {
	return markets.filter(market => market.positionsSummary && market.positionsSummary.qtyShares.value);
});

