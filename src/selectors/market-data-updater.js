/*
 * Starts timer and restarts it on demand
 */

const UPDATE_INTERVAL_SECS = 15;

let timerId = startTimer();

export default {
	/**
	 * Resets market fields and restarts timer
	 * @param marketId
	 */
	update: marketId => {
		const marketDataAge = require('../selectors').marketDataAge;
		if (marketDataAge != null) {
			marketDataAge.lastUpdatedBefore = '1 second ago';
			marketDataAge.isUpdateButtonDisabled = true;
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
			marketDataAge.isUpdateButtonDisabled = lastUpdatedBeforeSecs < UPDATE_INTERVAL_SECS;
			require('../selectors').update({
				marketDataAge
			}, { ignore: true });
		}
	}, 1000);
}
