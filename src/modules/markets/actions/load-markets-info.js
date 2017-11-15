import { augur } from 'services/augurjs'
import { updateMarketsData, updateMarketsLoadingStatus } from 'modules/markets/actions/update-markets-data'
import { loadMarketDetails } from 'modules/market/actions/load-full-market'
import logError from 'utils/log-error'

export const loadMarketsInfo = (marketIDs, callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState()
  dispatch(updateMarketsLoadingStatus(marketIDs, true))
  augur.markets.getMarketsInfo({ marketIDs }, (err, marketsData) => {
    if (err) return callback(err)
    const marketInfoIDs = Object.keys(marketsData)
    if (!marketInfoIDs.length) return callback(null)
    dispatch(updateMarketsData(marketsData))
    marketInfoIDs.filter(marketID => marketsData[marketID].author === loginAccount.address).forEach(marketID => dispatch(loadMarketDetails(marketID)))
    dispatch(updateMarketsLoadingStatus(marketIDs, false))
    callback(null)
  })
}
