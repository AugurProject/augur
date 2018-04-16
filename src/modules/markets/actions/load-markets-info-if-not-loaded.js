import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { isMarketLoaded } from 'modules/market/helpers/is-market-loaded'
import logError from 'utils/log-error'

export const loadMarketsInfoIfNotLoaded = (marketIds, callback = logError) => (dispatch, getState) => {
  const { marketsData } = getState()
  const marketIdsToLoad = marketIds.filter(marketId => !isMarketLoaded(marketId, marketsData))

  if (marketIdsToLoad.length === 0) return callback(null)
  dispatch(loadMarketsInfo(marketIdsToLoad, callback))
}
