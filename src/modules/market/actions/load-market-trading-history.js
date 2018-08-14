import { augur } from 'services/augurjs'
import { updateMarketTradingHistory } from 'modules/market/actions/update-market-trading-history'
import logError from 'utils/log-error'

export const loadMarketTradingHistory = (options, callback = logError) => (dispatch, getState) => {
  if (options === null || !options.marketId) callback(null)
  const allOptions = Object.assign({ limit: 10, sortBy: 'timestamp', isSortDescending: true }, options)
  augur.augurNode.submitRequest(
    'getTradingHistory',
    {
      ...allOptions,
    }, (err, tradingHistory) => {
      if (err) return callback(err)
      if (tradingHistory == null) return callback(null)
      dispatch(updateMarketTradingHistory(options.marketId, tradingHistory))
      callback(null, tradingHistory)
    },
  )
}
