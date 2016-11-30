// Starts timer and restarts it on demand

const UPDATE_INTERVAL_SECS = 15;

let timerId = startTimer();

export default {
	/**
	 * Resets market fields and restarts timer
	 * @param marketId
	 */
	update: (marketId) => {
		const marketDataAge = require('../selectors').marketDataAge;

		if (marketDataAge != null) {
			marketDataAge.lastUpdatedBefore = '1 second ago';
			marketDataAge.isMarketDataLoading = true;
			setTimeout(() => {
				const marketDataAge = require('../selectors').marketDataAge;

				marketDataAge.isMarketDataLoading = false;
				require('../selectors').update({
					marketDataAge
				});
			}, 1000);
			require('../selectors').update({
				marketDataAge
			});
		}
		clearInterval(timerId);
		timerId = startTimer();
	},
	updateIntervalSecs: UPDATE_INTERVAL_SECS
};

/**
 * Starts timer which periodically updates market fields and redraws the app
 *
 * @return {number} timerID
 */
function startTimer() {
	return setInterval(() => {
		const marketDataAge = require('../selectors').marketDataAge;

		if (marketDataAge != null) {
			const lastUpdatedBeforeSecs = parseInt(marketDataAge.lastUpdatedBefore, 10);
			marketDataAge.lastUpdatedBefore = `${(lastUpdatedBeforeSecs + 1)} seconds ago`;
			require('../selectors').update({
				marketDataAge
			}, { ignore: true });
		}
	}, 1000);
}
