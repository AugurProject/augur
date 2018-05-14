import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

import { map, mapValues } from 'lodash/fp'

const mutatePeriod = map(({ max, min, start, end, startTimestamp, volume }) => ({
  period: new Date(startTimestamp * 1000),
  open: parseFloat(start),
  close: parseFloat(end),
  low: parseFloat(min),
  high: parseFloat(max),
  volume: parseFloat(volume),
}))

const mutateOutcome = mapValues(mutatePeriod)

/**
 *
 * @typedef {Object} LoadCandleStickDataOptions
 * @property {string} marketId
 * @property {number} outcome
 * @property {number} start
 * @property {number} end
 * @property {number} period
 */

/**
 *
 * @param {LoadCandleStickDataOptions} options
 * @param {function} callback
 */
export const loadCandleStickData = (options = {}, callback = logError) => {
  augur.augurNode.submitRequest('getMarketPriceCandlesticks', options, (err, data) => {
    if (err) return callback(err)

    const mutatedData = mutateOutcome(data)
    callback(null, mutatedData)
  })
}
