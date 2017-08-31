import memoize from 'memoizee'

/**
 * Prepares data structure for Highcharts
 *
 * @param {Array} outcomes List of outcomes for market
 * @param {Object} marketPriceHistory
 * @return {Array}
 */
export const selectPriceTimeSeries = memoize((outcomes, marketPriceHistory) => {
  if (marketPriceHistory == null) {
    return []
  }

  const priceTimeSeries = outcomes.reduce((p, outcome, i) => {
    p[i] = {}
    p[i].id = outcome.id
    p[i].name = outcome.name
    p[i].data = (marketPriceHistory[outcome.id] || []).map(priceTimePoint => [
      priceTimePoint.timestamp * 1000,
      Number(priceTimePoint.price)
    ]).sort((a, b) => a[0] - b[0])
    return p
  }, []).sort((a, b) => a.id - b.id)

  return priceTimeSeries
}, { max: 1 })
