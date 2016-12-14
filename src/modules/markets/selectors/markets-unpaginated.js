import memoizerific from 'memoizerific';

import { MY_POSITIONS } from '../../app/constants/views';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

export default function () {
	const { activeView, selectedMarketsHeader } = store.getState();
	const { allMarkets, filteredMarkets, favoriteMarkets } = require('../../../selectors');

	return selectUnpaginatedMarkets(
		allMarkets,
		filteredMarkets,
		favoriteMarkets,
		activeView,
		selectedMarketsHeader
	);
}

export const selectPendingReports = memoizerific(1)(markets =>
	markets.filter(market => !!market.isPendingReport)
);

export const selectPositions = memoizerific(1)(markets =>
	markets.filter(market => market.positionsSummary && market.positionsSummary.qtyShares.value)
);

export const selectUnpaginatedMarkets = memoizerific(1)((allMarkets, filteredMarkets, favoriteMarkets, activeView, selectedMarketsHeader) => {
	if (activeView === MY_POSITIONS) {
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
