import memoize from 'memoizee'
// import { BigNumber, WrappedBigNumber } from 'utils/wrapped-big-number'

/**
 * Prepares price history data for charting
 *
 * @param {Object} outcome
 * @param {Object} marketPriceHistory
 * @return {Array}
 */
export const selectPriceTimeSeries = memoize((outcome, marketPriceHistory) => {
  if (outcome == null || marketPriceHistory == null || marketPriceHistory.outcome == null) return []

  return marketPriceHistory.map(priceTimePoint => ({ ...priceTimePoint, timestamp: priceTimePoint.timestamp * 1000 }))

  // NOTE -- historical ref, augur-node now directly returns what we require
  // return (marketPriceHistory[outcome.id] || []).map(priceTimePoint => [
  //   priceTimePoint.timestamp * 1000,
  //   WrappedBigNumber(priceTimePoint.price).toNumber(),
  //   WrappedBigNumber(priceTimePoint.amount).toNumber()
  // ]).sort((a, b) => a[0] - b[0])
})
