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
		const markets = require('../selectors').markets;
		const market = markets[marketId];
		if (market != null) {
			market.lastUpdatedBefore = '1 second ago';
			market.isUpdateButtonDisabled = true;
			require('../selectors').update({
				markets
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
		const market = require('../selectors').market;
		if (market != null) {
			const lastUpdatedBeforeSecs = parseInt(market.lastUpdatedBefore, 10);
			market.lastUpdatedBefore = `${(lastUpdatedBeforeSecs + 1)} seconds ago`;
			market.isUpdateButtonDisabled = lastUpdatedBeforeSecs < UPDATE_INTERVAL_SECS;
			require('../selectors').update({
				market
			});
		}
	}, 1000);
}
