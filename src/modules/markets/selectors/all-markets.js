import memoizerific from 'memoizerific';

import store from '../../../store';

import { assembleMarket } from '../../market/selectors/market';

export default function() {
    var { markets, recentlyExpiredMarkets, pendingReports, favorites, outcomes, blockchain } = store.getState(),
    	dispatch = store.dispatch;
    return selectMarkets(markets, recentlyExpiredMarkets, pendingReports, favorites, outcomes, blockchain, dispatch);
}

export const selectMarkets = memoizerific(1)((markets, recentlyExpiredMarkets, pendingReports, favorites, outcomes, blockchain, dispatch) => {
	if (!markets) {
		return [];
	}

    return Object.keys(markets)
    	.map(marketID => {
    		var pendingReport;

			if (!marketID || !markets[marketID]) {
				return {};
			}

			pendingReport = pendingReports[recentlyExpiredMarkets[marketID]];

    		return assembleMarket(
	    		marketID,
	    		markets[marketID],
				!!pendingReport,
				!!pendingReport && pendingReport.reportHash === true,
				!!pendingReport && !!pendingReport.reportHash && !!pendingReport.reportHash.length,
				!!favorites[marketID],
				outcomes[marketID],
				blockchain.currentBlockNumber,
				blockchain.currentBlockMillisSinceEpoch,
				blockchain.isReportConfirmationPhase,
				dispatch
			);
    	})
    	.sort((a, b) => b.creationSortOrder - a.creationSortOrder );
});