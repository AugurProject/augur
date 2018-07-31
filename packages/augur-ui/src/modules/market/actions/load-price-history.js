import { augur } from 'services/augurjs'
import { updateMarketPriceHistory } from 'modules/market/actions/update-market-price-history'
import logError from 'utils/log-error'

export const loadPriceHistory = (options = {}, callback = logError) => (dispatch, getState) => {
  augur.markets.getMarketPriceHistory(options, (err, priceHistory) => {
    if (err) return callback(err)
    if (priceHistory == null) return callback(null)
    dispatch(updateMarketPriceHistory(options.marketId, priceHistory))
    callback(null, priceHistory)
  })
}
