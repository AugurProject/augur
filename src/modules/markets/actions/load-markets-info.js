import { augur } from 'services/augurjs'
import { updateMarketsData, updateMarketsLoadingStatus } from 'modules/markets/actions/update-markets-data'
import { loadMarketDetails } from 'modules/market/actions/load-full-market'
import logError from 'utils/log-error'

export const loadMarketsInfo = (marketIDs, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState()
  let marketsData = {}
  marketIDs.forEach((marketID) => {
    marketsData[marketID] = { isLoading: true }
  })
  // dispatch(updateMarketsLoadingStatus(marketIDs, true))
  dispatch(updateMarketsData(marketsData))
  augur.markets.getMarketsInfo({ marketIDs }, (err, marketsDataArray) => {
    if (err) return callback(err)
    marketsDataArray.forEach((marketData, index) => {
      marketsData[marketData.id] = {
        ...marketData,
        isLoading: false
      }
    })
    dispatch(updateMarketsData(marketsData))
    marketsData = getState().marketsData
    const marketInfoIDs = Object.keys(marketsData)
    if (!marketInfoIDs.length) return callback(null)
    console.log('marketInfoIDs', marketInfoIDs)
    marketInfoIDs.filter(marketID => marketsData[marketID].author === loginAccount.address).forEach(marketID => dispatch(loadMarketDetails(marketID)))
    // dispatch(updateMarketsLoadingStatus(marketIDs, false))
    callback(null)
  })
}
