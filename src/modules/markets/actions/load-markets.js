import { augur } from 'services/augurjs'
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets'
import { clearMarketsData, updateMarketsData } from 'modules/markets/actions/update-markets-data'
import isObject from 'utils/is-object'
import logError from 'utils/log-error'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

const loadMarkets = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  augur.augurNode.submitRequest('getMarkets', { universe: universe.id }, (err, marketsArray) => {
    if (err) return callback(err)
    dispatch(loadMarketsInfo(marketsArray))
    // augur.markets.getMarketsInfo({ universe: universe.id, marketIDs: marketsArray }, (err, marketsDataArray) => {
    //   if (err) return callback(err)
    //   const marketsData = {}
    //   marketsDataArray.forEach((marketData, index) => {
    //     marketsData[marketData.id] = marketData
    //   })
    //   if (marketsData == null || !isObject(marketsData)) {
    //     dispatch(updateHasLoadedMarkets(false))
    //     return callback(`no markets data received`)
    //   }
    //   if (!Object.keys(marketsData).length) return callback(null)
    //   dispatch(clearMarketsData())
    //   dispatch(updateMarketsData(marketsData))
    //   dispatch(updateHasLoadedMarkets(true))
    //   callback(null, marketsData)
    // })
  })
}

export default loadMarkets
