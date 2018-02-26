import { augur } from 'services/augurjs'
import { updateMarketsData, updateMarketsLoadingStatus } from 'modules/markets/actions/update-markets-data'
import isObject from 'utils/is-object'
import logError from 'utils/log-error'

export const loadMarketsInfo = (marketIds, callback = logError) => (dispatch, getState) => {
  dispatch(updateMarketsLoadingStatus(marketIds, true))

  augur.markets.getMarketsInfo({ marketIds }, (err, marketsDataArray) => {
    if (err) return callback(err)

    const marketsData = marketsDataArray.filter(it => it).reduce((p, marketData) => ({
      ...p,
      [marketData.id]: marketData
    }), {})
    if (marketsData == null || !isObject(marketsData)) {
      return callback(`no markets data received`)
    }
    if (!Object.keys(marketsData).length) return callback(null)
    dispatch(updateMarketsLoadingStatus(marketIds, false))
    dispatch(updateMarketsData(marketsData))
    callback(null, marketsData)
  })
}

export const loadMarketsInfoOnly = (marketIds, callback = logError) => (dispatch, getState) => {
  augur.markets.getMarketsInfo({ marketIds }, (err, marketsDataArray) => {
    if (err) return callback(err)
    const marketInfoIds = Object.keys(marketsDataArray)
    const marketsData = marketsDataArray.reduce((p, marketData) => ({
      ...p,
      [marketData.id]: marketData
    }), {})
    if (!marketInfoIds.length) return callback(null)
    dispatch(updateMarketsData(marketsData))
    callback(null)
  })
}
