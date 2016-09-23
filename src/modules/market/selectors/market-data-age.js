/*
 * Related to current selected market. Moved to separate selector for performance reason - this selector is called every
 * second
 */
import memoizerific from 'memoizerific';
import store from '../../../store';
import selectMarketDataUpdater from '../../markets/selectors/market-data-updater';
import formatTimePassed from '../../../utils/format-time-passed';

export default function () {
	const { selectedMarketID, marketDataTimestamps, now } = store.getState();
	return getMarketDataAge(selectedMarketID, marketDataTimestamps, now);
}

export const getMarketDataAge = memoizerific(10)((marketID, marketDataTimestamps, now) => {
	let lastUpdatedBefore;
	let isUpdateButtonDisabled;
	if (marketID == null || marketDataTimestamps == null || marketDataTimestamps[marketID] == null || now == null) {
		lastUpdatedBefore = 'n/a';
		isUpdateButtonDisabled = true;
	} else {
		const marketDataAgeMillis = Math.ceil(now - marketDataTimestamps[marketID]);
		const updateIntervalSecs = selectMarketDataUpdater().updateIntervalSecs;
		lastUpdatedBefore = formatTimePassed(marketDataAgeMillis);
		isUpdateButtonDisabled = (marketDataAgeMillis / 1000) < updateIntervalSecs;
	}

	return {
		lastUpdatedBefore,
		isUpdateButtonDisabled
	};
});
