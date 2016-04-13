import memoizerific from 'memoizerific';

import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-headers';

import store from '../../../store';

import * as MarketsActions from '../actions/markets-actions';

export default function() {
	var { selectedMarketsHeader } = store.getState(),
		{ filteredMarkets, favoriteMarkets, reportMarkets } = require('../../../selectors');
	return selectMarketsHeader(selectedMarketsHeader, filteredMarkets, favoriteMarkets, reportMarkets, store.dispatch);
}

export const selectMarketsHeader = memoizerific(1)(function(selectedMarketsHeader, filteredMarkets, favoriteMarkets, reportMarkets, dispatch) {
    return {
    	selectedMarketsHeader,
    	numMarkets: filteredMarkets.length,
    	numFavorites: favoriteMarkets.length,
    	numPendingReports: reportMarkets.length,
        onClickAllMarkets: () => dispatch(MarketsActions.updateSelectedMarketsHeader(null)),
		onClickFavorites: () => dispatch(MarketsActions.updateSelectedMarketsHeader(FAVORITES)),
		onClickPendingReports: () => dispatch(MarketsActions.updateSelectedMarketsHeader(PENDING_REPORTS))
    };
});

