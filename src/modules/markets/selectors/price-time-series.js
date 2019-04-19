/**
 * Prepares price history data for charting
 *
 * @param {Object} outcome
 * @param {Object} marketPriceHistory
 * @return {Array}
 */
export const selectPriceTimeSeries = (outcome, marketPriceHistory) => {
  if (outcome == null || outcome.id == null || marketPriceHistory == null) {
    return [];
  }

  return marketPriceHistory
    .filter(hist => hist.outcome.toString() === outcome.id)
    .map(priceTimePoint => ({
      price: priceTimePoint.price,
      amount: priceTimePoint.amount,
      timestamp: priceTimePoint.timestamp * 1000,
      logIndex: priceTimePoint.logIndex
    }));
};
