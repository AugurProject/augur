import memoize from 'memoizee';

/**
 * Prepares data structure for Highcharts
 *
 * @param {Array} outcomes List of outcomes for market
 * @param {Object} marketPriceHistory
 * @return {Array}
 */
export const selectPriceTimeSeries = memoize((outcomes, marketPriceHistory) => {
  if (marketPriceHistory == null) {
    return [];
  }

  return outcomes.map((outcome) => {
    const outcomePriceHistory = marketPriceHistory[outcome.id] || [];

    return {
      name: outcome.name,
      data: outcomePriceHistory.map(priceTimePoint => [
        priceTimePoint.timestamp * 1000,
        Number(priceTimePoint.price)
      ])
    };
  });
}, { max: 1 });
