import memoizerific from 'memoizerific';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from '../../app/constants/pages';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

export default function() {
    var { activePage, selectedMarketsHeader, pagination } = store.getState(),
    	{ unpaginatedMarkets } = require('../../../selectors');

    if (activePage !== POSITIONS && selectedMarketsHeader !== PENDING_REPORTS) {
    	return selectPaginated(unpaginatedMarkets, pagination.selectedPageNum, pagination.numPerPage);
    }
    else {
        return unpaginatedMarkets;
    }
}

export const selectPaginated = memoizerific(1)(function(markets, pageNum, numPerPage) {
    return markets.slice((pageNum - 1) * numPerPage, pageNum * numPerPage);
});

