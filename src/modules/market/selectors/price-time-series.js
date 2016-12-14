import memoizerific from 'memoizerific';

import store from '../../../store';

import { blockToDate } from '../../../utils/date-to-block-to-date';

/**
 * Prepares data structure for Highcharts
 *
 * @param {Array} outcomes List of outcomes for market
 * @param {Object} marketPriceHistory
 * @return {Array}
 */
export const selectPriceTimeSeries = memoizerific(1)((outcomes, marketPriceHistory) => {
	const { blockchain } = store.getState();

	if (marketPriceHistory == null) {
		return [];
	}

	return outcomes.map((outcome) => {
		const outcomePriceHistory = marketPriceHistory[outcome.id] || [];

		return {
			name: outcome.name,
			data: outcomePriceHistory.map(priceTimePoint =>
				[
					blockToDate(priceTimePoint.blockNumber, blockchain.currentBlockNumber).getTime(),
					Number(priceTimePoint.price)
				]
			)
		};
	});
});
