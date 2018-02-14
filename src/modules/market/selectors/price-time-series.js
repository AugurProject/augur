import memoize from 'memoizee'
import BigNumber from 'bignumber.js'

/**
 * Prepares price history data for charting
 *
 * @param {Object} outcome
 * @param {Object} marketPriceHistory
 * @return {Array}
 */
export const selectPriceTimeSeries = memoize((outcome, marketPriceHistory) => {
  if (outcome == null || marketPriceHistory == null) return []

  return (marketPriceHistory[outcome.id] || []).map(priceTimePoint => [
    priceTimePoint.timestamp * 1000,
    new BigNumber(priceTimePoint.price).toNumber()
  ]).sort((a, b) => a[0] - b[0])
})
