import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import loadBidsAsks from 'modules/bids-asks/actions/load-bids-asks'
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades'
import { loadPriceHistory } from 'modules/market/actions/load-price-history'
import { addMarketLoading, removeMarketLoading } from 'modules/market/actions/update-market-loading'
import logError from 'utils/log-error'

export const loadFullMarket = (marketID, callback = logError) => (dispatch, getState) => {
  const { marketsData } = getState()
  dispatch(addMarketLoading(marketID))

  // if the basic data is already loaded, just load the details
  if (marketsData[marketID]) return dispatch(loadMarketDetails(marketID))

  // if the basic data hasn't loaded yet, load it first
  dispatch(loadMarketsInfo([marketID], (err) => {
    if (err) return callback(err)
    dispatch(loadMarketDetails(marketID, callback))
  }))
}

// load price history, and other non-basic market details here, dispatching
// the necessary actions to save each part in relevant state
export const loadMarketDetails = (marketID, callback = logError) => dispatch => (
  dispatch(loadBidsAsks(marketID, (err) => {
    if (err) return callback(err)
    dispatch(loadAccountTrades({ market: marketID }, (err) => {
      if (err) return callback(err)
      dispatch(loadPriceHistory({ market: marketID }, (err) => {
        if (err) return callback(err)
        dispatch(removeMarketLoading(marketID))
        callback(null)
      }))
    }))
  }))
)
