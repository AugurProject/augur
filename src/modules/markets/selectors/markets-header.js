import memoizerific from 'memoizerific';

import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

import { updateSelectedMarketsHeader } from '../../markets/actions/update-selected-markets-header';

export default function() {
	var { selectedMarketsHeader } = store.getState(),
		{ marketsTotals } = require('../../../selectors');
	return selectMarketsHeader(selectedMarketsHeader, marketsTotals.numFiltered, marketsTotals.numFavorites, marketsTotals.numPendingReports, store.dispatch);
}

export const selectMarketsHeader = memoizerific(1)(function(selectedMarketsHeader, numFiltered, numFavorites, numPendingReports, dispatch) {
    return {
    	selectedMarketsHeader,
    	numMarkets: numFiltered,
    	numFavorites: numFavorites,
    	numPendingReports: numPendingReports,
        onClickAllMarkets: () => dispatch(updateSelectedMarketsHeader(null)),
		onClickFavorites: () => dispatch(updateSelectedMarketsHeader(FAVORITES)),
		onClickPendingReports: () => dispatch(updateSelectedMarketsHeader(PENDING_REPORTS))
    };
});

