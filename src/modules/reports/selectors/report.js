import memoizerific from 'memoizerific';

import store from '../../../store';

export default function() {
	var { selectedMarketID, recentlyExpiredMarkets, pendingReports } = store.getState();

	if (!selectedMarketID) {
		return {};
	}

	return pendingReports[recentlyExpiredMarkets[selectedMarketID]] || {};
}