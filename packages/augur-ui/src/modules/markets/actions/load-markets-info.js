import { augur } from 'services/augurjs'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { updateMarketLoading, removeMarketLoading } from 'modules/market/actions/update-market-loading'
import logError from 'utils/log-error'

import { MARKET_INFO_LOADING, MARKET_INFO_LOADED } from 'modules/market/constants/market-loading-states'

export const loadMarketsInfo = (marketIds, callback = logError) => (dispatch, getState) => {
  if (!marketIds || marketIds.length === 0) {
    return callback(null, [])
  }
  marketIds.map(marketId => dispatch(updateMarketLoading({ [marketId]: MARKET_INFO_LOADING })))

  augur.markets.getMarketsInfo({ marketIds }, (err, marketsDataArray) => {
    if (err) return loadingError(dispatch, callback, err, marketIds)

    if (marketsDataArray == null || !marketsDataArray.length) return loadingError(dispatch, callback, `no markets data received`, marketIds)

    const marketsData = marketsDataArray.filter(marketHasData => marketHasData).reduce((p, marketData) => {
      if (marketData.id == null) return p

      return {
        ...p,
        [marketData.id]: marketData,
      }
    }, {})

    if (!Object.keys(marketsData).length) return loadingError(dispatch, callback, null, marketIds)

    Object.keys(marketsData).forEach(marketId => dispatch(updateMarketLoading({ [marketId]: MARKET_INFO_LOADED })))
    dispatch(updateMarketsData(marketsData))
    callback(null, marketsData)
  })
}

function loadingError(dispatch, callback, error, marketIds) {
  (marketIds || []).map(marketId => dispatch(removeMarketLoading(marketId)))
  callback(error)
}
