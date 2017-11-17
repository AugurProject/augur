import { augur } from 'services/augurjs'
import { clearMarketsData, updateMarketsData, updateMarketsLoadingStatus } from 'modules/markets/actions/update-markets-data'
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets'
import isObject from 'utils/is-object'
import logError from 'utils/log-error'

export const loadMarketsInfo = (marketIDs, callback = logError) => (dispatch, getState) => {
  dispatch(updateMarketsLoadingStatus(marketIDs, true))

  augur.markets.getMarketsInfo({ marketIDs }, (err, marketsDataArray) => {
    if (err) return callback(err)
    const marketsData = marketsDataArray.reduce((p, marketData) => ({
      ...p,
      [marketData.id]: marketData
    }), {})
    if (marketsData == null || !isObject(marketsData)) {
      dispatch(updateHasLoadedMarkets(false))
      return callback(`no markets data received`)
    }
    if (!Object.keys(marketsData).length) return callback(null)
    dispatch(clearMarketsData())
    dispatch(updateMarketsData(marketsData))
    dispatch(updateHasLoadedMarkets(true))
    callback(null, marketsData)
  })
}
