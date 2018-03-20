import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import logError from 'utils/log-error'

export const loadDataForMarketTransaction(eventName, log, callback = logError) => (dispatch, getState) => {
  const marketId = log.marketId || log.market
  if (marketId == null) return callback(`no market ID found in log ${JSON.stringify(log)}`)
  const market = getState().marketsData[marketId]
  if (market != null && market.description != null) return callback(null, market)
  dispatch(loadMarketsInfo([marketId], (err, marketsData) => {
    if (err) return callback(err)
    callback(null, marketsData[marketId])
  }))
}
