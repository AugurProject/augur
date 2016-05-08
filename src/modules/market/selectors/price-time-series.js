import memoizerific from 'memoizerific';

import store from '../../../store';

import { blockToDate } from '../../../utils/date';

/**
 * Prepares data structure for Highcharts
 *
 * @param {Array} outcomes List of outcomes for market
 * @param {Object} marketPriceHistory
 * @return {Array}
 */
export const selectPriceTimeSeries = memoizerific(1)((outcomes, marketPriceHistory) => {
    let { blockchain } = store.getState();

    return outcomes.map((outcome) => {
        let outcomePriceHistory = marketPriceHistory[outcome.id] || [];

        return {
            name: outcome.name,
            data: outcomePriceHistory.map((priceTimePoint) => {
                return [
                    blockToDate(priceTimePoint.blockNumber, blockchain.currentBlockNumber).unix() * 1000,
                    Number(priceTimePoint.price)
                ]
            })
        };
    });
});