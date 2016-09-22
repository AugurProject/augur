import memoizerific from 'memoizerific';
import store from '../../../store';
import selectMarketDataUpdater from '../../markets/selectors/market-data-updater';
import formatTimePassed from '../../../utils/format-time-passed';

export default function () {
	const { selectedMarketID, marketDataTimestamps, now } = store.getState();
	return getMarketDataAge(selectedMarketID, marketDataTimestamps, now);
}

const getMarketDataAge = memoizerific(10)((marketID, marketDataTimestamps, now) => {
	if (marketID == null || marketDataTimestamps == null) {
		return null;
	}

	const marketDataAgeSecs = Math.ceil((now - marketDataTimestamps[marketID]) / 1000);
	const updateIntervalSecs = selectMarketDataUpdater().updateIntervalSecs;
	return {

		lastUpdatedBefore: formatTimePassed(marketDataAgeSecs * 1000),
		isUpdateButtonDisabled: marketDataAgeSecs < updateIntervalSecs
	};
});
