import memoizerific from 'memoizerific';

import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

import * as MarketsActions from '../actions/markets-actions';

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
        onClickAllMarkets: () => dispatch(MarketsActions.updateSelectedMarketsHeader(null)),
		onClickFavorites: () => dispatch(MarketsActions.updateSelectedMarketsHeader(FAVORITES)),
		onClickPendingReports: () => dispatch(MarketsActions.updateSelectedMarketsHeader(PENDING_REPORTS))
    };
});

