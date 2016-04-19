import memoizerific from 'memoizerific';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from '../../app/constants/pages';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

import { selectFilteredMarkets } from '../../markets/selectors/filtered-markets';

export default function() {
    var { activePage, selectedMarketsHeader, keywords, selectedFilters } = store.getState(),
    	{ allMarkets } = require('../../../selectors');

    if (activePage === POSITIONS) {
    	return selectPositions(allMarkets);
    }

    if (selectedMarketsHeader === PENDING_REPORTS) {
    	return selectPendingReports(allMarkets);
    }

    var filteredMarkets = selectFilteredMarkets(allMarkets, keywords, selectedFilters);

    if (selectedMarketsHeader === FAVORITES) {
    	return selectFavorites(filteredMarkets);
    }

	return filteredMarkets;
}

export const selectFavorites = memoizerific(1)(function(markets) {
    return markets.filter(market => !!market.isFavorite);
});

export const selectPendingReports = memoizerific(1)(function(markets) {
    return markets.filter(market => !!market.isPendingReport);
});

export const selectPositions = memoizerific(1)(function(markets) {
    return markets.filter(market => market.positionsSummary && market.positionsSummary.qtyShares.value);
});

