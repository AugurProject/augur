import memoizerific from 'memoizerific';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from '../../app/constants/pages';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';
import { MARKET_TYPES, BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { MARKET_STATUSES, OPEN, RECENTLY_EXPIRED } from '../../markets/constants/market-statuses';

import store from '../../../store';

export default function() {
    var { activePage, selectedMarketsHeader } = store.getState(),
    	{ allMarkets } = require('../../../selectors');

    if (activePage === POSITIONS) {
    	return selectPositions(allMarkets);
    }

    if (selectedMarketsHeader === FAVORITES) {
    	return selectFavorites(allMarkets);
    }

    if (selectedMarketsHeader === PENDING_REPORTS) {
    	return selectPendingReports(allMarkets);
    }

	return selectFiltered(allMarkets);
}

export const selectFiltered = memoizerific(1)(function(markets) {
    return markets.filter(market => !!market.isFiltersMatch);
});

export const selectFavorites = memoizerific(1)(function(markets) {
    return markets.filter(market => !!market.isFavorite && !!market.isFiltersMatch);
});

export const selectPendingReports = memoizerific(1)(function(markets) {
    return markets.filter(market => !!market.isPendingReport);
});

export const selectPositions = memoizerific(1)(function(markets) {
    return markets.filter(market => market.positionsSummary && market.positionsSummary.qtyShares.value);
});

