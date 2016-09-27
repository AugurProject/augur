/*
 * Related to current selected market. Moved to separate selector for performance reason - this selector is called every
 * second
 */
import memoizerific from 'memoizerific';
import store from '../../../store';
import formatTimePassed from '../../../utils/format-time-passed';
import { MARKET_DATA_LOADING } from '../../market/actions/load-full-market';

export default function () {
	const { selectedMarketID, marketDataTimestamps, requests, now } = store.getState();
	const marketDataRequest = requests[MARKET_DATA_LOADING] != null ? requests[MARKET_DATA_LOADING][selectedMarketID] : null;
	return getMarketDataAge(selectedMarketID, marketDataTimestamps[selectedMarketID], marketDataRequest, now);
}

export const getMarketDataAge = memoizerific(10)((marketID, marketDataTimestamp, marketDataRequest, now) => {
	let lastUpdatedBefore;
	const isMarketDataLoading = marketDataRequest === true;

	if (marketID == null || marketDataTimestamp == null || now == null) {
		lastUpdatedBefore = 'n/a';
	} else {
		const marketDataAgeMillis = Math.ceil(now - marketDataTimestamp);
		lastUpdatedBefore = formatTimePassed(marketDataAgeMillis);
	}

	return {
		lastUpdatedBefore,
		isMarketDataLoading
	};
});
